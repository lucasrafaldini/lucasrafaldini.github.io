/* js/protect-config.js
   Example site protection configuration. Edit to add/remove protected paths or change passwords.
   NOTE: keeping passwords here is insecure — this is client-side only.
*/
(function () {
  if (!window.SiteProtect) return;
  // enable debug logs during setup
  window.SITE_PROTECT_DEBUG = true;

  var cfg = [
    {
      id: '777',
      // match with or without trailing slash
      pathPrefix: '/apis/777',
      // hostname removed so it matches localhost and production
      password: '__PROTECT_PASS_777__',
      title: 'Acesso restrito — API Liber 777',
      message: 'Esta seção é privada. Insira a senha fornecida para prosseguir.',
      rememberDays: 30
    },
    {
      id: 'arvore-da-vida',
      pathPrefix: '/arvore-da-vida',
      password: '__PROTECT_PASS_ARVORE__',
      title: 'Acesso restrito — Árvore da Vida',
      message: 'Esta seção é privada. Insira a senha fornecida para prosseguir.',
      rememberDays: 30
    }
    // add more entries here, e.g.:
    // { id: 'private-api', pathPrefix: '/private/', password: 'outra', rememberDays:7 }
  ];

  // initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () { window.SiteProtect.init(cfg); });
})();
