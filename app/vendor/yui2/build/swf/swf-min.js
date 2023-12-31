YAHOO.namespace('widget');
(function () {
  var f = 0;
  var m = YAHOO.env.ua;
  var p = 'ShockwaveFlash';
  var o, q;
  if (m.gecko || m.webkit || m.opera) {
    if ((o = navigator.mimeTypes['application/x-shockwave-flash'])) {
      if ((q = o.enabledPlugin)) {
        var j = [];
        j = q.description
          .replace(/\s[rd]/g, '.')
          .replace(/[A-Za-z\s]+/g, '')
          .split('.');
        f = j[0] + '.';
        switch (j[2].toString().length) {
          case 1:
            f += '00';
            break;
          case 2:
            f += '0';
            break;
        }
        f += j[2];
        f = parseFloat(f);
      }
    }
  } else {
    if (m.ie) {
      try {
        var i = new ActiveXObject(p + '.' + p + '.6');
        i.AllowScriptAccess = 'always';
      } catch (r) {
        if (i != null) {
          f = 6;
        }
      }
      if (f == 0) {
        try {
          var l = new ActiveXObject(p + '.' + p);
          var j = [];
          j = l
            .GetVariable('$version')
            .replace(/[A-Za-z\s]+/g, '')
            .split(',');
          f = j[0] + '.';
          switch (j[2].toString().length) {
            case 1:
              f += '00';
              break;
            case 2:
              f += '0';
              break;
          }
          f += j[2];
          f = parseFloat(f);
        } catch (r) {}
      }
    }
  }
  m.flash = f;
  YAHOO.util.SWFDetect = {
    getFlashVersion: function () {
      return f;
    },
    isFlashVersionAtLeast: function (e) {
      return f >= e;
    },
    parseFlashVersion: function (e) {
      var u = e;
      if (YAHOO.lang.isString(e)) {
        var v = e.split('.');
        if (v.length > 2) {
          u = parseInt(v[0]);
          u += parseInt(v[2]) * 0.001;
        } else {
          u = parseFloat(e);
        }
      }
      return YAHOO.lang.isNumber(u) ? u : null;
    },
  };
  var b = YAHOO.util.Dom,
    t = YAHOO.util.Event,
    g = YAHOO.util.SWFDetect,
    h = YAHOO.lang,
    a = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
    n = 'application/x-shockwave-flash',
    s = '10.22',
    d =
      'http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?' +
      Math.random(),
    c = 'YAHOO.widget.SWF.eventHandler',
    k = {
      align: '',
      allowfullscreen: '',
      allownetworking: '',
      allowscriptaccess: '',
      base: '',
      bgcolor: '',
      devicefont: '',
      loop: '',
      menu: '',
      name: '',
      play: '',
      quality: '',
      salign: '',
      seamlesstabbing: '',
      scale: '',
      swliveconnect: '',
      tabindex: '',
      wmode: '',
    };
  YAHOO.widget.SWF = function (e, K, F) {
    this._queue = this._queue || [];
    this._events = this._events || {};
    this._configs = this._configs || {};
    this._id = b.generateId(null, 'yuiswf');
    if (F.host) {
      this._host = F.host;
    }
    var H = this._id;
    var x = b.get(e);
    var u = g.parseFlashVersion(F['version'] || s);
    var E = g.isFlashVersionAtLeast(u);
    var D = m.flash >= 8;
    var y = D && !E && F['useExpressInstall'];
    var C = y ? d : K;
    var B = '<object ';
    var I, A;
    var J = 'YUISwfId=' + H + '&YUIBridgeCallback=' + c;
    YAHOO.widget.SWF._instances[H] = this;
    if (x && (E || y) && C) {
      B += 'id="' + H + '" ';
      if (m.ie) {
        B += 'classid="' + a + '" ';
      } else {
        B += 'type="' + n + '" data="' + YAHOO.lang.escapeHTML(C) + '" ';
      }
      I = '100%';
      A = '100%';
      B += 'width="' + I + '" height="' + A + '">';
      if (m.ie) {
        B += '<param name="movie" value="' + YAHOO.lang.escapeHTML(C) + '"/>';
      }
      for (var v in F.fixedAttributes) {
        if (k.hasOwnProperty(v.toLowerCase())) {
          B +=
            '<param name="' +
            YAHOO.lang.escapeHTML(v.toLowerCase()) +
            '" value="' +
            YAHOO.lang.escapeHTML(F.fixedAttributes[v]) +
            '"/>';
        }
      }
      for (var G in F.flashVars) {
        var z = F.flashVars[G];
        if (h.isString(z)) {
          J += '&' + YAHOO.lang.escapeHTML(G) + '=' + YAHOO.lang.escapeHTML(encodeURIComponent(z));
        }
      }
      if (J) {
        B += '<param name="flashVars" value="' + J + '"/>';
      }
      B += '</object>';
      x.innerHTML = B;
      YAHOO.widget.SWF.superclass.constructor.call(this, b.get(H));
      this._swf = b.get(H);
    }
  };
  YAHOO.widget.SWF._instances = YAHOO.widget.SWF._instances || {};
  YAHOO.widget.SWF.eventHandler = function (e, u) {
    YAHOO.widget.SWF._instances[e]._eventHandler(u);
  };
  YAHOO.extend(YAHOO.widget.SWF, YAHOO.util.Element, {
    _eventHandler: function (e) {
      if (e.type == 'swfReady') {
        this.createEvent('swfReady', { fireOnce: true });
        this.fireEvent('swfReady', e);
      } else {
        if (e.type == 'log') {
        } else {
          if (this._host && this._host.fireEvent) {
            this._host.fireEvent(e.type, e);
          } else {
            this.fireEvent(e.type, e);
          }
        }
      }
    },
    callSWF: function (u, e) {
      if (!e) {
        e = [];
      }
      if (this._swf[u]) {
        return this._swf[u].apply(this._swf, e);
      } else {
        return null;
      }
    },
    toString: function () {
      return 'SWF ' + this._id;
    },
  });
})();
YAHOO.register('swf', YAHOO.widget.SWF, { version: '@VERSION@', build: '@BUILD@' });
