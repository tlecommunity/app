var Y = YAHOO,
  Y_DOM = YAHOO.util.Dom,
  EMPTY_ARRAY = [],
  Y_UA = Y.env.ua,
  Y_Lang = Y.lang,
  Y_DOC = document,
  Y_DOCUMENT_ELEMENT = Y_DOC.documentElement,
  Y_DOM_inDoc = Y_DOM.inDocument,
  Y_mix = Y_Lang.augmentObject,
  Y_guid = Y_DOM.generateId,
  Y_getDoc = function (a) {
    var b = Y_DOC;
    if (a) {
      b = a.nodeType === 9 ? a : a.ownerDocument || a.document || Y_DOC;
    }
    return b;
  },
  Y_Array = function (g, d) {
    var c,
      b,
      h = d || 0;
    try {
      return Array.prototype.slice.call(g, h);
    } catch (f) {
      b = [];
      c = g.length;
      for (; h < c; h++) {
        b.push(g[h]);
      }
      return b;
    }
  },
  Y_DOM_allById = function (f, a) {
    a = a || Y_DOC;
    var b = [],
      c = [],
      d,
      e;
    if (a.querySelectorAll) {
      c = a.querySelectorAll('[id="' + f + '"]');
    } else {
      if (a.all) {
        b = a.all(f);
        if (b) {
          if (b.nodeName) {
            if (b.id === f) {
              c.push(b);
              b = EMPTY_ARRAY;
            } else {
              b = [b];
            }
          }
          if (b.length) {
            for (d = 0; (e = b[d++]); ) {
              if (e.id === f || (e.attributes && e.attributes.id && e.attributes.id.value === f)) {
                c.push(e);
              }
            }
          }
        }
      } else {
        c = [Y_getDoc(a).getElementById(f)];
      }
    }
    return c;
  };
var COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
  OWNER_DOCUMENT = 'ownerDocument',
  Selector = {
    _foundCache: [],
    useNative: true,
    _compare:
      'sourceIndex' in Y_DOCUMENT_ELEMENT
        ? function (f, e) {
            var d = f.sourceIndex,
              c = e.sourceIndex;
            if (d === c) {
              return 0;
            } else {
              if (d > c) {
                return 1;
              }
            }
            return -1;
          }
        : Y_DOCUMENT_ELEMENT[COMPARE_DOCUMENT_POSITION]
        ? function (b, a) {
            if (b[COMPARE_DOCUMENT_POSITION](a) & 4) {
              return -1;
            } else {
              return 1;
            }
          }
        : function (e, d) {
            var c, a, b;
            if (e && d) {
              c = e[OWNER_DOCUMENT].createRange();
              c.setStart(e, 0);
              a = d[OWNER_DOCUMENT].createRange();
              a.setStart(d, 0);
              b = c.compareBoundaryPoints(1, a);
            }
            return b;
          },
    _sort: function (a) {
      if (a) {
        a = Y_Array(a, 0, true);
        if (a.sort) {
          a.sort(Selector._compare);
        }
      }
      return a;
    },
    _deDupe: function (a) {
      var b = [],
        c,
        d;
      for (c = 0; (d = a[c++]); ) {
        if (!d._found) {
          b[b.length] = d;
          d._found = true;
        }
      }
      for (c = 0; (d = b[c++]); ) {
        d._found = null;
        d.removeAttribute('_found');
      }
      return b;
    },
    query: function (b, j, k, a) {
      if (j && typeof j == 'string') {
        j = Y_DOM.get(j);
        if (!j) {
          return k ? null : [];
        }
      } else {
        j = j || Y_DOC;
      }
      var f = [],
        c = Selector.useNative && Y_DOC.querySelector && !a,
        e = [[b, j]],
        g,
        l,
        d,
        h = c ? Selector._nativeQuery : Selector._bruteQuery;
      if (b && h) {
        if (!a && (!c || j.tagName)) {
          e = Selector._splitQueries(b, j);
        }
        for (d = 0; (g = e[d++]); ) {
          l = h(g[0], g[1], k);
          if (!k) {
            l = Y_Array(l, 0, true);
          }
          if (l) {
            f = f.concat(l);
          }
        }
        if (e.length > 1) {
          f = Selector._sort(Selector._deDupe(f));
        }
      }
      return k ? f[0] || null : f;
    },
    _splitQueries: function (c, f) {
      var b = c.split(','),
        d = [],
        g = '',
        e,
        a;
      if (f) {
        if (f.tagName) {
          f.id = f.id || Y_guid();
          g = '[id="' + f.id + '"] ';
        }
        for (e = 0, a = b.length; e < a; ++e) {
          c = g + b[e];
          d.push([c, f]);
        }
      }
      return d;
    },
    _nativeQuery: function (a, b, c) {
      if (
        Y_UA.webkit &&
        a.indexOf(':checked') > -1 &&
        Selector.pseudos &&
        Selector.pseudos.checked
      ) {
        return Selector.query(a, b, c, true);
      }
      try {
        return b['querySelector' + (c ? '' : 'All')](a);
      } catch (d) {
        return Selector.query(a, b, c, true);
      }
    },
    filter: function (b, a) {
      var c = [],
        d,
        e;
      if (b && a) {
        for (d = 0; (e = b[d++]); ) {
          if (Selector.test(e, a)) {
            c[c.length] = e;
          }
        }
      } else {
      }
      return c;
    },
    test: function (c, d, k) {
      var g = false,
        b = d.split(','),
        a = false,
        l,
        o,
        h,
        n,
        f,
        e,
        m;
      if (c && c.tagName) {
        if (!k && !Y_DOM_inDoc(c)) {
          l = c.parentNode;
          if (l) {
            k = l;
          } else {
            n = c[OWNER_DOCUMENT].createDocumentFragment();
            n.appendChild(c);
            k = n;
            a = true;
          }
        }
        k = k || c[OWNER_DOCUMENT];
        if (!c.id) {
          c.id = Y_guid();
        }
        for (f = 0; (m = b[f++]); ) {
          m += '[id="' + c.id + '"]';
          h = Selector.query(m, k);
          for (e = 0; (o = h[e++]); ) {
            if (o === c) {
              g = true;
              break;
            }
          }
          if (g) {
            break;
          }
        }
        if (a) {
          n.removeChild(c);
        }
      }
      return g;
    },
  };
