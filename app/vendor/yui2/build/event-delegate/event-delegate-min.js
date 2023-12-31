(function () {
  var A = YAHOO.util.Event,
    C = YAHOO.lang,
    B = [],
    D = function (H, E, F) {
      var G;
      if (!H || H === F) {
        G = false;
      } else {
        G = YAHOO.util.Selector.test(H, E) ? H : D(H.parentNode, E, F);
      }
      return G;
    };
  C.augmentObject(A, {
    _createDelegate: function (F, E, G, H) {
      return function (I) {
        var J = this,
          N = A.getTarget(I),
          L = E,
          P = J.nodeType === 9,
          Q,
          K,
          O,
          M;
        if (C.isFunction(E)) {
          Q = E(N);
        } else {
          if (C.isString(E)) {
            if (!P) {
              O = J.id;
              if (!O) {
                O = A.generateId(J);
              }
              M = '#' + O + ' ';
              L = (M + E).replace(/,/gi, ',' + M);
            }
            if (YAHOO.util.Selector.test(N, L)) {
              Q = N;
            } else {
              if (YAHOO.util.Selector.test(N, L.replace(/,/gi, ' *,') + ' *')) {
                Q = D(N, L, J);
              }
            }
          }
        }
        if (Q) {
          K = Q;
          if (H) {
            if (H === true) {
              K = G;
            } else {
              K = H;
            }
          }
          return F.call(K, I, Q, J, G);
        }
      };
    },
    delegate: function (F, J, L, G, H, I) {
      var E = J,
        K,
        M;
      if (C.isString(G) && !YAHOO.util.Selector) {
        return false;
      }
      if (J == 'mouseenter' || J == 'mouseleave') {
        if (!A._createMouseDelegate) {
          return false;
        }
        E = A._getType(J);
        K = A._createMouseDelegate(L, H, I);
        M = A._createDelegate(
          function (P, O, N) {
            return K.call(O, P, N);
          },
          G,
          H,
          I
        );
      } else {
        M = A._createDelegate(L, G, H, I);
      }
      B.push([F, E, L, M]);
      return A.on(F, E, M);
    },
    removeDelegate: function (F, J, I) {
      var K = J,
        H = false,
        G,
        E;
      if (J == 'mouseenter' || J == 'mouseleave') {
        K = A._getType(J);
      }
      G = A._getCacheIndex(B, F, K, I);
      if (G >= 0) {
        E = B[G];
      }
      if (F && E) {
        H = A.removeListener(E[0], E[1], E[3]);
        if (H) {
          delete B[G][2];
          delete B[G][3];
          B.splice(G, 1);
        }
      }
      return H;
    },
  });
})();
YAHOO.register('event-delegate', YAHOO.util.Event, { version: '@VERSION@', build: '@BUILD@' });
