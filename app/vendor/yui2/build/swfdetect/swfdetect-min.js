YAHOO.namespace('util');
(function () {
  var h = 0;
  var f = YAHOO.env.ua;
  var i = 'ShockwaveFlash';
  var b, d;
  if (f.gecko || f.webkit || f.opera) {
    if ((b = navigator.mimeTypes['application/x-shockwave-flash'])) {
      if ((d = b.enabledPlugin)) {
        var c = [];
        c = d.description
          .replace(/\s[rd]/g, '.')
          .replace(/[A-Za-z\s]+/g, '')
          .split('.');
        h = c[0] + '.';
        switch (c[2].toString().length) {
          case 1:
            h += '00';
            break;
          case 2:
            h += '0';
            break;
        }
        h += c[2];
        h = parseFloat(h);
      }
    }
  } else {
    if (f.ie) {
      try {
        var j = new ActiveXObject(i + '.' + i + '.6');
        j.AllowScriptAccess = 'always';
      } catch (g) {
        if (j != null) {
          h = 6;
        }
      }
      if (h == 0) {
        try {
          var a = new ActiveXObject(i + '.' + i);
          var c = [];
          c = a
            .GetVariable('$version')
            .replace(/[A-Za-z\s]+/g, '')
            .split(',');
          h = c[0] + '.';
          switch (c[2].toString().length) {
            case 1:
              h += '00';
              break;
            case 2:
              h += '0';
              break;
          }
          h += c[2];
          h = parseFloat(h);
        } catch (g) {}
      }
    }
  }
  f.flash = h;
  YAHOO.util.SWFDetect = {
    getFlashVersion: function () {
      return h;
    },
    isFlashVersionAtLeast: function (e) {
      return h >= e;
    },
    parseFlashVersion: function (e) {
      var k = e;
      if (YAHOO.lang.isString(e)) {
        var l = e.split('.');
        if (l.length > 2) {
          k = parseInt(l[0]);
          k += parseInt(l[2]) * 0.001;
        } else {
          k = parseFloat(e);
        }
      }
      return YAHOO.lang.isNumber(k) ? k : null;
    },
  };
})();
YAHOO.register('swfdetect', YAHOO.util.SWFDetect, { version: '@VERSION@', build: '@BUILD@' });