YAHOO.util.Selector = Selector;
var PARENT_NODE = 'parentNode',
  TAG_NAME = 'tagName',
  ATTRIBUTES = 'attributes',
  COMBINATOR = 'combinator',
  PSEUDOS = 'pseudos',
  SelectorCSS2 = {
    _reRegExpTokens: /([\^\$\?\[\]\*\+\-\.\(\)\|\\])/,
    SORT_RESULTS: true,
    _children: function (e, a) {
      var b = e.children,
        d,
        c = [],
        f,
        g;
      if (e.children && a && e.children.tags) {
        c = e.children.tags(a);
      } else {
        if ((!b && e[TAG_NAME]) || (b && a)) {
          f = b || e.childNodes;
          b = [];
          for (d = 0; (g = f[d++]); ) {
            if (g.tagName) {
              if (!a || a === g.tagName) {
                b.push(g);
              }
            }
          }
        }
      }
      return b || [];
    },
    _re: { attr: /(\[[^\]]*\])/g, esc: /\\[:\[\]\(\)#\.\'\>+~"]/gi, pseudos: /(\([^\)]*\))/g },
    shorthand: {
      '\\#(-?[_a-z]+[-\\w\\uE000]*)': '[id=$1]',
      '\\.(-?[_a-z]+[-\\w\\uE000]*)': '[className~=$1]',
    },
    operators: {
      '': function (b, a) {
        return !!b.getAttribute(a);
      },
      '~=': '(?:^|\\s+){val}(?:\\s+|$)',
      '|=': '^{val}(?:-|$)',
    },
    pseudos: {
      'first-child': function (a) {
        return Selector._children(a[PARENT_NODE])[0] === a;
      },
    },
    _bruteQuery: function (f, j, l) {
      var g = [],
        a = [],
        i = Selector._tokenize(f),
        e = i[i.length - 1],
        k = Y_getDoc(j),
        c,
        b,
        h,
        d;
      if (e) {
        b = e.id;
        h = e.className;
        d = e.tagName || '*';
        if (j.getElementsByTagName) {
          if (b && (j.all || j.nodeType === 9 || Y_DOM_inDoc(j))) {
            a = Y_DOM_allById(b, j);
          } else {
            if (h) {
              a = j.getElementsByClassName(h);
            } else {
              a = j.getElementsByTagName(d);
            }
          }
        } else {
          c = j.firstChild;
          while (c) {
            if (c.tagName) {
              a.push(c);
            }
            c = c.nextSilbing || c.firstChild;
          }
        }
        if (a.length) {
          g = Selector._filterNodes(a, i, l);
        }
      }
      return g;
    },
    _filterNodes: function (l, f, h) {
      var r = 0,
        q,
        s = f.length,
        k = s - 1,
        e = [],
        o = l[0],
        v = o,
        t = Selector.getters,
        d,
        p,
        c,
        g,
        a,
        m,
        b,
        u;
      for (r = 0; (v = o = l[r++]); ) {
        k = s - 1;
        g = null;
        testLoop: while (v && v.tagName) {
          c = f[k];
          b = c.tests;
          q = b.length;
          if (q && !a) {
            while ((u = b[--q])) {
              d = u[1];
              if (t[u[0]]) {
                m = t[u[0]](v, u[0]);
              } else {
                m = v[u[0]];
                if (m === undefined && v.getAttribute) {
                  m = v.getAttribute(u[0]);
                }
              }
              if (
                (d === '=' && m !== u[2]) ||
                (typeof d !== 'string' && d.test && !d.test(m)) ||
                (!d.test && typeof d === 'function' && !d(v, u[0], u[2]))
              ) {
                if ((v = v[g])) {
                  while (v && (!v.tagName || (c.tagName && c.tagName !== v.tagName))) {
                    v = v[g];
                  }
                }
                continue testLoop;
              }
            }
          }
          k--;
          if (!a && (p = c.combinator)) {
            g = p.axis;
            v = v[g];
            while (v && !v.tagName) {
              v = v[g];
            }
            if (p.direct) {
              g = null;
            }
          } else {
            e.push(o);
            if (h) {
              return e;
            }
            break;
          }
        }
      }
      o = v = null;
      return e;
    },
    combinators: {
      ' ': { axis: 'parentNode' },
      '>': { axis: 'parentNode', direct: true },
      '+': { axis: 'previousSibling', direct: true },
    },
    _parsers: [
      {
        name: ATTRIBUTES,
        re: /^\uE003(-?[a-z]+[\w\-]*)+([~\|\^\$\*!=]=?)?['"]?([^\uE004'"]*)['"]?\uE004/i,
        fn: function (d, e) {
          var c = d[2] || '',
            a = Selector.operators,
            b = d[3] ? d[3].replace(/\\/g, '') : '',
            f;
          if (
            (d[1] === 'id' && c === '=') ||
            (d[1] === 'className' &&
              Y_DOCUMENT_ELEMENT.getElementsByClassName &&
              (c === '~=' || c === '='))
          ) {
            e.prefilter = d[1];
            d[3] = b;
            e[d[1]] = d[1] === 'id' ? d[3] : b;
          }
          if (c in a) {
            f = a[c];
            if (typeof f === 'string') {
              d[3] = b.replace(Selector._reRegExpTokens, '\\$1');
              f = new RegExp(f.replace('{val}', d[3]));
            }
            d[2] = f;
          }
          if (!e.last || e.prefilter !== d[1]) {
            return d.slice(1);
          }
        },
      },
      {
        name: TAG_NAME,
        re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
        fn: function (b, c) {
          var a = b[1].toUpperCase();
          c.tagName = a;
          if (a !== '*' && (!c.last || c.prefilter)) {
            return [TAG_NAME, '=', a];
          }
          if (!c.prefilter) {
            c.prefilter = 'tagName';
          }
        },
      },
      { name: COMBINATOR, re: /^\s*([>+~]|\s)\s*/, fn: function (a, b) {} },
      {
        name: PSEUDOS,
        re: /^:([\-\w]+)(?:\uE005['"]?([^\uE005]*)['"]?\uE006)*/i,
        fn: function (a, b) {
          var c = Selector[PSEUDOS][a[1]];
          if (c) {
            if (a[2]) {
              a[2] = a[2].replace(/\\/g, '');
            }
            return [a[2], c];
          } else {
            return false;
          }
        },
      },
    ],
    _getToken: function (a) {
      return {
        tagName: null,
        id: null,
        className: null,
        attributes: {},
        combinator: null,
        tests: [],
      };
    },
    _tokenize: function (c) {
      c = c || '';
      c = Selector._replaceShorthand(Y_Lang.trim(c));
      var b = Selector._getToken(),
        h = c,
        g = [],
        j = false,
        e,
        f,
        d,
        a;
      outer: do {
        j = false;
        for (d = 0; (a = Selector._parsers[d++]); ) {
          if ((e = a.re.exec(c))) {
            if (a.name !== COMBINATOR) {
              b.selector = c;
            }
            c = c.replace(e[0], '');
            if (!c.length) {
              b.last = true;
            }
            if (Selector._attrFilters[e[1]]) {
              e[1] = Selector._attrFilters[e[1]];
            }
            f = a.fn(e, b);
            if (f === false) {
              j = false;
              break outer;
            } else {
              if (f) {
                b.tests.push(f);
              }
            }
            if (!c.length || a.name === COMBINATOR) {
              g.push(b);
              b = Selector._getToken(b);
              if (a.name === COMBINATOR) {
                b.combinator = Selector.combinators[e[1]];
              }
            }
            j = true;
          }
        }
      } while (j && c.length);
      if (!j || c.length) {
        g = [];
      }
      return g;
    },
    _replaceShorthand: function (b) {
      var d = Selector.shorthand,
        c = b.match(Selector._re.esc),
        e,
        h,
        g,
        f,
        a;
      if (c) {
        b = b.replace(Selector._re.esc, '\uE000');
      }
      e = b.match(Selector._re.attr);
      h = b.match(Selector._re.pseudos);
      if (e) {
        b = b.replace(Selector._re.attr, '\uE001');
      }
      if (h) {
        b = b.replace(Selector._re.pseudos, '\uE002');
      }
      for (g in d) {
        if (d.hasOwnProperty(g)) {
          b = b.replace(new RegExp(g, 'gi'), d[g]);
        }
      }
      if (e) {
        for (f = 0, a = e.length; f < a; ++f) {
          b = b.replace(/\uE001/, e[f]);
        }
      }
      if (h) {
        for (f = 0, a = h.length; f < a; ++f) {
          b = b.replace(/\uE002/, h[f]);
        }
      }
      b = b.replace(/\[/g, '\uE003');
      b = b.replace(/\]/g, '\uE004');
      b = b.replace(/\(/g, '\uE005');
      b = b.replace(/\)/g, '\uE006');
      if (c) {
        for (f = 0, a = c.length; f < a; ++f) {
          b = b.replace('\uE000', c[f]);
        }
      }
      return b;
    },
    _attrFilters: { class: 'className', for: 'htmlFor' },
    getters: {
      href: function (b, a) {
        return Y_DOM.getAttribute(b, a);
      },
    },
  };
Y_mix(Selector, SelectorCSS2, true);
Selector.getters.src = Selector.getters.rel = Selector.getters.href;
if (Selector.useNative && Y_DOC.querySelector) {
  Selector.shorthand['\\.([^\\s\\\\(\\[:]*)'] = '[class~=$1]';
}
Selector._reNth = /^(?:([\-]?\d*)(n){1}|(odd|even)$)*([\-+]?\d*)$/;
Selector._getNth = function (d, o, q, h) {
  Selector._reNth.test(o);
  var m = parseInt(RegExp.$1, 10),
    c = RegExp.$2,
    j = RegExp.$3,
    k = parseInt(RegExp.$4, 10) || 0,
    p = [],
    l = Selector._children(d.parentNode, q),
    f;
  if (j) {
    m = 2;
    f = '+';
    c = 'n';
    k = j === 'odd' ? 1 : 0;
  } else {
    if (isNaN(m)) {
      m = c ? 1 : 0;
    }
  }
  if (m === 0) {
    if (h) {
      k = l.length - k + 1;
    }
    if (l[k - 1] === d) {
      return true;
    } else {
      return false;
    }
  } else {
    if (m < 0) {
      h = !!h;
      m = Math.abs(m);
    }
  }
  if (!h) {
    for (var e = k - 1, g = l.length; e < g; e += m) {
      if (e >= 0 && l[e] === d) {
        return true;
      }
    }
  } else {
    for (var e = l.length - k, g = l.length; e >= 0; e -= m) {
      if (e < g && l[e] === d) {
        return true;
      }
    }
  }
  return false;
};
Y_mix(Selector.pseudos, {
  root: function (a) {
    return a === a.ownerDocument.documentElement;
  },
  'nth-child': function (a, b) {
    return Selector._getNth(a, b);
  },
  'nth-last-child': function (a, b) {
    return Selector._getNth(a, b, null, true);
  },
  'nth-of-type': function (a, b) {
    return Selector._getNth(a, b, a.tagName);
  },
  'nth-last-of-type': function (a, b) {
    return Selector._getNth(a, b, a.tagName, true);
  },
  'last-child': function (b) {
    var a = Selector._children(b.parentNode);
    return a[a.length - 1] === b;
  },
  'first-of-type': function (a) {
    return Selector._children(a.parentNode, a.tagName)[0] === a;
  },
  'last-of-type': function (b) {
    var a = Selector._children(b.parentNode, b.tagName);
    return a[a.length - 1] === b;
  },
  'only-child': function (b) {
    var a = Selector._children(b.parentNode);
    return a.length === 1 && a[0] === b;
  },
  'only-of-type': function (b) {
    var a = Selector._children(b.parentNode, b.tagName);
    return a.length === 1 && a[0] === b;
  },
  empty: function (a) {
    return a.childNodes.length === 0;
  },
  not: function (a, b) {
    return !Selector.test(a, b);
  },
  contains: function (a, b) {
    var c = a.innerText || a.textContent || '';
    return c.indexOf(b) > -1;
  },
  checked: function (a) {
    return a.checked === true || a.selected === true;
  },
  enabled: function (a) {
    return a.disabled !== undefined && !a.disabled;
  },
  disabled: function (a) {
    return a.disabled;
  },
});
Y_mix(Selector.operators, {
  '^=': '^{val}',
  '!=': function (b, a, c) {
    return b[a] !== c;
  },
  '$=': '{val}$',
  '*=': '{val}',
});
Selector.combinators['~'] = { axis: 'previousSibling' };
YAHOO.register('selector', YAHOO.util.Selector, { version: '@VERSION@', build: '@BUILD@' });
