YAHOO.util.UserAction = {
  simulateKeyEvent: function (f, j, e, c, l, b, a, k, h, n, m) {
    f = YAHOO.util.Dom.get(f);
    if (!f) {
      throw new Error('simulateKeyEvent(): Invalid target.');
    }
    if (YAHOO.lang.isString(j)) {
      j = j.toLowerCase();
      switch (j) {
        case 'keyup':
        case 'keydown':
        case 'keypress':
          break;
        case 'textevent':
          j = 'keypress';
          break;
        default:
          throw new Error("simulateKeyEvent(): Event type '" + j + "' not supported.");
      }
    } else {
      throw new Error('simulateKeyEvent(): Event type must be a string.');
    }
    if (!YAHOO.lang.isBoolean(e)) {
      e = true;
    }
    if (!YAHOO.lang.isBoolean(c)) {
      c = true;
    }
    if (!YAHOO.lang.isObject(l)) {
      l = window;
    }
    if (!YAHOO.lang.isBoolean(b)) {
      b = false;
    }
    if (!YAHOO.lang.isBoolean(a)) {
      a = false;
    }
    if (!YAHOO.lang.isBoolean(k)) {
      k = false;
    }
    if (!YAHOO.lang.isBoolean(h)) {
      h = false;
    }
    if (!YAHOO.lang.isNumber(n)) {
      n = 0;
    }
    if (!YAHOO.lang.isNumber(m)) {
      m = 0;
    }
    var i = null;
    if (YAHOO.lang.isFunction(document.createEvent)) {
      try {
        i = document.createEvent('KeyEvents');
        i.initKeyEvent(j, e, c, l, b, a, k, h, n, m);
      } catch (g) {
        try {
          i = document.createEvent('Events');
        } catch (d) {
          i = document.createEvent('UIEvents');
        } finally {
          i.initEvent(j, e, c);
          i.view = l;
          i.altKey = a;
          i.ctrlKey = b;
          i.shiftKey = k;
          i.metaKey = h;
          i.keyCode = n;
          i.charCode = m;
        }
      }
      f.dispatchEvent(i);
    } else {
      if (YAHOO.lang.isObject(document.createEventObject)) {
        i = document.createEventObject();
        i.bubbles = e;
        i.cancelable = c;
        i.view = l;
        i.ctrlKey = b;
        i.altKey = a;
        i.shiftKey = k;
        i.metaKey = h;
        i.keyCode = m > 0 ? m : n;
        f.fireEvent('on' + j, i);
      } else {
        throw new Error('simulateKeyEvent(): No event simulation framework present.');
      }
    }
  },
  simulateMouseEvent: function (k, p, h, e, q, j, g, f, d, b, c, a, o, m, i, l) {
    k = YAHOO.util.Dom.get(k);
    if (!k) {
      throw new Error('simulateMouseEvent(): Invalid target.');
    }
    l = l || null;
    if (YAHOO.lang.isString(p)) {
      p = p.toLowerCase();
      switch (p) {
        case 'mouseover':
        case 'mouseout':
        case 'mousedown':
        case 'mouseup':
        case 'click':
        case 'dblclick':
        case 'mousemove':
          break;
        default:
          throw new Error("simulateMouseEvent(): Event type '" + p + "' not supported.");
      }
    } else {
      throw new Error('simulateMouseEvent(): Event type must be a string.');
    }
    if (!YAHOO.lang.isBoolean(h)) {
      h = true;
    }
    if (!YAHOO.lang.isBoolean(e)) {
      e = p != 'mousemove';
    }
    if (!YAHOO.lang.isObject(q)) {
      q = window;
    }
    if (!YAHOO.lang.isNumber(j)) {
      j = 1;
    }
    if (!YAHOO.lang.isNumber(g)) {
      g = 0;
    }
    if (!YAHOO.lang.isNumber(f)) {
      f = 0;
    }
    if (!YAHOO.lang.isNumber(d)) {
      d = 0;
    }
    if (!YAHOO.lang.isNumber(b)) {
      b = 0;
    }
    if (!YAHOO.lang.isBoolean(c)) {
      c = false;
    }
    if (!YAHOO.lang.isBoolean(a)) {
      a = false;
    }
    if (!YAHOO.lang.isBoolean(o)) {
      o = false;
    }
    if (!YAHOO.lang.isBoolean(m)) {
      m = false;
    }
    if (!YAHOO.lang.isNumber(i)) {
      i = 0;
    }
    var n = null;
    if (YAHOO.lang.isFunction(document.createEvent)) {
      n = document.createEvent('MouseEvents');
      if (n.initMouseEvent) {
        n.initMouseEvent(p, h, e, q, j, g, f, d, b, c, a, o, m, i, l);
      } else {
        n = document.createEvent('UIEvents');
        n.initEvent(p, h, e);
        n.view = q;
        n.detail = j;
        n.screenX = g;
        n.screenY = f;
        n.clientX = d;
        n.clientY = b;
        n.ctrlKey = c;
        n.altKey = a;
        n.metaKey = m;
        n.shiftKey = o;
        n.button = i;
        n.relatedTarget = l;
      }
      if (l && !n.relatedTarget) {
        if (p == 'mouseout') {
          n.toElement = l;
        } else {
          if (p == 'mouseover') {
            n.fromElement = l;
          }
        }
      }
      k.dispatchEvent(n);
    } else {
      if (YAHOO.lang.isObject(document.createEventObject)) {
        n = document.createEventObject();
        n.bubbles = h;
        n.cancelable = e;
        n.view = q;
        n.detail = j;
        n.screenX = g;
        n.screenY = f;
        n.clientX = d;
        n.clientY = b;
        n.ctrlKey = c;
        n.altKey = a;
        n.metaKey = m;
        n.shiftKey = o;
        switch (i) {
          case 0:
            n.button = 1;
            break;
          case 1:
            n.button = 4;
            break;
          case 2:
            break;
          default:
            n.button = 0;
        }
        n.relatedTarget = l;
        k.fireEvent('on' + p, n);
      } else {
        throw new Error('simulateMouseEvent(): No event simulation framework present.');
      }
    }
  },
  fireMouseEvent: function (c, b, a) {
    a = a || {};
    this.simulateMouseEvent(
      c,
      b,
      a.bubbles,
      a.cancelable,
      a.view,
      a.detail,
      a.screenX,
      a.screenY,
      a.clientX,
      a.clientY,
      a.ctrlKey,
      a.altKey,
      a.shiftKey,
      a.metaKey,
      a.button,
      a.relatedTarget
    );
  },
  click: function (b, a) {
    this.fireMouseEvent(b, 'click', a);
  },
  dblclick: function (b, a) {
    this.fireMouseEvent(b, 'dblclick', a);
  },
  mousedown: function (b, a) {
    this.fireMouseEvent(b, 'mousedown', a);
  },
  mousemove: function (b, a) {
    this.fireMouseEvent(b, 'mousemove', a);
  },
  mouseout: function (b, a) {
    this.fireMouseEvent(b, 'mouseout', a);
  },
  mouseover: function (b, a) {
    this.fireMouseEvent(b, 'mouseover', a);
  },
  mouseup: function (b, a) {
    this.fireMouseEvent(b, 'mouseup', a);
  },
  fireKeyEvent: function (b, c, a) {
    a = a || {};
    this.simulateKeyEvent(
      c,
      b,
      a.bubbles,
      a.cancelable,
      a.view,
      a.ctrlKey,
      a.altKey,
      a.shiftKey,
      a.metaKey,
      a.keyCode,
      a.charCode
    );
  },
  keydown: function (b, a) {
    this.fireKeyEvent('keydown', b, a);
  },
  keypress: function (b, a) {
    this.fireKeyEvent('keypress', b, a);
  },
  keyup: function (b, a) {
    this.fireKeyEvent('keyup', b, a);
  },
};
YAHOO.register('event-simulate', YAHOO.util.UserAction, { version: '@VERSION@', build: '@BUILD@' });
