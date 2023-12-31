YAHOO.util.History = (function () {
  var d = null;
  var m = null;
  var g = false;
  var e = [];
  var c = [];
  function k() {
    var o, n;
    n = self.location.href;
    o = n.indexOf('#');
    return o >= 0 ? n.substr(o + 1) : null;
  }
  function b() {
    var o,
      p,
      q = [],
      n = [];
    for (o in e) {
      if (YAHOO.lang.hasOwnProperty(e, o)) {
        p = e[o];
        q.push(o + '=' + p.initialState);
        n.push(o + '=' + p.currentState);
      }
    }
    m.value = q.join('&') + '|' + n.join('&');
  }
  function j(n) {
    var s, t, o, q, r, v, u, p;
    if (!n) {
      for (o in e) {
        if (YAHOO.lang.hasOwnProperty(e, o)) {
          q = e[o];
          q.currentState = q.initialState;
          q.onStateChange(i(q.currentState));
        }
      }
      return;
    }
    r = [];
    v = n.split('&');
    for (s = 0, t = v.length; s < t; s++) {
      u = v[s].split('=');
      if (u.length === 2) {
        o = u[0];
        p = u[1];
        r[o] = p;
      }
    }
    for (o in e) {
      if (YAHOO.lang.hasOwnProperty(e, o)) {
        q = e[o];
        p = r[o];
        if (!p || q.currentState !== p) {
          q.currentState = typeof p === 'undefined' ? q.initialState : p;
          q.onStateChange(i(q.currentState));
        }
      }
    }
  }
  function l(q) {
    var n, p;
    n = '<html><body><div id="state">' + YAHOO.lang.escapeHTML(q) + '</div></body></html>';
    try {
      p = d.contentWindow.document;
      p.open();
      p.write(n);
      p.close();
      return true;
    } catch (o) {
      return false;
    }
  }
  function h() {
    var q, n, p, o;
    if (!d.contentWindow || !d.contentWindow.document) {
      setTimeout(h, 10);
      return;
    }
    q = d.contentWindow.document;
    n = q.getElementById('state');
    p = n ? n.innerText : null;
    o = k();
    setInterval(function () {
      var w, s, t, u, v, r;
      q = d.contentWindow.document;
      n = q.getElementById('state');
      w = n ? n.innerText : null;
      v = k();
      if (w !== p) {
        p = w;
        j(p);
        if (!p) {
          s = [];
          for (t in e) {
            if (YAHOO.lang.hasOwnProperty(e, t)) {
              u = e[t];
              s.push(t + '=' + u.initialState);
            }
          }
          v = s.join('&');
        } else {
          v = p;
        }
        self.location.hash = v;
        o = v;
        b();
      } else {
        if (v !== o) {
          o = v;
          l(v);
        }
      }
    }, 50);
    g = true;
    YAHOO.util.History.onLoadEvent.fire();
  }
  function f() {
    var u, w, s, y, o, q, x, r, v, p, n, t;
    s = m.value.split('|');
    if (s.length > 1) {
      x = s[0].split('&');
      for (u = 0, w = x.length; u < w; u++) {
        y = x[u].split('=');
        if (y.length === 2) {
          o = y[0];
          r = y[1];
          q = YAHOO.lang.hasOwnProperty(e, o) && e[o];
          if (q) {
            q.initialState = r;
          }
        }
      }
      v = s[1].split('&');
      for (u = 0, w = v.length; u < w; u++) {
        y = v[u].split('=');
        if (y.length >= 2) {
          o = y[0];
          p = y[1];
          q = YAHOO.lang.hasOwnProperty(e, o) && e[o];
          if (q) {
            q.currentState = p;
          }
        }
      }
    }
    if (s.length > 2) {
      c = s[2].split(',');
    }
    if (YAHOO.env.ua.ie) {
      if (typeof document.documentMode === 'undefined' || document.documentMode < 8) {
        h();
      } else {
        YAHOO.util.Event.on(top, 'hashchange', function () {
          var z = k();
          j(z);
          b();
        });
        g = true;
        YAHOO.util.History.onLoadEvent.fire();
      }
    } else {
      t = k();
      setInterval(function () {
        var B, z, A;
        z = k();
        if (z !== t) {
          t = z;
          j(t);
          b();
        }
      }, 50);
      g = true;
      YAHOO.util.History.onLoadEvent.fire();
    }
  }
  function i(n) {
    return decodeURIComponent(n.replace(/\+/g, ' '));
  }
  function a(n) {
    return encodeURIComponent(n).replace(/%20/g, '+');
  }
  return {
    onLoadEvent: new YAHOO.util.CustomEvent('onLoad'),
    onReady: function (n, o, p) {
      if (g) {
        setTimeout(function () {
          var q = window;
          if (p) {
            if (p === true) {
              q = o;
            } else {
              q = p;
            }
          }
          n.call(q, 'onLoad', [], o);
        }, 0);
      } else {
        YAHOO.util.History.onLoadEvent.subscribe(n, o, p);
      }
    },
    register: function (p, n, r, s, t) {
      var q, o;
      if (
        typeof p !== 'string' ||
        YAHOO.lang.trim(p) === '' ||
        typeof n !== 'string' ||
        typeof r !== 'function'
      ) {
        throw new Error('Missing or invalid argument');
      }
      if (YAHOO.lang.hasOwnProperty(e, p)) {
        return;
      }
      if (g) {
        throw new Error(
          'All modules must be registered before calling YAHOO.util.History.initialize'
        );
      }
      p = a(p);
      n = a(n);
      q = null;
      if (t === true) {
        q = s;
      } else {
        q = t;
      }
      o = function (u) {
        return r.call(q, u, s);
      };
      e[p] = { name: p, initialState: n, currentState: n, onStateChange: o };
    },
    initialize: function (n, o) {
      if (g) {
        return;
      }
      if (YAHOO.env.ua.opera && typeof history.navigationMode !== 'undefined') {
        history.navigationMode = 'compatible';
      }
      if (typeof n === 'string') {
        n = document.getElementById(n);
      }
      if (
        !n ||
        (n.tagName.toUpperCase() !== 'TEXTAREA' &&
          (n.tagName.toUpperCase() !== 'INPUT' || (n.type !== 'hidden' && n.type !== 'text')))
      ) {
        throw new Error('Missing or invalid argument');
      }
      m = n;
      if (
        YAHOO.env.ua.ie &&
        (typeof document.documentMode === 'undefined' || document.documentMode < 8)
      ) {
        if (typeof o === 'string') {
          o = document.getElementById(o);
        }
        if (!o || o.tagName.toUpperCase() !== 'IFRAME') {
          throw new Error('Missing or invalid argument');
        }
        d = o;
      }
      YAHOO.util.Event.onDOMReady(f);
    },
    navigate: function (o, p) {
      var n;
      if (typeof o !== 'string' || typeof p !== 'string') {
        throw new Error('Missing or invalid argument');
      }
      n = {};
      n[o] = p;
      return YAHOO.util.History.multiNavigate(n);
    },
    multiNavigate: function (o) {
      var n, p, r, q, s;
      if (typeof o !== 'object') {
        throw new Error('Missing or invalid argument');
      }
      if (!g) {
        throw new Error('The Browser History Manager is not initialized');
      }
      for (p in o) {
        if (!YAHOO.lang.hasOwnProperty(e, a(p))) {
          throw new Error('The following module has not been registered: ' + p);
        }
      }
      n = [];
      for (p in e) {
        if (YAHOO.lang.hasOwnProperty(e, p)) {
          r = e[p];
          if (YAHOO.lang.hasOwnProperty(o, p)) {
            q = o[i(p)];
          } else {
            q = i(r.currentState);
          }
          p = a(p);
          q = a(q);
          n.push(p + '=' + q);
        }
      }
      s = n.join('&');
      if (
        YAHOO.env.ua.ie &&
        (typeof document.documentMode === 'undefined' || document.documentMode < 8)
      ) {
        return l(s);
      } else {
        self.location.hash = s;
        return true;
      }
    },
    getCurrentState: function (n) {
      var o;
      if (typeof n !== 'string') {
        throw new Error('Missing or invalid argument');
      }
      if (!g) {
        throw new Error('The Browser History Manager is not initialized');
      }
      o = YAHOO.lang.hasOwnProperty(e, n) && e[n];
      if (!o) {
        throw new Error('No such registered module: ' + n);
      }
      return i(o.currentState);
    },
    getBookmarkedState: function (s) {
      var r, o, n, u, p, t, q;
      if (typeof s !== 'string') {
        throw new Error('Missing or invalid argument');
      }
      n = self.location.href.indexOf('#');
      if (n >= 0) {
        u = self.location.href.substr(n + 1);
        p = u.split('&');
        for (r = 0, o = p.length; r < o; r++) {
          t = p[r].split('=');
          if (t.length === 2) {
            q = t[0];
            if (q === s) {
              return i(t[1]);
            }
          }
        }
      }
      return null;
    },
    getQueryStringParameter: function (s, p) {
      var q, o, n, u, t, r;
      p = p || self.location.href;
      n = p.indexOf('?');
      u = n >= 0 ? p.substr(n + 1) : p;
      n = u.lastIndexOf('#');
      u = n >= 0 ? u.substr(0, n) : u;
      t = u.split('&');
      for (q = 0, o = t.length; q < o; q++) {
        r = t[q].split('=');
        if (r.length >= 2) {
          if (r[0] === s) {
            return i(r[1]);
          }
        }
      }
      return null;
    },
  };
})();
YAHOO.register('history', YAHOO.util.History, { version: '@VERSION@', build: '@BUILD@' });
