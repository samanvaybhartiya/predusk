
(function () {
  'use strict';

  
  function api(path) { return path; }

 
  function jsonify(x) { try { return JSON.stringify(x, null, 2); } catch { return String(x); } }
  function show(id, val) {
    var el = document.getElementById(id);
    el.textContent = (typeof val === 'string') ? val : jsonify(val);
  }
  function meta(id, fr) {
    var el = document.getElementById(id);
    if (!fr.res) { el.innerHTML = '<span class="err">Request failed:</span> ' + fr.msg; return; }
    var badge = fr.ok ? '<span class="ok">OK</span>' : '<span class="err">HTTP ' + fr.res.status + '</span>';
    el.innerHTML = badge + ' • ' + fr.ms + 'ms';
  }
  function smartFetch(url, opts) {
    var t0 = performance.now();
    return fetch(url, opts).then(function (res) {
      var ct = (res.headers.get('content-type') || '').toLowerCase();
      return res.text().then(function (text) {
        var data = null, msg = '';
        if (ct.indexOf('application/json') >= 0) {
          try { data = JSON.parse(text); } catch (e) { msg = 'JSON parse error: ' + e.message; }
        } else { data = { text: text }; }
        return { ok: res.ok, res: res, data: data, text: text, ms: Math.round(performance.now() - t0), msg: msg };
      });
    }).catch(function (e) {
      return { ok: false, res: null, data: null, text: '', ms: Math.round(performance.now() - t0), msg: e.message };
    });
  }

 
  function checkHealth() {
    smartFetch(api('/health')).then(function (fr) {
      show('health', fr.data || fr.msg || fr.text); meta('healthMeta', fr);
    });
  }
  function loadProfile() {
    smartFetch(api('/api/profile')).then(function (fr) {
      show('profile', fr.data || fr.msg || fr.text); meta('profileMeta', fr);
    });
  }
  function loadProjects() {
    var s = (document.getElementById('skill').value || '').trim();
    var url = api('/api/projects' + (s ? ('?skill=' + encodeURIComponent(s)) : ''));
    smartFetch(url).then(function (fr) {
      show('projects', fr.data || fr.msg || fr.text); meta('projectsMeta', fr);
    });
  }
  function loadTopSkills() {
    smartFetch(api('/api/skills/top')).then(function (fr) {
      show('skills', fr.data || fr.msg || fr.text); meta('skillsMeta', fr);
    });
  }
  function runSearch() {
    var q = (document.getElementById('q').value || '').trim();
    var url = api('/api/search' + (q ? ('?q=' + encodeURIComponent(q)) : ''));
    smartFetch(url).then(function (fr) {
      show('search', fr.data || fr.msg || fr.text); meta('searchMeta', fr);
    });
  }

  
  document.getElementById('btnHealth').addEventListener('click', checkHealth);
  document.getElementById('btnProfile').addEventListener('click', loadProfile);
  document.getElementById('btnProjects').addEventListener('click', loadProjects);
  document.getElementById('btnTopSkills').addEventListener('click', loadTopSkills);
  document.getElementById('btnSearch').addEventListener('click', runSearch);

  
  checkHealth();
  loadProfile();
})();
