(function () {
  var b = YAHOO.util.Event,
    g = YAHOO.lang,
    e = b.addListener,
    f = b.removeListener,
    c = b.getListeners,
    d = [],
    h = { mouseenter: 'mouseover', mouseleave: 'mouseout' },
    a = function (n, m, l) {
      var j = b._getCacheIndex(d, n, m, l),
        i,
        k;
      if (j >= 0) {
        i = d[j];
      }
      if (n && i) {
        k = f.call(b, i[0], m, i[3]);
        if (k) {
          delete d[j][2];
          delete d[j][3];
          d.splice(j, 1);
        }
      }
      return k;
    };
  g.augmentObject(b._specialTypes, h);
  g.augmentObject(
    b,
    {
      _createMouseDelegate: function (i, j, k) {
        return function (q, m) {
          var p = this,
            l = b.getRelatedTarget(q),
            o,
            n;
          if (p != l && !YAHOO.util.Dom.isAncestor(p, l)) {
            o = p;
            if (k) {
              if (k === true) {
                o = j;
              } else {
                o = k;
              }
            }
            n = [q, j];
            if (m) {
              n.splice(1, 0, p, m);
            }
            return i.apply(o, n);
          }
        };
      },
      addListener: function (m, l, k, n, o) {
        var i, j;
        if (h[l]) {
          i = b._createMouseDelegate(k, n, o);
          i.mouseDelegate = true;
          d.push([m, l, k, i]);
          j = e.call(b, m, l, i);
        } else {
          j = e.apply(b, arguments);
        }
        return j;
      },
      removeListener: function (l, k, j) {
        var i;
        if (h[k]) {
          i = a.apply(b, arguments);
        } else {
          i = f.apply(b, arguments);
        }
        return i;
      },
      getListeners: function (p, o) {
        var n = [],
          r,
          m = o === 'mouseover' || o === 'mouseout',
          q,
          k,
          j;
        if (o && (m || h[o])) {
          r = c.call(b, p, this._getType(o));
          if (r) {
            for (k = r.length - 1; k > -1; k--) {
              j = r[k];
              q = j.fn.mouseDelegate;
              if ((h[o] && q) || (m && !q)) {
                n.push(j);
              }
            }
          }
        } else {
          n = c.apply(b, arguments);
        }
        return n && n.length ? n : null;
      },
    },
    true
  );
  b.on = b.addListener;
})();
YAHOO.register('event-mouseenter', YAHOO.util.Event, { version: '@VERSION@', build: '@BUILD@' });
