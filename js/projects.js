(function(){
    function byId(id){ return document.getElementById(id); }
    function createEl(tag, cls){ const el = document.createElement(tag); if(cls) el.className = cls; return el; }
    function currentLanguage(){ return document.body.getAttribute('data-lang') === 'pt' ? 'pt' : 'en'; }
    function t(key){
        const dict = {
            en: {
                fetchError: 'Failed to fetch repositories',
                noDescription: 'No description provided',
                unavailable: 'N/A',
                loadingProjects: 'Loading projects...',
                projectsLoadError: 'Unable to load projects right now.'
            },
            pt: {
                fetchError: 'Falha ao buscar repositorios',
                noDescription: 'Sem descricao',
                unavailable: 'N/A',
                loadingProjects: 'Carregando projetos...',
                projectsLoadError: 'Nao foi possivel carregar os projetos agora.'
            }
        };
        return dict[currentLanguage()][key];
    }
    function parseDataAttr(node, name){
        try { return JSON.parse(node.getAttribute(name) || '[]'); } catch(e) { return []; }
    }

    function shouldShow(repoName, includeList, excludeList){
        if (includeList && includeList.length > 0) {
            return includeList.includes(repoName);
        }
        if (excludeList && excludeList.length > 0) {
            return !excludeList.includes(repoName);
        }
        return true;
    }

    async function fetchRepos(username){
        const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
        const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
        if (!res.ok) throw new Error(t('fetchError'));
        return res.json();
    }

    function renderRepos(container, repos, includeList, excludeList){
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        repos
          .filter(r => !r.fork)
          .filter(r => shouldShow(r.name, includeList, excludeList))
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .forEach(repo => {
              const a = createEl('a', 'column-card');
              a.href = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : repo.html_url;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';

              const wrap = createEl('div');
              const h3 = createEl('h3');
              h3.textContent = repo.name;

              const p = createEl('p');
              p.textContent = (repo.description || '').trim() || t('noDescription');

              const meta = createEl('p');
              meta.innerHTML = `<small>★ ${repo.stargazers_count} • ${repo.language || t('unavailable')}</small>`;

              wrap.appendChild(h3);
              wrap.appendChild(p);
              wrap.appendChild(meta);
              a.appendChild(wrap);
              fragment.appendChild(a);
          });

        container.appendChild(fragment);
    }

    async function init(){
        const container = document.querySelector('#projects');
        if (!container) return;

        const loading = byId('projectsLoading');
        const username = container.getAttribute('data-username');
        const includeList = parseDataAttr(container, 'data-include');
        const excludeList = parseDataAttr(container, 'data-exclude');
        let cachedRepos = [];

        try {
            cachedRepos = await fetchRepos(username);
            renderRepos(container, cachedRepos, includeList, excludeList);

            document.addEventListener('languagechange', () => {
                renderRepos(container, cachedRepos, includeList, excludeList);
            });
        } catch (err) {
            console.error(err);
            container.innerHTML = `<p class="loading">${t('projectsLoadError')}</p>`;
        } finally {
            if (loading) loading.style.display = 'none';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
