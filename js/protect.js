/* js/protect.js
   Client-side page-gate protection.
   WARNING: This is only client-side. It prevents casual visitors from seeing content,
   but it is NOT secure: any user can view source, fetch files directly, or bypass it.

   Usage:
   - Include this script in your head.
   - Call SiteProtect.init([...matchers...]) or provide a separate config file.

   Matcher shape (example):
   {
     id: 'perguntas',                 // unique id used for localStorage key
     pathPrefix: '/perguntas&respostas/', // match by path prefix (optional)
     hostname: 'example.com',         // optional host match (string or regex string)
     password: 'S3nh@123',            // plaintext password (insecure, but simple)
     title: 'Área Restrita',          // modal title
     message: 'Insira a senha para acessar esta seção',
     rememberDays: 7                  // days to remember in localStorage
   }
*/
(function (window, document) {
  if (!window.SiteProtect) window.SiteProtect = {};

  var helpers = {
    lsKey: function (id) { return 'site_protect_' + id; },
    nowSec: function () { return Math.floor(Date.now() / 1000); },
    expireSec: function (days) { return helpers.nowSec() + Math.floor((days || 7) * 86400); },
    // Cookie helpers
    setCookie: function (name, value, days) {
      try {
        var d = new Date();
        d.setTime(d.getTime() + Math.floor((days || 7) * 86400 * 1000));
        var cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax';
        if (location.protocol === 'https:') cookie += '; Secure';
        document.cookie = cookie;
      } catch (e) {}
    },
    getCookie: function (name) {
      try {
        var arr = (document.cookie || '').split(';');
        for (var i = 0; i < arr.length; i++) {
          var c = arr[i].trim();
          if (!c) continue;
          if (c.indexOf(name + '=') === 0) return decodeURIComponent(c.substring(name.length + 1));
        }
      } catch (e) {}
      return null;
    },
    delCookie: function (name) {
      try {
        var cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
        if (location.protocol === 'https:') cookie += '; Secure';
        document.cookie = cookie;
      } catch (e) {}
    },
    // weak signing using a build-time secret present in a <meta> tag.
    getSecret: function () {
      var m = document.querySelector('meta[name="site-protect-secret"]');
      return m ? (m.getAttribute('content') || '') : '';
    },
    sha256: async function (str) {
      const enc = new TextEncoder();
      const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
      const arr = Array.from(new Uint8Array(buf));
      return arr.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    sign: async function (payload) {
      var sec = helpers.getSecret();
      return helpers.sha256(payload + '|' + sec);
    }
  };

  function lockPage() {
    try { document.documentElement.classList.add('sp-prehide'); } catch (e) {}
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
  }
  function revealPage() {
    try { document.documentElement.classList.remove('sp-prehide'); } catch (e) {}
    try { document.body.style.overflow = ''; } catch (e) {}
  }

  function matchesMatcher(matcher) {
    try {
      var hostOk = true;
      if (matcher.hostname) {
        if (/^\/.+\/$/.test(matcher.hostname)) { // regex-like /.../
          var re = new RegExp(matcher.hostname.slice(1, -1));
          hostOk = re.test(location.hostname);
        } else {
          hostOk = location.hostname === matcher.hostname;
        }
      }
      var pathOk = true;
      if (matcher.pathPrefix) {
        // normalize current path: decode, remove trailing index.html
        var currentPath = decodeURIComponent(location.pathname || '/');
        // strip site baseurl if provided globally
        try {
          var base = (window.SITE_BASEURL || '').trim();
          if (base && currentPath.indexOf(base + '/') === 0) currentPath = currentPath.slice(base.length);
          if (base && currentPath === base) currentPath = '/';
        } catch (e) {}
        if (currentPath.endsWith('/index.html')) currentPath = currentPath.slice(0, -'index.html'.length);
        // desired prefix (without forcing trailing slash)
        var prefix = matcher.pathPrefix;
        if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
        pathOk = (currentPath === prefix) || (currentPath === prefix + '/') || (currentPath.indexOf(prefix + '/') === 0);
      }
      return hostOk && pathOk;
    } catch (e) { return false; }
  }

  async function isAuthenticated(id) {
    try {
      var v = helpers.getCookie(helpers.lsKey(id));
      if (!v) return false;
      // expected format: ts.payload.sig
      var parts = v.split('.');
      if (parts.length !== 3) return false;
      var ts = parts[0];
      var payload = parts[1];
      var sig = parts[2];
      var expected = await helpers.sign(ts + '.' + payload);
      return sig === expected;
    } catch (e) { return false; }
  }

  async function setAuthenticated(id, days) {
    // create a signed value that includes a timestamp and id
    var ts = String(Date.now());
    var payload = btoa(id).replace(/=+$/,'');
    var sig = await helpers.sign(ts + '.' + payload);
    var value = ts + '.' + payload + '.' + sig;
    helpers.setCookie(helpers.lsKey(id), value, days);
    try { localStorage.removeItem(helpers.lsKey(id)); } catch (e) {}
  }

  function clearAuthenticated(id) {
    helpers.delCookie(helpers.lsKey(id));
    try { localStorage.removeItem(helpers.lsKey(id)); } catch (e) {}
  }

  function createModal(matcher, onSuccess) {
    // overlay
    var overlay = document.createElement('div');
    overlay.className = 'sp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // modal
    var modal = document.createElement('div');
    modal.className = 'sp-modal';

    var title = document.createElement('h2');
    title.textContent = matcher.title || 'Área Restrita';
    title.className = 'sp-title';

    var msg = document.createElement('p');
    msg.textContent = matcher.message || 'Insira a senha para continuar.';
    msg.className = 'sp-message';

    var input = document.createElement('input');
    input.type = 'password';
    input.className = 'sp-input';
    input.placeholder = 'Senha';
    input.autocomplete = 'current-password';

    var error = document.createElement('div');
    error.className = 'sp-error';

    var row = document.createElement('div');
    row.className = 'sp-row';

    var btn = document.createElement('button');
    btn.className = 'sp-btn sp-btn-primary';
    btn.textContent = 'Entrar';

  var btnHome = document.createElement('button');
  btnHome.className = 'sp-btn sp-btn-secondary';
  btnHome.textContent = 'Voltar para Home';

    var btnClear = document.createElement('button');
    btnClear.className = 'sp-btn sp-btn-link';
    btnClear.textContent = 'Limpar senha salva';

    row.appendChild(btn);
  row.appendChild(btnHome);
    row.appendChild(btnClear);

    modal.appendChild(title);
    modal.appendChild(msg);
    modal.appendChild(input);
    modal.appendChild(error);
    modal.appendChild(row);

    overlay.appendChild(modal);

    // styles
  var style = document.createElement('style');
  style.textContent = `
.sp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:999999}
.sp-modal{background:#fff;color:#111;max-width:420px;width:92%;padding:20px;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:inherit;text-align:center}
body.dark-mode .sp-modal{background:#111;color:#eee}
.sp-title{margin:0 0 8px;font-size:1.25rem}
.sp-message{margin:0 0 12px;color:#444;font-size:0.95rem}
.sp-input{width:100%;padding:12px;border-radius:8px;border:1px solid #ddd;margin-bottom:10px;font-size:1rem}
body.dark-mode .sp-input{background:#222;border-color:#333;color:#fff}
.sp-error{color:#d9534f;min-height:20px;margin-bottom:6px}
.sp-row{display:flex;gap:8px;justify-content:center}
.sp-btn{padding:10px 14px;border-radius:8px;border:none;cursor:pointer}
.sp-btn-primary{background:#2b6cb0;color:#fff}
.sp-btn-secondary{background:#e2e8f0;color:#111}
.sp-btn-link{background:transparent;color:#2b6cb0;border:1px solid transparent}
`;

  return { overlay: overlay, modal: modal, input: input, error: error, btn: btn, btnHome: btnHome, btnClear: btnClear, style: style };
  }

  function showModal(matcher, cb) {
    var doc = document;
    var nodes = createModal(matcher);
    document.head.appendChild(nodes.style);
    document.body.appendChild(nodes.overlay);
    // focus
    nodes.input.focus();

    function clean() {
      try { nodes.overlay.remove(); nodes.style.remove(); } catch (e) {}
    }

  nodes.btn.addEventListener('click', async function () {
      var val = nodes.input.value || '';
      if (val === matcher.password) {
    await setAuthenticated(matcher.id, matcher.rememberDays);
        clean();
        revealPage();
        cb(true);
      } else {
        nodes.error.textContent = 'Senha incorreta';
        nodes.input.value = '';
        nodes.input.focus();
        cb(false);
      }
    });

    nodes.btnHome.addEventListener('click', function () {
      // Go back home (root)
      var base = (window.SITE_BASEURL || '').trim();
      window.location.href = base && base !== '/' ? base + '/' : '/';
    });

    nodes.btnClear.addEventListener('click', function () { clearAuthenticated(matcher.id); nodes.error.textContent = 'Senha salva removida'; });

    // prevent background interaction
    nodes.overlay.addEventListener('click', function (e) {
      if (e.target === nodes.overlay) { nodes.input.focus(); }
    });

    nodes.input.addEventListener('keypress', function (e) { if (e.key === 'Enter') nodes.btn.click(); });
  }

  // Public API
  SiteProtect.init = async function (matchers) {
    try {
      if (!Array.isArray(matchers)) return;
      var matched = null;
      for (var i = 0; i < matchers.length; i++) {
        var m = matchers[i];
        if (!m || !m.id || !m.password) continue;
        if (!matched && matchesMatcher(m)) {
          matched = m;
        }
      }
      if (matched) {
        // lock page immediately if protected route
        lockPage();
        if (await isAuthenticated(matched.id)) { revealPage(); return; }
          // block interaction until validated
        showModal(matched, function (ok) {
          if (!ok) {
            // remain locked; user can go Home
          }
        });
        return;
      } else {
        // no match -> ensure page visible
        revealPage();
        return;
      }
    } catch (e) { console.error('SiteProtect error', e); }
  };

  SiteProtect.clear = function (id) { clearAuthenticated(id); };

  // expose helpers for debugging
  SiteProtect._helpers = helpers;

})(window, document);
