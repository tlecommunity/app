(function () {
  YAHOO.util.Config = function (d) {
    if (d) {
      this.init(d);
    }
  };
  var b = YAHOO.lang,
    c = YAHOO.util.CustomEvent,
    a = YAHOO.util.Config;
  a.CONFIG_CHANGED_EVENT = 'configChanged';
  a.BOOLEAN_TYPE = 'boolean';
  a.prototype = {
    owner: null,
    queueInProgress: false,
    config: null,
    initialConfig: null,
    eventQueue: null,
    configChangedEvent: null,
    init: function (d) {
      this.owner = d;
      this.configChangedEvent = this.createEvent(a.CONFIG_CHANGED_EVENT);
      this.configChangedEvent.signature = c.LIST;
      this.queueInProgress = false;
      this.config = {};
      this.initialConfig = {};
      this.eventQueue = [];
    },
    checkBoolean: function (d) {
      return typeof d == a.BOOLEAN_TYPE;
    },
    checkNumber: function (d) {
      return !isNaN(d);
    },
    fireEvent: function (d, f) {
      var e = this.config[d];
      if (e && e.event) {
        e.event.fire(f);
      }
    },
    addProperty: function (e, d) {
      e = e.toLowerCase();
      this.config[e] = d;
      d.event = this.createEvent(e, { scope: this.owner });
      d.event.signature = c.LIST;
      d.key = e;
      if (d.handler) {
        d.event.subscribe(d.handler, this.owner);
      }
      this.setProperty(e, d.value, true);
      if (!d.suppressEvent) {
        this.queueProperty(e, d.value);
      }
    },
    getConfig: function () {
      var d = {},
        f = this.config,
        g,
        e;
      for (g in f) {
        if (b.hasOwnProperty(f, g)) {
          e = f[g];
          if (e && e.event) {
            d[g] = e.value;
          }
        }
      }
      return d;
    },
    getProperty: function (d) {
      var e = this.config[d.toLowerCase()];
      if (e && e.event) {
        return e.value;
      } else {
        return undefined;
      }
    },
    resetProperty: function (d) {
      d = d.toLowerCase();
      var e = this.config[d];
      if (e && e.event) {
        if (d in this.initialConfig) {
          this.setProperty(d, this.initialConfig[d]);
          return true;
        }
      } else {
        return false;
      }
    },
    setProperty: function (e, g, d) {
      var f;
      e = e.toLowerCase();
      if (this.queueInProgress && !d) {
        this.queueProperty(e, g);
        return true;
      } else {
        f = this.config[e];
        if (f && f.event) {
          if (f.validator && !f.validator(g)) {
            return false;
          } else {
            f.value = g;
            if (!d) {
              this.fireEvent(e, g);
              this.configChangedEvent.fire([e, g]);
            }
            return true;
          }
        } else {
          return false;
        }
      }
    },
    queueProperty: function (v, r) {
      v = v.toLowerCase();
      var u = this.config[v],
        l = false,
        k,
        g,
        h,
        j,
        p,
        t,
        f,
        n,
        o,
        d,
        m,
        w,
        e;
      if (u && u.event) {
        if (!b.isUndefined(r) && u.validator && !u.validator(r)) {
          return false;
        } else {
          if (!b.isUndefined(r)) {
            u.value = r;
          } else {
            r = u.value;
          }
          l = false;
          k = this.eventQueue.length;
          for (m = 0; m < k; m++) {
            g = this.eventQueue[m];
            if (g) {
              h = g[0];
              j = g[1];
              if (h == v) {
                this.eventQueue[m] = null;
                this.eventQueue.push([v, !b.isUndefined(r) ? r : j]);
                l = true;
                break;
              }
            }
          }
          if (!l && !b.isUndefined(r)) {
            this.eventQueue.push([v, r]);
          }
        }
        if (u.supercedes) {
          p = u.supercedes.length;
          for (w = 0; w < p; w++) {
            t = u.supercedes[w];
            f = this.eventQueue.length;
            for (e = 0; e < f; e++) {
              n = this.eventQueue[e];
              if (n) {
                o = n[0];
                d = n[1];
                if (o == t.toLowerCase()) {
                  this.eventQueue.push([o, d]);
                  this.eventQueue[e] = null;
                  break;
                }
              }
            }
          }
        }
        return true;
      } else {
        return false;
      }
    },
    refireEvent: function (d) {
      d = d.toLowerCase();
      var e = this.config[d];
      if (e && e.event && !b.isUndefined(e.value)) {
        if (this.queueInProgress) {
          this.queueProperty(d);
        } else {
          this.fireEvent(d, e.value);
        }
      }
    },
    applyConfig: function (d, g) {
      var f, e;
      if (g) {
        e = {};
        for (f in d) {
          if (b.hasOwnProperty(d, f)) {
            e[f.toLowerCase()] = d[f];
          }
        }
        this.initialConfig = e;
      }
      for (f in d) {
        if (b.hasOwnProperty(d, f)) {
          this.queueProperty(f, d[f]);
        }
      }
    },
    refresh: function () {
      var d;
      for (d in this.config) {
        if (b.hasOwnProperty(this.config, d)) {
          this.refireEvent(d);
        }
      }
    },
    fireQueue: function () {
      var e, h, d, g, f;
      this.queueInProgress = true;
      for (e = 0; e < this.eventQueue.length; e++) {
        h = this.eventQueue[e];
        if (h) {
          d = h[0];
          g = h[1];
          f = this.config[d];
          f.value = g;
          this.eventQueue[e] = null;
          this.fireEvent(d, g);
        }
      }
      this.queueInProgress = false;
      this.eventQueue = [];
    },
    subscribeToConfigEvent: function (d, e, g, h) {
      var f = this.config[d.toLowerCase()];
      if (f && f.event) {
        if (!a.alreadySubscribed(f.event, e, g)) {
          f.event.subscribe(e, g, h);
        }
        return true;
      } else {
        return false;
      }
    },
    unsubscribeFromConfigEvent: function (d, e, g) {
      var f = this.config[d.toLowerCase()];
      if (f && f.event) {
        return f.event.unsubscribe(e, g);
      } else {
        return false;
      }
    },
    toString: function () {
      var d = 'Config';
      if (this.owner) {
        d += ' [' + this.owner.toString() + ']';
      }
      return d;
    },
    outputEventQueue: function () {
      var d = '',
        g,
        e,
        f = this.eventQueue.length;
      for (e = 0; e < f; e++) {
        g = this.eventQueue[e];
        if (g) {
          d += g[0] + '=' + g[1] + ', ';
        }
      }
      return d;
    },
    destroy: function () {
      var e = this.config,
        d,
        f;
      for (d in e) {
        if (b.hasOwnProperty(e, d)) {
          f = e[d];
          f.event.unsubscribeAll();
          f.event = null;
        }
      }
      this.configChangedEvent.unsubscribeAll();
      this.configChangedEvent = null;
      this.owner = null;
      this.config = null;
      this.initialConfig = null;
      this.eventQueue = null;
    },
  };
  a.alreadySubscribed = function (e, h, j) {
    var f = e.subscribers.length,
      d,
      g;
    if (f > 0) {
      g = f - 1;
      do {
        d = e.subscribers[g];
        if (d && d.obj == j && d.fn == h) {
          return true;
        }
      } while (g--);
    }
    return false;
  };
  YAHOO.lang.augmentProto(a, YAHOO.util.EventProvider);
})();
YAHOO.widget.DateMath = {
  DAY: 'D',
  WEEK: 'W',
  YEAR: 'Y',
  MONTH: 'M',
  ONE_DAY_MS: 1000 * 60 * 60 * 24,
  WEEK_ONE_JAN_DATE: 1,
  add: function (a, e, c) {
    var g = new Date(a.getTime());
    switch (e) {
      case this.MONTH:
        var f = a.getMonth() + c;
        var b = 0;
        if (f < 0) {
          while (f < 0) {
            f += 12;
            b -= 1;
          }
        } else {
          if (f > 11) {
            while (f > 11) {
              f -= 12;
              b += 1;
            }
          }
        }
        g.setMonth(f);
        g.setFullYear(a.getFullYear() + b);
        break;
      case this.DAY:
        this._addDays(g, c);
        break;
      case this.YEAR:
        g.setFullYear(a.getFullYear() + c);
        break;
      case this.WEEK:
        this._addDays(g, c * 7);
        break;
    }
    return g;
  },
  _addDays: function (e, c) {
    if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420) {
      if (c < 0) {
        for (var b = -128; c < b; c -= b) {
          e.setDate(e.getDate() + b);
        }
      } else {
        for (var a = 96; c > a; c -= a) {
          e.setDate(e.getDate() + a);
        }
      }
    }
    e.setDate(e.getDate() + c);
  },
  subtract: function (a, c, b) {
    return this.add(a, c, b * -1);
  },
  before: function (c, b) {
    var a = b.getTime();
    if (c.getTime() < a) {
      return true;
    } else {
      return false;
    }
  },
  after: function (c, b) {
    var a = b.getTime();
    if (c.getTime() > a) {
      return true;
    } else {
      return false;
    }
  },
  between: function (b, a, c) {
    if (this.after(b, a) && this.before(b, c)) {
      return true;
    } else {
      return false;
    }
  },
  getJan1: function (a) {
    return this.getDate(a, 0, 1);
  },
  getDayOffset: function (b, d) {
    var c = this.getJan1(d);
    var a = Math.ceil((b.getTime() - c.getTime()) / this.ONE_DAY_MS);
    return a;
  },
  getWeekNumber: function (d, b, g) {
    b = b || 0;
    g = g || this.WEEK_ONE_JAN_DATE;
    var h = this.clearTime(d),
      l,
      m;
    if (h.getDay() === b) {
      l = h;
    } else {
      l = this.getFirstDayOfWeek(h, b);
    }
    var i = l.getFullYear();
    m = new Date(l.getTime() + 6 * this.ONE_DAY_MS);
    var f;
    if (i !== m.getFullYear() && m.getDate() >= g) {
      f = 1;
    } else {
      var e = this.clearTime(this.getDate(i, 0, g)),
        a = this.getFirstDayOfWeek(e, b);
      var j = Math.round((h.getTime() - a.getTime()) / this.ONE_DAY_MS);
      var k = j % 7;
      var c = (j - k) / 7;
      f = c + 1;
    }
    return f;
  },
  getFirstDayOfWeek: function (d, a) {
    a = a || 0;
    var b = d.getDay(),
      c = (b - a + 7) % 7;
    return this.subtract(d, this.DAY, c);
  },
  isYearOverlapWeek: function (a) {
    var c = false;
    var b = this.add(a, this.DAY, 6);
    if (b.getFullYear() != a.getFullYear()) {
      c = true;
    }
    return c;
  },
  isMonthOverlapWeek: function (a) {
    var c = false;
    var b = this.add(a, this.DAY, 6);
    if (b.getMonth() != a.getMonth()) {
      c = true;
    }
    return c;
  },
  findMonthStart: function (a) {
    var b = this.getDate(a.getFullYear(), a.getMonth(), 1);
    return b;
  },
  findMonthEnd: function (b) {
    var d = this.findMonthStart(b);
    var c = this.add(d, this.MONTH, 1);
    var a = this.subtract(c, this.DAY, 1);
    return a;
  },
  clearTime: function (a) {
    a.setHours(12, 0, 0, 0);
    return a;
  },
  getDate: function (e, a, c) {
    var b = null;
    if (YAHOO.lang.isUndefined(c)) {
      c = 1;
    }
    if (e >= 100) {
      b = new Date(e, a, c);
    } else {
      b = new Date();
      b.setFullYear(e);
      b.setMonth(a);
      b.setDate(c);
      b.setHours(0, 0, 0, 0);
    }
    return b;
  },
};
(function () {
  var c = YAHOO.util.Dom,
    a = YAHOO.util.Event,
    e = YAHOO.lang,
    d = YAHOO.widget.DateMath;
  function f(i, g, h) {
    this.init.apply(this, arguments);
  }
  f.IMG_ROOT = null;
  f.DATE = 'D';
  f.MONTH_DAY = 'MD';
  f.WEEKDAY = 'WD';
  f.RANGE = 'R';
  f.MONTH = 'M';
  f.DISPLAY_DAYS = 42;
  f.STOP_RENDER = 'S';
  f.SHORT = 'short';
  f.LONG = 'long';
  f.MEDIUM = 'medium';
  f.ONE_CHAR = '1char';
  f.DEFAULT_CONFIG = {
    YEAR_OFFSET: {
      key: 'year_offset',
      value: 0,
      supercedes: ['pagedate', 'selected', 'mindate', 'maxdate'],
    },
    TODAY: { key: 'today', value: new Date(), supercedes: ['pagedate'] },
    PAGEDATE: { key: 'pagedate', value: null },
    SELECTED: { key: 'selected', value: [] },
    TITLE: { key: 'title', value: '' },
    CLOSE: { key: 'close', value: false },
    IFRAME: { key: 'iframe', value: YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6 ? true : false },
    MINDATE: { key: 'mindate', value: null },
    MAXDATE: { key: 'maxdate', value: null },
    MULTI_SELECT: { key: 'multi_select', value: false },
    OOM_SELECT: { key: 'oom_select', value: false },
    START_WEEKDAY: { key: 'start_weekday', value: 0 },
    SHOW_WEEKDAYS: { key: 'show_weekdays', value: true },
    SHOW_WEEK_HEADER: { key: 'show_week_header', value: false },
    SHOW_WEEK_FOOTER: { key: 'show_week_footer', value: false },
    HIDE_BLANK_WEEKS: { key: 'hide_blank_weeks', value: false },
    NAV_ARROW_LEFT: { key: 'nav_arrow_left', value: null },
    NAV_ARROW_RIGHT: { key: 'nav_arrow_right', value: null },
    MONTHS_SHORT: {
      key: 'months_short',
      value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    MONTHS_LONG: {
      key: 'months_long',
      value: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    WEEKDAYS_1CHAR: { key: 'weekdays_1char', value: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
    WEEKDAYS_SHORT: { key: 'weekdays_short', value: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] },
    WEEKDAYS_MEDIUM: {
      key: 'weekdays_medium',
      value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    WEEKDAYS_LONG: {
      key: 'weekdays_long',
      value: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    LOCALE_MONTHS: { key: 'locale_months', value: 'long' },
    LOCALE_WEEKDAYS: { key: 'locale_weekdays', value: 'short' },
    DATE_DELIMITER: { key: 'date_delimiter', value: ',' },
    DATE_FIELD_DELIMITER: { key: 'date_field_delimiter', value: '/' },
    DATE_RANGE_DELIMITER: { key: 'date_range_delimiter', value: '-' },
    MY_MONTH_POSITION: { key: 'my_month_position', value: 1 },
    MY_YEAR_POSITION: { key: 'my_year_position', value: 2 },
    MD_MONTH_POSITION: { key: 'md_month_position', value: 1 },
    MD_DAY_POSITION: { key: 'md_day_position', value: 2 },
    MDY_MONTH_POSITION: { key: 'mdy_month_position', value: 1 },
    MDY_DAY_POSITION: { key: 'mdy_day_position', value: 2 },
    MDY_YEAR_POSITION: { key: 'mdy_year_position', value: 3 },
    MY_LABEL_MONTH_POSITION: { key: 'my_label_month_position', value: 1 },
    MY_LABEL_YEAR_POSITION: { key: 'my_label_year_position', value: 2 },
    MY_LABEL_MONTH_SUFFIX: { key: 'my_label_month_suffix', value: ' ' },
    MY_LABEL_YEAR_SUFFIX: { key: 'my_label_year_suffix', value: '' },
    NAV: { key: 'navigator', value: null },
    STRINGS: {
      key: 'strings',
      value: { previousMonth: 'Previous Month', nextMonth: 'Next Month', close: 'Close' },
      supercedes: ['close', 'title'],
    },
  };
  f._DEFAULT_CONFIG = f.DEFAULT_CONFIG;
  var b = f.DEFAULT_CONFIG;
  f._EVENT_TYPES = {
    BEFORE_SELECT: 'beforeSelect',
    SELECT: 'select',
    BEFORE_DESELECT: 'beforeDeselect',
    DESELECT: 'deselect',
    CHANGE_PAGE: 'changePage',
    BEFORE_RENDER: 'beforeRender',
    RENDER: 'render',
    BEFORE_DESTROY: 'beforeDestroy',
    DESTROY: 'destroy',
    RESET: 'reset',
    CLEAR: 'clear',
    BEFORE_HIDE: 'beforeHide',
    HIDE: 'hide',
    BEFORE_SHOW: 'beforeShow',
    SHOW: 'show',
    BEFORE_HIDE_NAV: 'beforeHideNav',
    HIDE_NAV: 'hideNav',
    BEFORE_SHOW_NAV: 'beforeShowNav',
    SHOW_NAV: 'showNav',
    BEFORE_RENDER_NAV: 'beforeRenderNav',
    RENDER_NAV: 'renderNav',
  };
  f.STYLES = {
    CSS_ROW_HEADER: 'calrowhead',
    CSS_ROW_FOOTER: 'calrowfoot',
    CSS_CELL: 'calcell',
    CSS_CELL_SELECTOR: 'selector',
    CSS_CELL_SELECTED: 'selected',
    CSS_CELL_SELECTABLE: 'selectable',
    CSS_CELL_RESTRICTED: 'restricted',
    CSS_CELL_TODAY: 'today',
    CSS_CELL_OOM: 'oom',
    CSS_CELL_OOB: 'previous',
    CSS_HEADER: 'calheader',
    CSS_HEADER_TEXT: 'calhead',
    CSS_BODY: 'calbody',
    CSS_WEEKDAY_CELL: 'calweekdaycell',
    CSS_WEEKDAY_ROW: 'calweekdayrow',
    CSS_FOOTER: 'calfoot',
    CSS_CALENDAR: 'yui-calendar',
    CSS_SINGLE: 'single',
    CSS_CONTAINER: 'yui-calcontainer',
    CSS_NAV_LEFT: 'calnavleft',
    CSS_NAV_RIGHT: 'calnavright',
    CSS_NAV: 'calnav',
    CSS_CLOSE: 'calclose',
    CSS_CELL_TOP: 'calcelltop',
    CSS_CELL_LEFT: 'calcellleft',
    CSS_CELL_RIGHT: 'calcellright',
    CSS_CELL_BOTTOM: 'calcellbottom',
    CSS_CELL_HOVER: 'calcellhover',
    CSS_CELL_HIGHLIGHT1: 'highlight1',
    CSS_CELL_HIGHLIGHT2: 'highlight2',
    CSS_CELL_HIGHLIGHT3: 'highlight3',
    CSS_CELL_HIGHLIGHT4: 'highlight4',
    CSS_WITH_TITLE: 'withtitle',
    CSS_FIXED_SIZE: 'fixedsize',
    CSS_LINK_CLOSE: 'link-close',
  };
  f._STYLES = f.STYLES;
  f.prototype = {
    Config: null,
    parent: null,
    index: -1,
    cells: null,
    cellDates: null,
    id: null,
    containerId: null,
    oDomContainer: null,
    today: null,
    renderStack: null,
    _renderStack: null,
    oNavigator: null,
    _selectedDates: null,
    domEventMap: null,
    _parseArgs: function (h) {
      var g = { id: null, container: null, config: null };
      if (h && h.length && h.length > 0) {
        switch (h.length) {
          case 1:
            g.id = null;
            g.container = h[0];
            g.config = null;
            break;
          case 2:
            if (e.isObject(h[1]) && !h[1].tagName && !(h[1] instanceof String)) {
              g.id = null;
              g.container = h[0];
              g.config = h[1];
            } else {
              g.id = h[0];
              g.container = h[1];
              g.config = null;
            }
            break;
          default:
            g.id = h[0];
            g.container = h[1];
            g.config = h[2];
            break;
        }
      } else {
      }
      return g;
    },
    init: function (j, h, i) {
      var g = this._parseArgs(arguments);
      j = g.id;
      h = g.container;
      i = g.config;
      this.oDomContainer = c.get(h);
      this._oDoc = this.oDomContainer.ownerDocument;
      if (!this.oDomContainer.id) {
        this.oDomContainer.id = c.generateId();
      }
      if (!j) {
        j = this.oDomContainer.id + '_t';
      }
      this.id = j;
      this.containerId = this.oDomContainer.id;
      this.initEvents();
      this.cfg = new YAHOO.util.Config(this);
      this.Options = {};
      this.Locale = {};
      this.initStyles();
      c.addClass(this.oDomContainer, this.Style.CSS_CONTAINER);
      c.addClass(this.oDomContainer, this.Style.CSS_SINGLE);
      this.cellDates = [];
      this.cells = [];
      this.renderStack = [];
      this._renderStack = [];
      this.setupConfig();
      if (i) {
        this.cfg.applyConfig(i, true);
      }
      this.cfg.fireQueue();
      this.today = this.cfg.getProperty('today');
    },
    configIframe: function (i, h, j) {
      var g = h[0];
      if (!this.parent) {
        if (c.inDocument(this.oDomContainer)) {
          if (g) {
            var k = c.getStyle(this.oDomContainer, 'position');
            if (k == 'absolute' || k == 'relative') {
              if (!c.inDocument(this.iframe)) {
                this.iframe = document.createElement('iframe');
                this.iframe.src = 'javascript:false;';
                c.setStyle(this.iframe, 'opacity', '0');
                if (YAHOO.env.ua.ie && YAHOO.env.ua.ie <= 6) {
                  c.addClass(this.iframe, this.Style.CSS_FIXED_SIZE);
                }
                this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild);
              }
            }
          } else {
            if (this.iframe) {
              if (this.iframe.parentNode) {
                this.iframe.parentNode.removeChild(this.iframe);
              }
              this.iframe = null;
            }
          }
        }
      }
    },
    configTitle: function (h, g, i) {
      var k = g[0];
      if (k) {
        this.createTitleBar(k);
      } else {
        var j = this.cfg.getProperty(b.CLOSE.key);
        if (!j) {
          this.removeTitleBar();
        } else {
          this.createTitleBar('&#160;');
        }
      }
    },
    configClose: function (h, g, i) {
      var k = g[0],
        j = this.cfg.getProperty(b.TITLE.key);
      if (k) {
        if (!j) {
          this.createTitleBar('&#160;');
        }
        this.createCloseButton();
      } else {
        this.removeCloseButton();
        if (!j) {
          this.removeTitleBar();
        }
      }
    },
    initEvents: function () {
      var g = f._EVENT_TYPES,
        i = YAHOO.util.CustomEvent,
        h = this;
      h.beforeSelectEvent = new i(g.BEFORE_SELECT);
      h.selectEvent = new i(g.SELECT);
      h.beforeDeselectEvent = new i(g.BEFORE_DESELECT);
      h.deselectEvent = new i(g.DESELECT);
      h.changePageEvent = new i(g.CHANGE_PAGE);
      h.beforeRenderEvent = new i(g.BEFORE_RENDER);
      h.renderEvent = new i(g.RENDER);
      h.beforeDestroyEvent = new i(g.BEFORE_DESTROY);
      h.destroyEvent = new i(g.DESTROY);
      h.resetEvent = new i(g.RESET);
      h.clearEvent = new i(g.CLEAR);
      h.beforeShowEvent = new i(g.BEFORE_SHOW);
      h.showEvent = new i(g.SHOW);
      h.beforeHideEvent = new i(g.BEFORE_HIDE);
      h.hideEvent = new i(g.HIDE);
      h.beforeShowNavEvent = new i(g.BEFORE_SHOW_NAV);
      h.showNavEvent = new i(g.SHOW_NAV);
      h.beforeHideNavEvent = new i(g.BEFORE_HIDE_NAV);
      h.hideNavEvent = new i(g.HIDE_NAV);
      h.beforeRenderNavEvent = new i(g.BEFORE_RENDER_NAV);
      h.renderNavEvent = new i(g.RENDER_NAV);
      h.beforeSelectEvent.subscribe(h.onBeforeSelect, this, true);
      h.selectEvent.subscribe(h.onSelect, this, true);
      h.beforeDeselectEvent.subscribe(h.onBeforeDeselect, this, true);
      h.deselectEvent.subscribe(h.onDeselect, this, true);
      h.changePageEvent.subscribe(h.onChangePage, this, true);
      h.renderEvent.subscribe(h.onRender, this, true);
      h.resetEvent.subscribe(h.onReset, this, true);
      h.clearEvent.subscribe(h.onClear, this, true);
    },
    doPreviousMonthNav: function (h, g) {
      a.preventDefault(h);
      setTimeout(function () {
        g.previousMonth();
        var j = c.getElementsByClassName(g.Style.CSS_NAV_LEFT, 'a', g.oDomContainer);
        if (j && j[0]) {
          try {
            j[0].focus();
          } catch (i) {}
        }
      }, 0);
    },
    doNextMonthNav: function (h, g) {
      a.preventDefault(h);
      setTimeout(function () {
        g.nextMonth();
        var j = c.getElementsByClassName(g.Style.CSS_NAV_RIGHT, 'a', g.oDomContainer);
        if (j && j[0]) {
          try {
            j[0].focus();
          } catch (i) {}
        }
      }, 0);
    },
    doSelectCell: function (m, g) {
      var r, o, i, l;
      var n = a.getTarget(m),
        h = n.tagName.toLowerCase(),
        k = false;
      while (h != 'td' && !c.hasClass(n, g.Style.CSS_CELL_SELECTABLE)) {
        if (!k && h == 'a' && c.hasClass(n, g.Style.CSS_CELL_SELECTOR)) {
          k = true;
        }
        n = n.parentNode;
        h = n.tagName.toLowerCase();
        if (n == this.oDomContainer || h == 'html') {
          return;
        }
      }
      if (k) {
        a.preventDefault(m);
      }
      r = n;
      if (c.hasClass(r, g.Style.CSS_CELL_SELECTABLE)) {
        l = g.getIndexFromId(r.id);
        if (l > -1) {
          o = g.cellDates[l];
          if (o) {
            i = d.getDate(o[0], o[1] - 1, o[2]);
            var q;
            if (g.Options.MULTI_SELECT) {
              q = r.getElementsByTagName('a')[0];
              if (q) {
                q.blur();
              }
              var j = g.cellDates[l];
              var p = g._indexOfSelectedFieldArray(j);
              if (p > -1) {
                g.deselectCell(l);
              } else {
                g.selectCell(l);
              }
            } else {
              q = r.getElementsByTagName('a')[0];
              if (q) {
                q.blur();
              }
              g.selectCell(l);
            }
          }
        }
      }
    },
    doCellMouseOver: function (i, h) {
      var g;
      if (i) {
        g = a.getTarget(i);
      } else {
        g = this;
      }
      while (g.tagName && g.tagName.toLowerCase() != 'td') {
        g = g.parentNode;
        if (!g.tagName || g.tagName.toLowerCase() == 'html') {
          return;
        }
      }
      if (c.hasClass(g, h.Style.CSS_CELL_SELECTABLE)) {
        c.addClass(g, h.Style.CSS_CELL_HOVER);
      }
    },
    doCellMouseOut: function (i, h) {
      var g;
      if (i) {
        g = a.getTarget(i);
      } else {
        g = this;
      }
      while (g.tagName && g.tagName.toLowerCase() != 'td') {
        g = g.parentNode;
        if (!g.tagName || g.tagName.toLowerCase() == 'html') {
          return;
        }
      }
      if (c.hasClass(g, h.Style.CSS_CELL_SELECTABLE)) {
        c.removeClass(g, h.Style.CSS_CELL_HOVER);
      }
    },
    setupConfig: function () {
      var g = this.cfg;
      g.addProperty(b.TODAY.key, {
        value: new Date(b.TODAY.value.getTime()),
        supercedes: b.TODAY.supercedes,
        handler: this.configToday,
        suppressEvent: true,
      });
      g.addProperty(b.PAGEDATE.key, {
        value: b.PAGEDATE.value || new Date(b.TODAY.value.getTime()),
        handler: this.configPageDate,
      });
      g.addProperty(b.SELECTED.key, {
        value: b.SELECTED.value.concat(),
        handler: this.configSelected,
      });
      g.addProperty(b.TITLE.key, { value: b.TITLE.value, handler: this.configTitle });
      g.addProperty(b.CLOSE.key, { value: b.CLOSE.value, handler: this.configClose });
      g.addProperty(b.IFRAME.key, {
        value: b.IFRAME.value,
        handler: this.configIframe,
        validator: g.checkBoolean,
      });
      g.addProperty(b.MINDATE.key, { value: b.MINDATE.value, handler: this.configMinDate });
      g.addProperty(b.MAXDATE.key, { value: b.MAXDATE.value, handler: this.configMaxDate });
      g.addProperty(b.MULTI_SELECT.key, {
        value: b.MULTI_SELECT.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.OOM_SELECT.key, {
        value: b.OOM_SELECT.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.START_WEEKDAY.key, {
        value: b.START_WEEKDAY.value,
        handler: this.configOptions,
        validator: g.checkNumber,
      });
      g.addProperty(b.SHOW_WEEKDAYS.key, {
        value: b.SHOW_WEEKDAYS.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.SHOW_WEEK_HEADER.key, {
        value: b.SHOW_WEEK_HEADER.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.SHOW_WEEK_FOOTER.key, {
        value: b.SHOW_WEEK_FOOTER.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.HIDE_BLANK_WEEKS.key, {
        value: b.HIDE_BLANK_WEEKS.value,
        handler: this.configOptions,
        validator: g.checkBoolean,
      });
      g.addProperty(b.NAV_ARROW_LEFT.key, {
        value: b.NAV_ARROW_LEFT.value,
        handler: this.configOptions,
      });
      g.addProperty(b.NAV_ARROW_RIGHT.key, {
        value: b.NAV_ARROW_RIGHT.value,
        handler: this.configOptions,
      });
      g.addProperty(b.MONTHS_SHORT.key, {
        value: b.MONTHS_SHORT.value,
        handler: this.configLocale,
      });
      g.addProperty(b.MONTHS_LONG.key, { value: b.MONTHS_LONG.value, handler: this.configLocale });
      g.addProperty(b.WEEKDAYS_1CHAR.key, {
        value: b.WEEKDAYS_1CHAR.value,
        handler: this.configLocale,
      });
      g.addProperty(b.WEEKDAYS_SHORT.key, {
        value: b.WEEKDAYS_SHORT.value,
        handler: this.configLocale,
      });
      g.addProperty(b.WEEKDAYS_MEDIUM.key, {
        value: b.WEEKDAYS_MEDIUM.value,
        handler: this.configLocale,
      });
      g.addProperty(b.WEEKDAYS_LONG.key, {
        value: b.WEEKDAYS_LONG.value,
        handler: this.configLocale,
      });
      var h = function () {
        g.refireEvent(b.LOCALE_MONTHS.key);
        g.refireEvent(b.LOCALE_WEEKDAYS.key);
      };
      g.subscribeToConfigEvent(b.START_WEEKDAY.key, h, this, true);
      g.subscribeToConfigEvent(b.MONTHS_SHORT.key, h, this, true);
      g.subscribeToConfigEvent(b.MONTHS_LONG.key, h, this, true);
      g.subscribeToConfigEvent(b.WEEKDAYS_1CHAR.key, h, this, true);
      g.subscribeToConfigEvent(b.WEEKDAYS_SHORT.key, h, this, true);
      g.subscribeToConfigEvent(b.WEEKDAYS_MEDIUM.key, h, this, true);
      g.subscribeToConfigEvent(b.WEEKDAYS_LONG.key, h, this, true);
      g.addProperty(b.LOCALE_MONTHS.key, {
        value: b.LOCALE_MONTHS.value,
        handler: this.configLocaleValues,
      });
      g.addProperty(b.LOCALE_WEEKDAYS.key, {
        value: b.LOCALE_WEEKDAYS.value,
        handler: this.configLocaleValues,
      });
      g.addProperty(b.YEAR_OFFSET.key, {
        value: b.YEAR_OFFSET.value,
        supercedes: b.YEAR_OFFSET.supercedes,
        handler: this.configLocale,
      });
      g.addProperty(b.DATE_DELIMITER.key, {
        value: b.DATE_DELIMITER.value,
        handler: this.configLocale,
      });
      g.addProperty(b.DATE_FIELD_DELIMITER.key, {
        value: b.DATE_FIELD_DELIMITER.value,
        handler: this.configLocale,
      });
      g.addProperty(b.DATE_RANGE_DELIMITER.key, {
        value: b.DATE_RANGE_DELIMITER.value,
        handler: this.configLocale,
      });
      g.addProperty(b.MY_MONTH_POSITION.key, {
        value: b.MY_MONTH_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MY_YEAR_POSITION.key, {
        value: b.MY_YEAR_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MD_MONTH_POSITION.key, {
        value: b.MD_MONTH_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MD_DAY_POSITION.key, {
        value: b.MD_DAY_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MDY_MONTH_POSITION.key, {
        value: b.MDY_MONTH_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MDY_DAY_POSITION.key, {
        value: b.MDY_DAY_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MDY_YEAR_POSITION.key, {
        value: b.MDY_YEAR_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MY_LABEL_MONTH_POSITION.key, {
        value: b.MY_LABEL_MONTH_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MY_LABEL_YEAR_POSITION.key, {
        value: b.MY_LABEL_YEAR_POSITION.value,
        handler: this.configLocale,
        validator: g.checkNumber,
      });
      g.addProperty(b.MY_LABEL_MONTH_SUFFIX.key, {
        value: b.MY_LABEL_MONTH_SUFFIX.value,
        handler: this.configLocale,
      });
      g.addProperty(b.MY_LABEL_YEAR_SUFFIX.key, {
        value: b.MY_LABEL_YEAR_SUFFIX.value,
        handler: this.configLocale,
      });
      g.addProperty(b.NAV.key, { value: b.NAV.value, handler: this.configNavigator });
      g.addProperty(b.STRINGS.key, {
        value: b.STRINGS.value,
        handler: this.configStrings,
        validator: function (i) {
          return e.isObject(i);
        },
        supercedes: b.STRINGS.supercedes,
      });
    },
    configStrings: function (h, g, i) {
      var j = e.merge(b.STRINGS.value, g[0]);
      this.cfg.setProperty(b.STRINGS.key, j, true);
    },
    configPageDate: function (h, g, i) {
      this.cfg.setProperty(b.PAGEDATE.key, this._parsePageDate(g[0]), true);
    },
    configMinDate: function (h, g, i) {
      var j = g[0];
      if (e.isString(j)) {
        j = this._parseDate(j);
        this.cfg.setProperty(b.MINDATE.key, d.getDate(j[0], j[1] - 1, j[2]));
      }
    },
    configMaxDate: function (h, g, i) {
      var j = g[0];
      if (e.isString(j)) {
        j = this._parseDate(j);
        this.cfg.setProperty(b.MAXDATE.key, d.getDate(j[0], j[1] - 1, j[2]));
      }
    },
    configToday: function (i, h, j) {
      var k = h[0];
      if (e.isString(k)) {
        k = this._parseDate(k);
      }
      var g = d.clearTime(k);
      if (!this.cfg.initialConfig[b.PAGEDATE.key]) {
        this.cfg.setProperty(b.PAGEDATE.key, g);
      }
      this.today = g;
      this.cfg.setProperty(b.TODAY.key, g, true);
    },
    configSelected: function (i, g, k) {
      var h = g[0],
        j = b.SELECTED.key;
      if (h) {
        if (e.isString(h)) {
          this.cfg.setProperty(j, this._parseDates(h), true);
        }
      }
      if (!this._selectedDates) {
        this._selectedDates = this.cfg.getProperty(j);
      }
    },
    configOptions: function (h, g, i) {
      this.Options[h.toUpperCase()] = g[0];
    },
    configLocale: function (h, g, i) {
      this.Locale[h.toUpperCase()] = g[0];
      this.cfg.refireEvent(b.LOCALE_MONTHS.key);
      this.cfg.refireEvent(b.LOCALE_WEEKDAYS.key);
    },
    configLocaleValues: function (j, i, k) {
      j = j.toLowerCase();
      var m = i[0],
        h = this.cfg,
        n = this.Locale;
      switch (j) {
        case b.LOCALE_MONTHS.key:
          switch (m) {
            case f.SHORT:
              n.LOCALE_MONTHS = h.getProperty(b.MONTHS_SHORT.key).concat();
              break;
            case f.LONG:
              n.LOCALE_MONTHS = h.getProperty(b.MONTHS_LONG.key).concat();
              break;
          }
          break;
        case b.LOCALE_WEEKDAYS.key:
          switch (m) {
            case f.ONE_CHAR:
              n.LOCALE_WEEKDAYS = h.getProperty(b.WEEKDAYS_1CHAR.key).concat();
              break;
            case f.SHORT:
              n.LOCALE_WEEKDAYS = h.getProperty(b.WEEKDAYS_SHORT.key).concat();
              break;
            case f.MEDIUM:
              n.LOCALE_WEEKDAYS = h.getProperty(b.WEEKDAYS_MEDIUM.key).concat();
              break;
            case f.LONG:
              n.LOCALE_WEEKDAYS = h.getProperty(b.WEEKDAYS_LONG.key).concat();
              break;
          }
          var l = h.getProperty(b.START_WEEKDAY.key);
          if (l > 0) {
            for (var g = 0; g < l; ++g) {
              n.LOCALE_WEEKDAYS.push(n.LOCALE_WEEKDAYS.shift());
            }
          }
          break;
      }
    },
    configNavigator: function (h, g, i) {
      var j = g[0];
      if (YAHOO.widget.CalendarNavigator && (j === true || e.isObject(j))) {
        if (!this.oNavigator) {
          this.oNavigator = new YAHOO.widget.CalendarNavigator(this);
          this.beforeRenderEvent.subscribe(
            function () {
              if (!this.pages) {
                this.oNavigator.erase();
              }
            },
            this,
            true
          );
        }
      } else {
        if (this.oNavigator) {
          this.oNavigator.destroy();
          this.oNavigator = null;
        }
      }
    },
    initStyles: function () {
      var g = f.STYLES;
      this.Style = {
        CSS_ROW_HEADER: g.CSS_ROW_HEADER,
        CSS_ROW_FOOTER: g.CSS_ROW_FOOTER,
        CSS_CELL: g.CSS_CELL,
        CSS_CELL_SELECTOR: g.CSS_CELL_SELECTOR,
        CSS_CELL_SELECTED: g.CSS_CELL_SELECTED,
        CSS_CELL_SELECTABLE: g.CSS_CELL_SELECTABLE,
        CSS_CELL_RESTRICTED: g.CSS_CELL_RESTRICTED,
        CSS_CELL_TODAY: g.CSS_CELL_TODAY,
        CSS_CELL_OOM: g.CSS_CELL_OOM,
        CSS_CELL_OOB: g.CSS_CELL_OOB,
        CSS_HEADER: g.CSS_HEADER,
        CSS_HEADER_TEXT: g.CSS_HEADER_TEXT,
        CSS_BODY: g.CSS_BODY,
        CSS_WEEKDAY_CELL: g.CSS_WEEKDAY_CELL,
        CSS_WEEKDAY_ROW: g.CSS_WEEKDAY_ROW,
        CSS_FOOTER: g.CSS_FOOTER,
        CSS_CALENDAR: g.CSS_CALENDAR,
        CSS_SINGLE: g.CSS_SINGLE,
        CSS_CONTAINER: g.CSS_CONTAINER,
        CSS_NAV_LEFT: g.CSS_NAV_LEFT,
        CSS_NAV_RIGHT: g.CSS_NAV_RIGHT,
        CSS_NAV: g.CSS_NAV,
        CSS_CLOSE: g.CSS_CLOSE,
        CSS_CELL_TOP: g.CSS_CELL_TOP,
        CSS_CELL_LEFT: g.CSS_CELL_LEFT,
        CSS_CELL_RIGHT: g.CSS_CELL_RIGHT,
        CSS_CELL_BOTTOM: g.CSS_CELL_BOTTOM,
        CSS_CELL_HOVER: g.CSS_CELL_HOVER,
        CSS_CELL_HIGHLIGHT1: g.CSS_CELL_HIGHLIGHT1,
        CSS_CELL_HIGHLIGHT2: g.CSS_CELL_HIGHLIGHT2,
        CSS_CELL_HIGHLIGHT3: g.CSS_CELL_HIGHLIGHT3,
        CSS_CELL_HIGHLIGHT4: g.CSS_CELL_HIGHLIGHT4,
        CSS_WITH_TITLE: g.CSS_WITH_TITLE,
        CSS_FIXED_SIZE: g.CSS_FIXED_SIZE,
        CSS_LINK_CLOSE: g.CSS_LINK_CLOSE,
      };
    },
    buildMonthLabel: function () {
      return this._buildMonthLabel(this.cfg.getProperty(b.PAGEDATE.key));
    },
    _buildMonthLabel: function (g) {
      var i = this.Locale.LOCALE_MONTHS[g.getMonth()] + this.Locale.MY_LABEL_MONTH_SUFFIX,
        h = g.getFullYear() + this.Locale.YEAR_OFFSET + this.Locale.MY_LABEL_YEAR_SUFFIX;
      if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
        return h + i;
      } else {
        return i + h;
      }
    },
    buildDayLabel: function (g) {
      return g.getDate();
    },
    createTitleBar: function (g) {
      var h =
        c.getElementsByClassName(
          YAHOO.widget.CalendarGroup.CSS_2UPTITLE,
          'div',
          this.oDomContainer
        )[0] || document.createElement('div');
      h.className = YAHOO.widget.CalendarGroup.CSS_2UPTITLE;
      h.innerHTML = g;
      this.oDomContainer.insertBefore(h, this.oDomContainer.firstChild);
      c.addClass(this.oDomContainer, this.Style.CSS_WITH_TITLE);
      return h;
    },
    removeTitleBar: function () {
      var g =
        c.getElementsByClassName(
          YAHOO.widget.CalendarGroup.CSS_2UPTITLE,
          'div',
          this.oDomContainer
        )[0] || null;
      if (g) {
        a.purgeElement(g);
        this.oDomContainer.removeChild(g);
      }
      c.removeClass(this.oDomContainer, this.Style.CSS_WITH_TITLE);
    },
    createCloseButton: function () {
      var k = YAHOO.widget.CalendarGroup.CSS_2UPCLOSE,
        j = this.Style.CSS_LINK_CLOSE,
        m = 'us/my/bn/x_d.gif',
        l = c.getElementsByClassName(j, 'a', this.oDomContainer)[0],
        g = this.cfg.getProperty(b.STRINGS.key),
        h = g && g.close ? g.close : '';
      if (!l) {
        l = document.createElement('a');
        a.addListener(
          l,
          'click',
          function (o, n) {
            n.hide();
            a.preventDefault(o);
          },
          this
        );
      }
      l.href = '#';
      l.className = j;
      if (f.IMG_ROOT !== null) {
        var i = c.getElementsByClassName(k, 'img', l)[0] || document.createElement('img');
        i.src = f.IMG_ROOT + m;
        i.className = k;
        l.appendChild(i);
      } else {
        l.innerHTML = '<span class="' + k + ' ' + this.Style.CSS_CLOSE + '">' + h + '</span>';
      }
      this.oDomContainer.appendChild(l);
      return l;
    },
    removeCloseButton: function () {
      var g =
        c.getElementsByClassName(this.Style.CSS_LINK_CLOSE, 'a', this.oDomContainer)[0] || null;
      if (g) {
        a.purgeElement(g);
        this.oDomContainer.removeChild(g);
      }
    },
    renderHeader: function (q) {
      var p = 7,
        o = 'us/tr/callt.gif',
        g = 'us/tr/calrt.gif',
        n = this.cfg,
        k = n.getProperty(b.PAGEDATE.key),
        l = n.getProperty(b.STRINGS.key),
        v = l && l.previousMonth ? l.previousMonth : '',
        h = l && l.nextMonth ? l.nextMonth : '',
        m;
      if (n.getProperty(b.SHOW_WEEK_HEADER.key)) {
        p += 1;
      }
      if (n.getProperty(b.SHOW_WEEK_FOOTER.key)) {
        p += 1;
      }
      q[q.length] = '<thead>';
      q[q.length] = '<tr>';
      q[q.length] = '<th colspan="' + p + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
      q[q.length] = '<div class="' + this.Style.CSS_HEADER + '">';
      var x,
        u = false;
      if (this.parent) {
        if (this.index === 0) {
          x = true;
        }
        if (this.index == this.parent.cfg.getProperty('pages') - 1) {
          u = true;
        }
      } else {
        x = true;
        u = true;
      }
      if (x) {
        m = this._buildMonthLabel(d.subtract(k, d.MONTH, 1));
        var r = n.getProperty(b.NAV_ARROW_LEFT.key);
        if (r === null && f.IMG_ROOT !== null) {
          r = f.IMG_ROOT + o;
        }
        var i = r === null ? '' : ' style="background-image:url(' + r + ')"';
        q[q.length] =
          '<a class="' +
          this.Style.CSS_NAV_LEFT +
          '"' +
          i +
          ' href="#">' +
          v +
          ' (' +
          m +
          ')' +
          '</a>';
      }
      var w = this.buildMonthLabel();
      var s = this.parent || this;
      if (s.cfg.getProperty('navigator')) {
        w = '<a class="' + this.Style.CSS_NAV + '" href="#">' + w + '</a>';
      }
      q[q.length] = w;
      if (u) {
        m = this._buildMonthLabel(d.add(k, d.MONTH, 1));
        var t = n.getProperty(b.NAV_ARROW_RIGHT.key);
        if (t === null && f.IMG_ROOT !== null) {
          t = f.IMG_ROOT + g;
        }
        var j = t === null ? '' : ' style="background-image:url(' + t + ')"';
        q[q.length] =
          '<a class="' +
          this.Style.CSS_NAV_RIGHT +
          '"' +
          j +
          ' href="#">' +
          h +
          ' (' +
          m +
          ')' +
          '</a>';
      }
      q[q.length] = '</div>\n</th>\n</tr>';
      if (n.getProperty(b.SHOW_WEEKDAYS.key)) {
        q = this.buildWeekdays(q);
      }
      q[q.length] = '</thead>';
      return q;
    },
    buildWeekdays: function (h) {
      h[h.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';
      if (this.cfg.getProperty(b.SHOW_WEEK_HEADER.key)) {
        h[h.length] = '<th>&#160;</th>';
      }
      for (var g = 0; g < this.Locale.LOCALE_WEEKDAYS.length; ++g) {
        h[h.length] =
          '<th class="' +
          this.Style.CSS_WEEKDAY_CELL +
          '">' +
          this.Locale.LOCALE_WEEKDAYS[g] +
          '</th>';
      }
      if (this.cfg.getProperty(b.SHOW_WEEK_FOOTER.key)) {
        h[h.length] = '<th>&#160;</th>';
      }
      h[h.length] = '</tr>';
      return h;
    },
    renderBody: function (T, Q) {
      var ao = this.cfg.getProperty(b.START_WEEKDAY.key);
      this.preMonthDays = T.getDay();
      if (ao > 0) {
        this.preMonthDays -= ao;
      }
      if (this.preMonthDays < 0) {
        this.preMonthDays += 7;
      }
      this.monthDays = d.findMonthEnd(T).getDate();
      this.postMonthDays = f.DISPLAY_DAYS - this.preMonthDays - this.monthDays;
      T = d.subtract(T, d.DAY, this.preMonthDays);
      var F,
        q,
        o = 'w',
        L = '_cell',
        J = 'wd',
        Z = 'd',
        v,
        X,
        af = this.today,
        u = this.cfg,
        ae,
        D = af.getFullYear(),
        Y = af.getMonth(),
        k = af.getDate(),
        ad = u.getProperty(b.PAGEDATE.key),
        j = u.getProperty(b.HIDE_BLANK_WEEKS.key),
        P = u.getProperty(b.SHOW_WEEK_FOOTER.key),
        I = u.getProperty(b.SHOW_WEEK_HEADER.key),
        O = u.getProperty(b.OOM_SELECT.key),
        B = u.getProperty(b.MINDATE.key),
        H = u.getProperty(b.MAXDATE.key),
        A = this.Locale.YEAR_OFFSET;
      if (B) {
        B = d.clearTime(B);
      }
      if (H) {
        H = d.clearTime(H);
      }
      Q[Q.length] = '<tbody class="m' + (ad.getMonth() + 1) + ' ' + this.Style.CSS_BODY + '">';
      var am = 0,
        w = document.createElement('div'),
        R = document.createElement('td');
      w.appendChild(R);
      var ac = this.parent || this;
      for (var ah = 0; ah < 6; ah++) {
        F = d.getWeekNumber(T, ao);
        q = o + F;
        if (ah !== 0 && j === true && T.getMonth() != ad.getMonth()) {
          break;
        } else {
          Q[Q.length] = '<tr class="' + q + '">';
          if (I) {
            Q = this.renderRowHeader(F, Q);
          }
          for (var an = 0; an < 7; an++) {
            v = [];
            this.clearElement(R);
            R.className = this.Style.CSS_CELL;
            R.id = this.id + L + am;
            if (T.getDate() == k && T.getMonth() == Y && T.getFullYear() == D) {
              v[v.length] = ac.renderCellStyleToday;
            }
            var G = [T.getFullYear(), T.getMonth() + 1, T.getDate()];
            this.cellDates[this.cellDates.length] = G;
            ae = T.getMonth() != ad.getMonth();
            if (ae && !O) {
              v[v.length] = ac.renderCellNotThisMonth;
            } else {
              c.addClass(R, J + T.getDay());
              c.addClass(R, Z + T.getDate());
              var S = this.renderStack.concat();
              for (var ag = 0, al = S.length; ag < al; ++ag) {
                X = null;
                var aa = S[ag],
                  ap = aa[0],
                  h,
                  K,
                  n;
                switch (ap) {
                  case f.DATE:
                    h = aa[1][1];
                    K = aa[1][2];
                    n = aa[1][0];
                    if (T.getMonth() + 1 == h && T.getDate() == K && T.getFullYear() == n) {
                      X = aa[2];
                      this.renderStack.splice(ag, 1);
                    }
                    break;
                  case f.MONTH_DAY:
                    h = aa[1][0];
                    K = aa[1][1];
                    if (T.getMonth() + 1 == h && T.getDate() == K) {
                      X = aa[2];
                      this.renderStack.splice(ag, 1);
                    }
                    break;
                  case f.RANGE:
                    var N = aa[1][0],
                      M = aa[1][1],
                      U = N[1],
                      z = N[2],
                      E = N[0],
                      ak = d.getDate(E, U - 1, z),
                      m = M[1],
                      W = M[2],
                      g = M[0],
                      aj = d.getDate(g, m - 1, W);
                    if (T.getTime() >= ak.getTime() && T.getTime() <= aj.getTime()) {
                      X = aa[2];
                      if (T.getTime() == aj.getTime()) {
                        this.renderStack.splice(ag, 1);
                      }
                    }
                    break;
                  case f.WEEKDAY:
                    var y = aa[1][0];
                    if (T.getDay() + 1 == y) {
                      X = aa[2];
                    }
                    break;
                  case f.MONTH:
                    h = aa[1][0];
                    if (T.getMonth() + 1 == h) {
                      X = aa[2];
                    }
                    break;
                }
                if (X) {
                  v[v.length] = X;
                }
              }
            }
            if (this._indexOfSelectedFieldArray(G) > -1) {
              v[v.length] = ac.renderCellStyleSelected;
            }
            if (ae) {
              v[v.length] = ac.styleCellNotThisMonth;
            }
            if ((B && T.getTime() < B.getTime()) || (H && T.getTime() > H.getTime())) {
              v[v.length] = ac.renderOutOfBoundsDate;
            } else {
              v[v.length] = ac.styleCellDefault;
              v[v.length] = ac.renderCellDefault;
            }
            for (var ab = 0; ab < v.length; ++ab) {
              if (v[ab].call(ac, T, R) == f.STOP_RENDER) {
                break;
              }
            }
            T.setTime(T.getTime() + d.ONE_DAY_MS);
            T = d.clearTime(T);
            if (am >= 0 && am <= 6) {
              c.addClass(R, this.Style.CSS_CELL_TOP);
            }
            if (am % 7 === 0) {
              c.addClass(R, this.Style.CSS_CELL_LEFT);
            }
            if ((am + 1) % 7 === 0) {
              c.addClass(R, this.Style.CSS_CELL_RIGHT);
            }
            var V = this.postMonthDays;
            if (j && V >= 7) {
              var C = Math.floor(V / 7);
              for (var ai = 0; ai < C; ++ai) {
                V -= 7;
              }
            }
            if (am >= this.preMonthDays + V + this.monthDays - 7) {
              c.addClass(R, this.Style.CSS_CELL_BOTTOM);
            }
            Q[Q.length] = w.innerHTML;
            am++;
          }
          if (P) {
            Q = this.renderRowFooter(F, Q);
          }
          Q[Q.length] = '</tr>';
        }
      }
      Q[Q.length] = '</tbody>';
      return Q;
    },
    renderFooter: function (g) {
      return g;
    },
    render: function () {
      this.beforeRenderEvent.fire();
      var i = d.findMonthStart(this.cfg.getProperty(b.PAGEDATE.key));
      this.resetRenderers();
      this.cellDates.length = 0;
      a.purgeElement(this.oDomContainer, true);
      var g = [],
        h;
      g[g.length] =
        '<table cellSpacing="0" class="' +
        this.Style.CSS_CALENDAR +
        ' y' +
        (i.getFullYear() + this.Locale.YEAR_OFFSET) +
        '" id="' +
        this.id +
        '">';
      g = this.renderHeader(g);
      g = this.renderBody(i, g);
      g = this.renderFooter(g);
      g[g.length] = '</table>';
      this.oDomContainer.innerHTML = g.join('\n');
      this.applyListeners();
      h = (this._oDoc && this._oDoc.getElementById(this.id)) || this.id;
      this.cells = c.getElementsByClassName(this.Style.CSS_CELL, 'td', h);
      this.cfg.refireEvent(b.TITLE.key);
      this.cfg.refireEvent(b.CLOSE.key);
      this.cfg.refireEvent(b.IFRAME.key);
      this.renderEvent.fire();
    },
    applyListeners: function () {
      var q = this.oDomContainer,
        h = this.parent || this,
        m = 'a',
        t = 'click';
      var n = c.getElementsByClassName(this.Style.CSS_NAV_LEFT, m, q),
        j = c.getElementsByClassName(this.Style.CSS_NAV_RIGHT, m, q);
      if (n && n.length > 0) {
        this.linkLeft = n[0];
        a.addListener(this.linkLeft, t, this.doPreviousMonthNav, h, true);
      }
      if (j && j.length > 0) {
        this.linkRight = j[0];
        a.addListener(this.linkRight, t, this.doNextMonthNav, h, true);
      }
      if (h.cfg.getProperty('navigator') !== null) {
        this.applyNavListeners();
      }
      if (this.domEventMap) {
        var k, g;
        for (var s in this.domEventMap) {
          if (e.hasOwnProperty(this.domEventMap, s)) {
            var o = this.domEventMap[s];
            if (!(o instanceof Array)) {
              o = [o];
            }
            for (var l = 0; l < o.length; l++) {
              var r = o[l];
              g = c.getElementsByClassName(s, r.tag, this.oDomContainer);
              for (var p = 0; p < g.length; p++) {
                k = g[p];
                a.addListener(k, r.event, r.handler, r.scope, r.correct);
              }
            }
          }
        }
      }
      a.addListener(this.oDomContainer, 'click', this.doSelectCell, this);
      a.addListener(this.oDomContainer, 'mouseover', this.doCellMouseOver, this);
      a.addListener(this.oDomContainer, 'mouseout', this.doCellMouseOut, this);
    },
    applyNavListeners: function () {
      var h = this.parent || this,
        i = this,
        g = c.getElementsByClassName(this.Style.CSS_NAV, 'a', this.oDomContainer);
      if (g.length > 0) {
        a.addListener(g, 'click', function (n, m) {
          var l = a.getTarget(n);
          if (this === l || c.isAncestor(this, l)) {
            a.preventDefault(n);
          }
          var j = h.oNavigator;
          if (j) {
            var k = i.cfg.getProperty('pagedate');
            j.setYear(k.getFullYear() + i.Locale.YEAR_OFFSET);
            j.setMonth(k.getMonth());
            j.show();
          }
        });
      }
    },
    getDateByCellId: function (h) {
      var g = this.getDateFieldsByCellId(h);
      return g ? d.getDate(g[0], g[1] - 1, g[2]) : null;
    },
    getDateFieldsByCellId: function (g) {
      g = this.getIndexFromId(g);
      return g > -1 ? this.cellDates[g] : null;
    },
    getCellIndex: function (j) {
      var h = -1;
      if (j) {
        var g = j.getMonth(),
          p = j.getFullYear(),
          o = j.getDate(),
          l = this.cellDates;
        for (var k = 0; k < l.length; ++k) {
          var n = l[k];
          if (n[0] === p && n[1] === g + 1 && n[2] === o) {
            h = k;
            break;
          }
        }
      }
      return h;
    },
    getIndexFromId: function (i) {
      var h = -1,
        g = i.lastIndexOf('_cell');
      if (g > -1) {
        h = parseInt(i.substring(g + 5), 10);
      }
      return h;
    },
    renderOutOfBoundsDate: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_OOB);
      g.innerHTML = h.getDate();
      return f.STOP_RENDER;
    },
    renderRowHeader: function (h, g) {
      g[g.length] = '<th class="' + this.Style.CSS_ROW_HEADER + '">' + h + '</th>';
      return g;
    },
    renderRowFooter: function (h, g) {
      g[g.length] = '<th class="' + this.Style.CSS_ROW_FOOTER + '">' + h + '</th>';
      return g;
    },
    renderCellDefault: function (h, g) {
      g.innerHTML =
        '<a href="#" class="' +
        this.Style.CSS_CELL_SELECTOR +
        '">' +
        this.buildDayLabel(h) +
        '</a>';
    },
    styleCellDefault: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_SELECTABLE);
    },
    renderCellStyleHighlight1: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_HIGHLIGHT1);
    },
    renderCellStyleHighlight2: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_HIGHLIGHT2);
    },
    renderCellStyleHighlight3: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_HIGHLIGHT3);
    },
    renderCellStyleHighlight4: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_HIGHLIGHT4);
    },
    renderCellStyleToday: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_TODAY);
    },
    renderCellStyleSelected: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL_SELECTED);
    },
    renderCellNotThisMonth: function (h, g) {
      this.styleCellNotThisMonth(h, g);
      g.innerHTML = h.getDate();
      return f.STOP_RENDER;
    },
    styleCellNotThisMonth: function (h, g) {
      YAHOO.util.Dom.addClass(g, this.Style.CSS_CELL_OOM);
    },
    renderBodyCellRestricted: function (h, g) {
      c.addClass(g, this.Style.CSS_CELL);
      c.addClass(g, this.Style.CSS_CELL_RESTRICTED);
      g.innerHTML = h.getDate();
      return f.STOP_RENDER;
    },
    addMonths: function (i) {
      var h = b.PAGEDATE.key,
        j = this.cfg.getProperty(h),
        g = d.add(j, d.MONTH, i);
      this.cfg.setProperty(h, g);
      this.resetRenderers();
      this.changePageEvent.fire(j, g);
    },
    subtractMonths: function (g) {
      this.addMonths(-1 * g);
    },
    addYears: function (i) {
      var h = b.PAGEDATE.key,
        j = this.cfg.getProperty(h),
        g = d.add(j, d.YEAR, i);
      this.cfg.setProperty(h, g);
      this.resetRenderers();
      this.changePageEvent.fire(j, g);
    },
    subtractYears: function (g) {
      this.addYears(-1 * g);
    },
    nextMonth: function () {
      this.addMonths(1);
    },
    previousMonth: function () {
      this.addMonths(-1);
    },
    nextYear: function () {
      this.addYears(1);
    },
    previousYear: function () {
      this.addYears(-1);
    },
    reset: function () {
      this.cfg.resetProperty(b.SELECTED.key);
      this.cfg.resetProperty(b.PAGEDATE.key);
      this.resetEvent.fire();
    },
    clear: function () {
      this.cfg.setProperty(b.SELECTED.key, []);
      this.cfg.setProperty(b.PAGEDATE.key, new Date(this.today.getTime()));
      this.clearEvent.fire();
    },
    select: function (i) {
      var l = this._toFieldArray(i),
        h = [],
        k = [],
        m = b.SELECTED.key;
      for (var g = 0; g < l.length; ++g) {
        var j = l[g];
        if (!this.isDateOOB(this._toDate(j))) {
          if (h.length === 0) {
            this.beforeSelectEvent.fire();
            k = this.cfg.getProperty(m);
          }
          h.push(j);
          if (this._indexOfSelectedFieldArray(j) == -1) {
            k[k.length] = j;
          }
        }
      }
      if (h.length > 0) {
        if (this.parent) {
          this.parent.cfg.setProperty(m, k);
        } else {
          this.cfg.setProperty(m, k);
        }
        this.selectEvent.fire(h);
      }
      return this.getSelectedDates();
    },
    selectCell: function (j) {
      var h = this.cells[j],
        n = this.cellDates[j],
        m = this._toDate(n),
        i = c.hasClass(h, this.Style.CSS_CELL_SELECTABLE);
      if (i) {
        this.beforeSelectEvent.fire();
        var l = b.SELECTED.key;
        var k = this.cfg.getProperty(l);
        var g = n.concat();
        if (this._indexOfSelectedFieldArray(g) == -1) {
          k[k.length] = g;
        }
        if (this.parent) {
          this.parent.cfg.setProperty(l, k);
        } else {
          this.cfg.setProperty(l, k);
        }
        this.renderCellStyleSelected(m, h);
        this.selectEvent.fire([g]);
        this.doCellMouseOut.call(h, null, this);
      }
      return this.getSelectedDates();
    },
    deselect: function (k) {
      var g = this._toFieldArray(k),
        j = [],
        m = [],
        n = b.SELECTED.key;
      for (var h = 0; h < g.length; ++h) {
        var l = g[h];
        if (!this.isDateOOB(this._toDate(l))) {
          if (j.length === 0) {
            this.beforeDeselectEvent.fire();
            m = this.cfg.getProperty(n);
          }
          j.push(l);
          var i = this._indexOfSelectedFieldArray(l);
          if (i != -1) {
            m.splice(i, 1);
          }
        }
      }
      if (j.length > 0) {
        if (this.parent) {
          this.parent.cfg.setProperty(n, m);
        } else {
          this.cfg.setProperty(n, m);
        }
        this.deselectEvent.fire(j);
      }
      return this.getSelectedDates();
    },
    deselectCell: function (k) {
      var h = this.cells[k],
        n = this.cellDates[k],
        i = this._indexOfSelectedFieldArray(n);
      var j = c.hasClass(h, this.Style.CSS_CELL_SELECTABLE);
      if (j) {
        this.beforeDeselectEvent.fire();
        var l = this.cfg.getProperty(b.SELECTED.key),
          m = this._toDate(n),
          g = n.concat();
        if (i > -1) {
          if (
            (this.cfg.getProperty(b.PAGEDATE.key).getMonth() == m.getMonth() &&
              this.cfg.getProperty(b.PAGEDATE.key).getFullYear() == m.getFullYear()) ||
            this.cfg.getProperty(b.OOM_SELECT.key)
          ) {
            c.removeClass(h, this.Style.CSS_CELL_SELECTED);
          }
          l.splice(i, 1);
        }
        if (this.parent) {
          this.parent.cfg.setProperty(b.SELECTED.key, l);
        } else {
          this.cfg.setProperty(b.SELECTED.key, l);
        }
        this.deselectEvent.fire([g]);
      }
      return this.getSelectedDates();
    },
    deselectAll: function () {
      this.beforeDeselectEvent.fire();
      var j = b.SELECTED.key,
        g = this.cfg.getProperty(j),
        h = g.length,
        i = g.concat();
      if (this.parent) {
        this.parent.cfg.setProperty(j, []);
      } else {
        this.cfg.setProperty(j, []);
      }
      if (h > 0) {
        this.deselectEvent.fire(i);
      }
      return this.getSelectedDates();
    },
    _toFieldArray: function (h) {
      var g = [];
      if (h instanceof Date) {
        g = [[h.getFullYear(), h.getMonth() + 1, h.getDate()]];
      } else {
        if (e.isString(h)) {
          g = this._parseDates(h);
        } else {
          if (e.isArray(h)) {
            for (var j = 0; j < h.length; ++j) {
              var k = h[j];
              g[g.length] = [k.getFullYear(), k.getMonth() + 1, k.getDate()];
            }
          }
        }
      }
      return g;
    },
    toDate: function (g) {
      return this._toDate(g);
    },
    _toDate: function (g) {
      if (g instanceof Date) {
        return g;
      } else {
        return d.getDate(g[0], g[1] - 1, g[2]);
      }
    },
    _fieldArraysAreEqual: function (i, h) {
      var g = false;
      if (i[0] == h[0] && i[1] == h[1] && i[2] == h[2]) {
        g = true;
      }
      return g;
    },
    _indexOfSelectedFieldArray: function (k) {
      var j = -1,
        g = this.cfg.getProperty(b.SELECTED.key);
      for (var i = 0; i < g.length; ++i) {
        var h = g[i];
        if (k[0] == h[0] && k[1] == h[1] && k[2] == h[2]) {
          j = i;
          break;
        }
      }
      return j;
    },
    isDateOOM: function (g) {
      return g.getMonth() != this.cfg.getProperty(b.PAGEDATE.key).getMonth();
    },
    isDateOOB: function (i) {
      var j = this.cfg.getProperty(b.MINDATE.key),
        k = this.cfg.getProperty(b.MAXDATE.key),
        h = d;
      if (j) {
        j = h.clearTime(j);
      }
      if (k) {
        k = h.clearTime(k);
      }
      var g = new Date(i.getTime());
      g = h.clearTime(g);
      return (j && g.getTime() < j.getTime()) || (k && g.getTime() > k.getTime());
    },
    _parsePageDate: function (g) {
      var j;
      if (g) {
        if (g instanceof Date) {
          j = d.findMonthStart(g);
        } else {
          var k, i, h;
          h = g.split(this.cfg.getProperty(b.DATE_FIELD_DELIMITER.key));
          k = parseInt(h[this.cfg.getProperty(b.MY_MONTH_POSITION.key) - 1], 10) - 1;
          i =
            parseInt(h[this.cfg.getProperty(b.MY_YEAR_POSITION.key) - 1], 10) -
            this.Locale.YEAR_OFFSET;
          j = d.getDate(i, k, 1);
        }
      } else {
        j = d.getDate(this.today.getFullYear(), this.today.getMonth(), 1);
      }
      return j;
    },
    onBeforeSelect: function () {
      if (this.cfg.getProperty(b.MULTI_SELECT.key) === false) {
        if (this.parent) {
          this.parent.callChildFunction('clearAllBodyCellStyles', this.Style.CSS_CELL_SELECTED);
          this.parent.deselectAll();
        } else {
          this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
          this.deselectAll();
        }
      }
    },
    onSelect: function (g) {},
    onBeforeDeselect: function () {},
    onDeselect: function (g) {},
    onChangePage: function () {
      this.render();
    },
    onRender: function () {},
    onReset: function () {
      this.render();
    },
    onClear: function () {
      this.render();
    },
    validate: function () {
      return true;
    },
    _parseDate: function (j) {
      var k = j.split(this.Locale.DATE_FIELD_DELIMITER),
        g;
      if (k.length == 2) {
        g = [k[this.Locale.MD_MONTH_POSITION - 1], k[this.Locale.MD_DAY_POSITION - 1]];
        g.type = f.MONTH_DAY;
      } else {
        g = [
          k[this.Locale.MDY_YEAR_POSITION - 1] - this.Locale.YEAR_OFFSET,
          k[this.Locale.MDY_MONTH_POSITION - 1],
          k[this.Locale.MDY_DAY_POSITION - 1],
        ];
        g.type = f.DATE;
      }
      for (var h = 0; h < g.length; h++) {
        g[h] = parseInt(g[h], 10);
      }
      return g;
    },
    _parseDates: function (h) {
      var o = [],
        n = h.split(this.Locale.DATE_DELIMITER);
      for (var m = 0; m < n.length; ++m) {
        var l = n[m];
        if (l.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
          var g = l.split(this.Locale.DATE_RANGE_DELIMITER),
            k = this._parseDate(g[0]),
            p = this._parseDate(g[1]),
            j = this._parseRange(k, p);
          o = o.concat(j);
        } else {
          var i = this._parseDate(l);
          o.push(i);
        }
      }
      return o;
    },
    _parseRange: function (g, k) {
      var h = d.add(d.getDate(g[0], g[1] - 1, g[2]), d.DAY, 1),
        j = d.getDate(k[0], k[1] - 1, k[2]),
        i = [];
      i.push(g);
      while (h.getTime() <= j.getTime()) {
        i.push([h.getFullYear(), h.getMonth() + 1, h.getDate()]);
        h = d.add(h, d.DAY, 1);
      }
      return i;
    },
    resetRenderers: function () {
      this.renderStack = this._renderStack.concat();
    },
    removeRenderers: function () {
      this._renderStack = [];
      this.renderStack = [];
    },
    clearElement: function (g) {
      g.innerHTML = '&#160;';
      g.className = '';
    },
    addRenderer: function (g, h) {
      var k = this._parseDates(g);
      for (var j = 0; j < k.length; ++j) {
        var l = k[j];
        if (l.length == 2) {
          if (l[0] instanceof Array) {
            this._addRenderer(f.RANGE, l, h);
          } else {
            this._addRenderer(f.MONTH_DAY, l, h);
          }
        } else {
          if (l.length == 3) {
            this._addRenderer(f.DATE, l, h);
          }
        }
      }
    },
    _addRenderer: function (h, i, g) {
      var j = [h, i, g];
      this.renderStack.unshift(j);
      this._renderStack = this.renderStack.concat();
    },
    addMonthRenderer: function (h, g) {
      this._addRenderer(f.MONTH, [h], g);
    },
    addWeekdayRenderer: function (h, g) {
      this._addRenderer(f.WEEKDAY, [h], g);
    },
    clearAllBodyCellStyles: function (g) {
      for (var h = 0; h < this.cells.length; ++h) {
        c.removeClass(this.cells[h], g);
      }
    },
    setMonth: function (i) {
      var g = b.PAGEDATE.key,
        h = this.cfg.getProperty(g);
      h.setMonth(parseInt(i, 10));
      this.cfg.setProperty(g, h);
    },
    setYear: function (h) {
      var g = b.PAGEDATE.key,
        i = this.cfg.getProperty(g);
      i.setFullYear(parseInt(h, 10) - this.Locale.YEAR_OFFSET);
      this.cfg.setProperty(g, i);
    },
    getSelectedDates: function () {
      var i = [],
        h = this.cfg.getProperty(b.SELECTED.key);
      for (var k = 0; k < h.length; ++k) {
        var j = h[k];
        var g = d.getDate(j[0], j[1] - 1, j[2]);
        i.push(g);
      }
      i.sort(function (m, l) {
        return m - l;
      });
      return i;
    },
    hide: function () {
      if (this.beforeHideEvent.fire()) {
        this.oDomContainer.style.display = 'none';
        this.hideEvent.fire();
      }
    },
    show: function () {
      if (this.beforeShowEvent.fire()) {
        this.oDomContainer.style.display = 'block';
        this.showEvent.fire();
      }
    },
    browser: (function () {
      var g = navigator.userAgent.toLowerCase();
      if (g.indexOf('opera') != -1) {
        return 'opera';
      } else {
        if (g.indexOf('msie 7') != -1) {
          return 'ie7';
        } else {
          if (g.indexOf('msie') != -1) {
            return 'ie';
          } else {
            if (g.indexOf('safari') != -1) {
              return 'safari';
            } else {
              if (g.indexOf('gecko') != -1) {
                return 'gecko';
              } else {
                return false;
              }
            }
          }
        }
      }
    })(),
    toString: function () {
      return 'Calendar ' + this.id;
    },
    destroy: function () {
      if (this.beforeDestroyEvent.fire()) {
        var g = this;
        if (g.navigator) {
          g.navigator.destroy();
        }
        if (g.cfg) {
          g.cfg.destroy();
        }
        a.purgeElement(g.oDomContainer, true);
        c.removeClass(g.oDomContainer, g.Style.CSS_WITH_TITLE);
        c.removeClass(g.oDomContainer, g.Style.CSS_CONTAINER);
        c.removeClass(g.oDomContainer, g.Style.CSS_SINGLE);
        g.oDomContainer.innerHTML = '';
        g.oDomContainer = null;
        g.cells = null;
        this.destroyEvent.fire();
      }
    },
  };
  YAHOO.widget.Calendar = f;
  YAHOO.widget.Calendar_Core = YAHOO.widget.Calendar;
  YAHOO.widget.Cal_Core = YAHOO.widget.Calendar;
})();
(function () {
  var d = YAHOO.util.Dom,
    f = YAHOO.widget.DateMath,
    a = YAHOO.util.Event,
    e = YAHOO.lang,
    g = YAHOO.widget.Calendar;
  function b(j, h, i) {
    if (arguments.length > 0) {
      this.init.apply(this, arguments);
    }
  }
  b.DEFAULT_CONFIG = b._DEFAULT_CONFIG = g.DEFAULT_CONFIG;
  b.DEFAULT_CONFIG.PAGES = { key: 'pages', value: 2 };
  var c = b.DEFAULT_CONFIG;
  b.prototype = {
    init: function (k, i, j) {
      var h = this._parseArgs(arguments);
      k = h.id;
      i = h.container;
      j = h.config;
      this.oDomContainer = d.get(i);
      if (!this.oDomContainer.id) {
        this.oDomContainer.id = d.generateId();
      }
      if (!k) {
        k = this.oDomContainer.id + '_t';
      }
      this.id = k;
      this.containerId = this.oDomContainer.id;
      this.initEvents();
      this.initStyles();
      this.pages = [];
      d.addClass(this.oDomContainer, b.CSS_CONTAINER);
      d.addClass(this.oDomContainer, b.CSS_MULTI_UP);
      this.cfg = new YAHOO.util.Config(this);
      this.Options = {};
      this.Locale = {};
      this.setupConfig();
      if (j) {
        this.cfg.applyConfig(j, true);
      }
      this.cfg.fireQueue();
    },
    setupConfig: function () {
      var h = this.cfg;
      h.addProperty(c.PAGES.key, {
        value: c.PAGES.value,
        validator: h.checkNumber,
        handler: this.configPages,
      });
      h.addProperty(c.YEAR_OFFSET.key, {
        value: c.YEAR_OFFSET.value,
        handler: this.delegateConfig,
        supercedes: c.YEAR_OFFSET.supercedes,
        suppressEvent: true,
      });
      h.addProperty(c.TODAY.key, {
        value: new Date(c.TODAY.value.getTime()),
        supercedes: c.TODAY.supercedes,
        handler: this.configToday,
        suppressEvent: false,
      });
      h.addProperty(c.PAGEDATE.key, {
        value: c.PAGEDATE.value || new Date(c.TODAY.value.getTime()),
        handler: this.configPageDate,
      });
      h.addProperty(c.SELECTED.key, { value: [], handler: this.configSelected });
      h.addProperty(c.TITLE.key, { value: c.TITLE.value, handler: this.configTitle });
      h.addProperty(c.CLOSE.key, { value: c.CLOSE.value, handler: this.configClose });
      h.addProperty(c.IFRAME.key, {
        value: c.IFRAME.value,
        handler: this.configIframe,
        validator: h.checkBoolean,
      });
      h.addProperty(c.MINDATE.key, { value: c.MINDATE.value, handler: this.delegateConfig });
      h.addProperty(c.MAXDATE.key, { value: c.MAXDATE.value, handler: this.delegateConfig });
      h.addProperty(c.MULTI_SELECT.key, {
        value: c.MULTI_SELECT.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.OOM_SELECT.key, {
        value: c.OOM_SELECT.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.START_WEEKDAY.key, {
        value: c.START_WEEKDAY.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.SHOW_WEEKDAYS.key, {
        value: c.SHOW_WEEKDAYS.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.SHOW_WEEK_HEADER.key, {
        value: c.SHOW_WEEK_HEADER.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.SHOW_WEEK_FOOTER.key, {
        value: c.SHOW_WEEK_FOOTER.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.HIDE_BLANK_WEEKS.key, {
        value: c.HIDE_BLANK_WEEKS.value,
        handler: this.delegateConfig,
        validator: h.checkBoolean,
      });
      h.addProperty(c.NAV_ARROW_LEFT.key, {
        value: c.NAV_ARROW_LEFT.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.NAV_ARROW_RIGHT.key, {
        value: c.NAV_ARROW_RIGHT.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.MONTHS_SHORT.key, {
        value: c.MONTHS_SHORT.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.MONTHS_LONG.key, {
        value: c.MONTHS_LONG.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.WEEKDAYS_1CHAR.key, {
        value: c.WEEKDAYS_1CHAR.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.WEEKDAYS_SHORT.key, {
        value: c.WEEKDAYS_SHORT.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.WEEKDAYS_MEDIUM.key, {
        value: c.WEEKDAYS_MEDIUM.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.WEEKDAYS_LONG.key, {
        value: c.WEEKDAYS_LONG.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.LOCALE_MONTHS.key, {
        value: c.LOCALE_MONTHS.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.LOCALE_WEEKDAYS.key, {
        value: c.LOCALE_WEEKDAYS.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.DATE_DELIMITER.key, {
        value: c.DATE_DELIMITER.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.DATE_FIELD_DELIMITER.key, {
        value: c.DATE_FIELD_DELIMITER.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.DATE_RANGE_DELIMITER.key, {
        value: c.DATE_RANGE_DELIMITER.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.MY_MONTH_POSITION.key, {
        value: c.MY_MONTH_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MY_YEAR_POSITION.key, {
        value: c.MY_YEAR_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MD_MONTH_POSITION.key, {
        value: c.MD_MONTH_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MD_DAY_POSITION.key, {
        value: c.MD_DAY_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MDY_MONTH_POSITION.key, {
        value: c.MDY_MONTH_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MDY_DAY_POSITION.key, {
        value: c.MDY_DAY_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MDY_YEAR_POSITION.key, {
        value: c.MDY_YEAR_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MY_LABEL_MONTH_POSITION.key, {
        value: c.MY_LABEL_MONTH_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MY_LABEL_YEAR_POSITION.key, {
        value: c.MY_LABEL_YEAR_POSITION.value,
        handler: this.delegateConfig,
        validator: h.checkNumber,
      });
      h.addProperty(c.MY_LABEL_MONTH_SUFFIX.key, {
        value: c.MY_LABEL_MONTH_SUFFIX.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.MY_LABEL_YEAR_SUFFIX.key, {
        value: c.MY_LABEL_YEAR_SUFFIX.value,
        handler: this.delegateConfig,
      });
      h.addProperty(c.NAV.key, { value: c.NAV.value, handler: this.configNavigator });
      h.addProperty(c.STRINGS.key, {
        value: c.STRINGS.value,
        handler: this.configStrings,
        validator: function (i) {
          return e.isObject(i);
        },
        supercedes: c.STRINGS.supercedes,
      });
    },
    initEvents: function () {
      var j = this,
        l = 'Event',
        m = YAHOO.util.CustomEvent;
      var i = function (o, s, n) {
        for (var r = 0; r < j.pages.length; ++r) {
          var q = j.pages[r];
          q[this.type + l].subscribe(o, s, n);
        }
      };
      var h = function (n, r) {
        for (var q = 0; q < j.pages.length; ++q) {
          var o = j.pages[q];
          o[this.type + l].unsubscribe(n, r);
        }
      };
      var k = g._EVENT_TYPES;
      j.beforeSelectEvent = new m(k.BEFORE_SELECT);
      j.beforeSelectEvent.subscribe = i;
      j.beforeSelectEvent.unsubscribe = h;
      j.selectEvent = new m(k.SELECT);
      j.selectEvent.subscribe = i;
      j.selectEvent.unsubscribe = h;
      j.beforeDeselectEvent = new m(k.BEFORE_DESELECT);
      j.beforeDeselectEvent.subscribe = i;
      j.beforeDeselectEvent.unsubscribe = h;
      j.deselectEvent = new m(k.DESELECT);
      j.deselectEvent.subscribe = i;
      j.deselectEvent.unsubscribe = h;
      j.changePageEvent = new m(k.CHANGE_PAGE);
      j.changePageEvent.subscribe = i;
      j.changePageEvent.unsubscribe = h;
      j.beforeRenderEvent = new m(k.BEFORE_RENDER);
      j.beforeRenderEvent.subscribe = i;
      j.beforeRenderEvent.unsubscribe = h;
      j.renderEvent = new m(k.RENDER);
      j.renderEvent.subscribe = i;
      j.renderEvent.unsubscribe = h;
      j.resetEvent = new m(k.RESET);
      j.resetEvent.subscribe = i;
      j.resetEvent.unsubscribe = h;
      j.clearEvent = new m(k.CLEAR);
      j.clearEvent.subscribe = i;
      j.clearEvent.unsubscribe = h;
      j.beforeShowEvent = new m(k.BEFORE_SHOW);
      j.showEvent = new m(k.SHOW);
      j.beforeHideEvent = new m(k.BEFORE_HIDE);
      j.hideEvent = new m(k.HIDE);
      j.beforeShowNavEvent = new m(k.BEFORE_SHOW_NAV);
      j.showNavEvent = new m(k.SHOW_NAV);
      j.beforeHideNavEvent = new m(k.BEFORE_HIDE_NAV);
      j.hideNavEvent = new m(k.HIDE_NAV);
      j.beforeRenderNavEvent = new m(k.BEFORE_RENDER_NAV);
      j.renderNavEvent = new m(k.RENDER_NAV);
      j.beforeDestroyEvent = new m(k.BEFORE_DESTROY);
      j.destroyEvent = new m(k.DESTROY);
    },
    configPages: function (u, s, n) {
      var l = s[0],
        j = c.PAGEDATE.key,
        x = '_',
        m,
        o = null,
        t = 'groupcal',
        w = 'first-of-type',
        k = 'last-of-type';
      for (var i = 0; i < l; ++i) {
        var v = this.id + x + i,
          r = this.containerId + x + i,
          q = this.cfg.getConfig();
        q.close = false;
        q.title = false;
        q.navigator = null;
        if (i > 0) {
          m = new Date(o);
          this._setMonthOnDate(m, m.getMonth() + i);
          q.pageDate = m;
        }
        var h = this.constructChild(v, r, q);
        d.removeClass(h.oDomContainer, this.Style.CSS_SINGLE);
        d.addClass(h.oDomContainer, t);
        if (i === 0) {
          o = h.cfg.getProperty(j);
          d.addClass(h.oDomContainer, w);
        }
        if (i == l - 1) {
          d.addClass(h.oDomContainer, k);
        }
        h.parent = this;
        h.index = i;
        this.pages[this.pages.length] = h;
      }
    },
    configPageDate: function (o, n, l) {
      var j = n[0],
        m;
      var k = c.PAGEDATE.key;
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        if (i === 0) {
          m = h._parsePageDate(j);
          h.cfg.setProperty(k, m);
        } else {
          var q = new Date(m);
          this._setMonthOnDate(q, q.getMonth() + i);
          h.cfg.setProperty(k, q);
        }
      }
    },
    configSelected: function (j, h, l) {
      var k = c.SELECTED.key;
      this.delegateConfig(j, h, l);
      var i = this.pages.length > 0 ? this.pages[0].cfg.getProperty(k) : [];
      this.cfg.setProperty(k, i, true);
    },
    delegateConfig: function (i, h, l) {
      var m = h[0];
      var k;
      for (var j = 0; j < this.pages.length; j++) {
        k = this.pages[j];
        k.cfg.setProperty(i, m);
      }
    },
    setChildFunction: function (k, i) {
      var h = this.cfg.getProperty(c.PAGES.key);
      for (var j = 0; j < h; ++j) {
        this.pages[j][k] = i;
      }
    },
    callChildFunction: function (m, i) {
      var h = this.cfg.getProperty(c.PAGES.key);
      for (var l = 0; l < h; ++l) {
        var k = this.pages[l];
        if (k[m]) {
          var j = k[m];
          j.call(k, i);
        }
      }
    },
    constructChild: function (k, i, j) {
      var h = document.getElementById(i);
      if (!h) {
        h = document.createElement('div');
        h.id = i;
        this.oDomContainer.appendChild(h);
      }
      return new g(k, i, j);
    },
    setMonth: function (l) {
      l = parseInt(l, 10);
      var m;
      var i = c.PAGEDATE.key;
      for (var k = 0; k < this.pages.length; ++k) {
        var j = this.pages[k];
        var h = j.cfg.getProperty(i);
        if (k === 0) {
          m = h.getFullYear();
        } else {
          h.setFullYear(m);
        }
        this._setMonthOnDate(h, l + k);
        j.cfg.setProperty(i, h);
      }
    },
    setYear: function (j) {
      var i = c.PAGEDATE.key;
      j = parseInt(j, 10);
      for (var l = 0; l < this.pages.length; ++l) {
        var k = this.pages[l];
        var h = k.cfg.getProperty(i);
        if (h.getMonth() + 1 == 1 && l > 0) {
          j += 1;
        }
        k.setYear(j);
      }
    },
    render: function () {
      this.renderHeader();
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.render();
      }
      this.renderFooter();
    },
    select: function (h) {
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        i.select(h);
      }
      return this.getSelectedDates();
    },
    selectCell: function (h) {
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        i.selectCell(h);
      }
      return this.getSelectedDates();
    },
    deselect: function (h) {
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        i.deselect(h);
      }
      return this.getSelectedDates();
    },
    deselectAll: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.deselectAll();
      }
      return this.getSelectedDates();
    },
    deselectCell: function (h) {
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        i.deselectCell(h);
      }
      return this.getSelectedDates();
    },
    reset: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.reset();
      }
    },
    clear: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.clear();
      }
      this.cfg.setProperty(c.SELECTED.key, []);
      this.cfg.setProperty(c.PAGEDATE.key, new Date(this.pages[0].today.getTime()));
      this.render();
    },
    nextMonth: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.nextMonth();
      }
    },
    previousMonth: function () {
      for (var i = this.pages.length - 1; i >= 0; --i) {
        var h = this.pages[i];
        h.previousMonth();
      }
    },
    nextYear: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.nextYear();
      }
    },
    previousYear: function () {
      for (var i = 0; i < this.pages.length; ++i) {
        var h = this.pages[i];
        h.previousYear();
      }
    },
    getSelectedDates: function () {
      var j = [];
      var i = this.cfg.getProperty(c.SELECTED.key);
      for (var l = 0; l < i.length; ++l) {
        var k = i[l];
        var h = f.getDate(k[0], k[1] - 1, k[2]);
        j.push(h);
      }
      j.sort(function (n, m) {
        return n - m;
      });
      return j;
    },
    addRenderer: function (h, i) {
      for (var k = 0; k < this.pages.length; ++k) {
        var j = this.pages[k];
        j.addRenderer(h, i);
      }
    },
    addMonthRenderer: function (k, h) {
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        i.addMonthRenderer(k, h);
      }
    },
    addWeekdayRenderer: function (i, h) {
      for (var k = 0; k < this.pages.length; ++k) {
        var j = this.pages[k];
        j.addWeekdayRenderer(i, h);
      }
    },
    removeRenderers: function () {
      this.callChildFunction('removeRenderers');
    },
    renderHeader: function () {},
    renderFooter: function () {},
    addMonths: function (h) {
      this.callChildFunction('addMonths', h);
    },
    subtractMonths: function (h) {
      this.callChildFunction('subtractMonths', h);
    },
    addYears: function (h) {
      this.callChildFunction('addYears', h);
    },
    subtractYears: function (h) {
      this.callChildFunction('subtractYears', h);
    },
    getCalendarPage: function (l) {
      var o = null;
      if (l) {
        var p = l.getFullYear(),
          k = l.getMonth();
        var j = this.pages;
        for (var n = 0; n < j.length; ++n) {
          var h = j[n].cfg.getProperty('pagedate');
          if (h.getFullYear() === p && h.getMonth() === k) {
            o = j[n];
            break;
          }
        }
      }
      return o;
    },
    _setMonthOnDate: function (i, j) {
      if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420 && (j < 0 || j > 11)) {
        var h = f.add(i, f.MONTH, j - i.getMonth());
        i.setTime(h.getTime());
      } else {
        i.setMonth(j);
      }
    },
    _fixWidth: function () {
      var h = 0;
      for (var j = 0; j < this.pages.length; ++j) {
        var i = this.pages[j];
        h += i.oDomContainer.offsetWidth;
      }
      if (h > 0) {
        this.oDomContainer.style.width = h + 'px';
      }
    },
    toString: function () {
      return 'CalendarGroup ' + this.id;
    },
    destroy: function () {
      if (this.beforeDestroyEvent.fire()) {
        var k = this;
        if (k.navigator) {
          k.navigator.destroy();
        }
        if (k.cfg) {
          k.cfg.destroy();
        }
        a.purgeElement(k.oDomContainer, true);
        d.removeClass(k.oDomContainer, b.CSS_CONTAINER);
        d.removeClass(k.oDomContainer, b.CSS_MULTI_UP);
        for (var j = 0, h = k.pages.length; j < h; j++) {
          k.pages[j].destroy();
          k.pages[j] = null;
        }
        k.oDomContainer.innerHTML = '';
        k.oDomContainer = null;
        this.destroyEvent.fire();
      }
    },
  };
  b.CSS_CONTAINER = 'yui-calcontainer';
  b.CSS_MULTI_UP = 'multi';
  b.CSS_2UPTITLE = 'title';
  b.CSS_2UPCLOSE = 'close-icon';
  YAHOO.lang.augmentProto(
    b,
    g,
    'buildDayLabel',
    'buildMonthLabel',
    'renderOutOfBoundsDate',
    'renderRowHeader',
    'renderRowFooter',
    'renderCellDefault',
    'styleCellDefault',
    'renderCellStyleHighlight1',
    'renderCellStyleHighlight2',
    'renderCellStyleHighlight3',
    'renderCellStyleHighlight4',
    'renderCellStyleToday',
    'renderCellStyleSelected',
    'renderCellNotThisMonth',
    'styleCellNotThisMonth',
    'renderBodyCellRestricted',
    'initStyles',
    'configTitle',
    'configClose',
    'configIframe',
    'configStrings',
    'configToday',
    'configNavigator',
    'createTitleBar',
    'createCloseButton',
    'removeTitleBar',
    'removeCloseButton',
    'hide',
    'show',
    'toDate',
    '_toDate',
    '_parseArgs',
    'browser'
  );
  YAHOO.widget.CalGrp = b;
  YAHOO.widget.CalendarGroup = b;
  YAHOO.widget.Calendar2up = function (j, h, i) {
    this.init(j, h, i);
  };
  YAHOO.extend(YAHOO.widget.Calendar2up, b);
  YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up;
})();
YAHOO.widget.CalendarNavigator = function (a) {
  this.init(a);
};
(function () {
  var a = YAHOO.widget.CalendarNavigator;
  a.CLASSES = {
    NAV: 'yui-cal-nav',
    NAV_VISIBLE: 'yui-cal-nav-visible',
    MASK: 'yui-cal-nav-mask',
    YEAR: 'yui-cal-nav-y',
    MONTH: 'yui-cal-nav-m',
    BUTTONS: 'yui-cal-nav-b',
    BUTTON: 'yui-cal-nav-btn',
    ERROR: 'yui-cal-nav-e',
    YEAR_CTRL: 'yui-cal-nav-yc',
    MONTH_CTRL: 'yui-cal-nav-mc',
    INVALID: 'yui-invalid',
    DEFAULT: 'yui-default',
  };
  a.DEFAULT_CONFIG = {
    strings: {
      month: 'Month',
      year: 'Year',
      submit: 'Okay',
      cancel: 'Cancel',
      invalidYear: 'Year needs to be a number',
    },
    monthFormat: YAHOO.widget.Calendar.LONG,
    initialFocus: 'year',
  };
  a._DEFAULT_CFG = a.DEFAULT_CONFIG;
  a.ID_SUFFIX = '_nav';
  a.MONTH_SUFFIX = '_month';
  a.YEAR_SUFFIX = '_year';
  a.ERROR_SUFFIX = '_error';
  a.CANCEL_SUFFIX = '_cancel';
  a.SUBMIT_SUFFIX = '_submit';
  a.YR_MAX_DIGITS = 4;
  a.YR_MINOR_INC = 1;
  a.YR_MAJOR_INC = 10;
  a.UPDATE_DELAY = 50;
  a.YR_PATTERN = /^\d+$/;
  a.TRIM = /^\s*(.*?)\s*$/;
})();
YAHOO.widget.CalendarNavigator.prototype = {
  id: null,
  cal: null,
  navEl: null,
  maskEl: null,
  yearEl: null,
  monthEl: null,
  errorEl: null,
  submitEl: null,
  cancelEl: null,
  firstCtrl: null,
  lastCtrl: null,
  _doc: null,
  _year: null,
  _month: 0,
  __rendered: false,
  init: function (a) {
    var c = a.oDomContainer;
    this.cal = a;
    this.id = c.id + YAHOO.widget.CalendarNavigator.ID_SUFFIX;
    this._doc = c.ownerDocument;
    var b = YAHOO.env.ua.ie;
    this.__isIEQuirks = b && (b <= 6 || this._doc.compatMode == 'BackCompat');
  },
  show: function () {
    var a = YAHOO.widget.CalendarNavigator.CLASSES;
    if (this.cal.beforeShowNavEvent.fire()) {
      if (!this.__rendered) {
        this.render();
      }
      this.clearErrors();
      this._updateMonthUI();
      this._updateYearUI();
      this._show(this.navEl, true);
      this.setInitialFocus();
      this.showMask();
      YAHOO.util.Dom.addClass(this.cal.oDomContainer, a.NAV_VISIBLE);
      this.cal.showNavEvent.fire();
    }
  },
  hide: function () {
    var a = YAHOO.widget.CalendarNavigator.CLASSES;
    if (this.cal.beforeHideNavEvent.fire()) {
      this._show(this.navEl, false);
      this.hideMask();
      YAHOO.util.Dom.removeClass(this.cal.oDomContainer, a.NAV_VISIBLE);
      this.cal.hideNavEvent.fire();
    }
  },
  showMask: function () {
    this._show(this.maskEl, true);
    if (this.__isIEQuirks) {
      this._syncMask();
    }
  },
  hideMask: function () {
    this._show(this.maskEl, false);
  },
  getMonth: function () {
    return this._month;
  },
  getYear: function () {
    return this._year;
  },
  setMonth: function (a) {
    if (a >= 0 && a < 12) {
      this._month = a;
    }
    this._updateMonthUI();
  },
  setYear: function (b) {
    var a = YAHOO.widget.CalendarNavigator.YR_PATTERN;
    if (YAHOO.lang.isNumber(b) && a.test(b + '')) {
      this._year = b;
    }
    this._updateYearUI();
  },
  render: function () {
    this.cal.beforeRenderNavEvent.fire();
    if (!this.__rendered) {
      this.createNav();
      this.createMask();
      this.applyListeners();
      this.__rendered = true;
    }
    this.cal.renderNavEvent.fire();
  },
  createNav: function () {
    var b = YAHOO.widget.CalendarNavigator;
    var c = this._doc;
    var e = c.createElement('div');
    e.className = b.CLASSES.NAV;
    var a = this.renderNavContents([]);
    e.innerHTML = a.join('');
    this.cal.oDomContainer.appendChild(e);
    this.navEl = e;
    this.yearEl = c.getElementById(this.id + b.YEAR_SUFFIX);
    this.monthEl = c.getElementById(this.id + b.MONTH_SUFFIX);
    this.errorEl = c.getElementById(this.id + b.ERROR_SUFFIX);
    this.submitEl = c.getElementById(this.id + b.SUBMIT_SUFFIX);
    this.cancelEl = c.getElementById(this.id + b.CANCEL_SUFFIX);
    if (YAHOO.env.ua.gecko && this.yearEl && this.yearEl.type == 'text') {
      this.yearEl.setAttribute('autocomplete', 'off');
    }
    this._setFirstLastElements();
  },
  createMask: function () {
    var b = YAHOO.widget.CalendarNavigator.CLASSES;
    var a = this._doc.createElement('div');
    a.className = b.MASK;
    this.cal.oDomContainer.appendChild(a);
    this.maskEl = a;
  },
  _syncMask: function () {
    var b = this.cal.oDomContainer;
    if (b && this.maskEl) {
      var a = YAHOO.util.Dom.getRegion(b);
      YAHOO.util.Dom.setStyle(this.maskEl, 'width', a.right - a.left + 'px');
      YAHOO.util.Dom.setStyle(this.maskEl, 'height', a.bottom - a.top + 'px');
    }
  },
  renderNavContents: function (a) {
    var c = YAHOO.widget.CalendarNavigator,
      d = c.CLASSES,
      b = a;
    b[b.length] = '<div class="' + d.MONTH + '">';
    this.renderMonth(b);
    b[b.length] = '</div>';
    b[b.length] = '<div class="' + d.YEAR + '">';
    this.renderYear(b);
    b[b.length] = '</div>';
    b[b.length] = '<div class="' + d.BUTTONS + '">';
    this.renderButtons(b);
    b[b.length] = '</div>';
    b[b.length] = '<div class="' + d.ERROR + '" id="' + this.id + c.ERROR_SUFFIX + '"></div>';
    return b;
  },
  renderMonth: function (c) {
    var f = YAHOO.widget.CalendarNavigator,
      g = f.CLASSES;
    var j = this.id + f.MONTH_SUFFIX,
      e = this.__getCfg('monthFormat'),
      a = this.cal.cfg.getProperty(
        e == YAHOO.widget.Calendar.SHORT ? 'MONTHS_SHORT' : 'MONTHS_LONG'
      ),
      d = c;
    if (a && a.length > 0) {
      d[d.length] = '<label for="' + j + '">';
      d[d.length] = this.__getCfg('month', true);
      d[d.length] = '</label>';
      d[d.length] = '<select name="' + j + '" id="' + j + '" class="' + g.MONTH_CTRL + '">';
      for (var b = 0; b < a.length; b++) {
        d[d.length] = '<option value="' + b + '">';
        d[d.length] = a[b];
        d[d.length] = '</option>';
      }
      d[d.length] = '</select>';
    }
    return d;
  },
  renderYear: function (b) {
    var d = YAHOO.widget.CalendarNavigator,
      e = d.CLASSES;
    var f = this.id + d.YEAR_SUFFIX,
      a = d.YR_MAX_DIGITS,
      c = b;
    c[c.length] = '<label for="' + f + '">';
    c[c.length] = this.__getCfg('year', true);
    c[c.length] = '</label>';
    c[c.length] =
      '<input type="text" name="' +
      f +
      '" id="' +
      f +
      '" class="' +
      e.YEAR_CTRL +
      '" maxlength="' +
      a +
      '"/>';
    return c;
  },
  renderButtons: function (a) {
    var c = YAHOO.widget.CalendarNavigator.CLASSES;
    var b = a;
    b[b.length] = '<span class="' + c.BUTTON + ' ' + c.DEFAULT + '">';
    b[b.length] = '<button type="button" id="' + this.id + '_submit' + '">';
    b[b.length] = this.__getCfg('submit', true);
    b[b.length] = '</button>';
    b[b.length] = '</span>';
    b[b.length] = '<span class="' + c.BUTTON + '">';
    b[b.length] = '<button type="button" id="' + this.id + '_cancel' + '">';
    b[b.length] = this.__getCfg('cancel', true);
    b[b.length] = '</button>';
    b[b.length] = '</span>';
    return b;
  },
  applyListeners: function () {
    var b = YAHOO.util.Event;
    function a() {
      if (this.validate()) {
        this.setYear(this._getYearFromUI());
      }
    }
    function c() {
      this.setMonth(this._getMonthFromUI());
    }
    b.on(this.submitEl, 'click', this.submit, this, true);
    b.on(this.cancelEl, 'click', this.cancel, this, true);
    b.on(this.yearEl, 'blur', a, this, true);
    b.on(this.monthEl, 'change', c, this, true);
    if (this.__isIEQuirks) {
      YAHOO.util.Event.on(this.cal.oDomContainer, 'resize', this._syncMask, this, true);
    }
    this.applyKeyListeners();
  },
  purgeListeners: function () {
    var a = YAHOO.util.Event;
    a.removeListener(this.submitEl, 'click', this.submit);
    a.removeListener(this.cancelEl, 'click', this.cancel);
    a.removeListener(this.yearEl, 'blur');
    a.removeListener(this.monthEl, 'change');
    if (this.__isIEQuirks) {
      a.removeListener(this.cal.oDomContainer, 'resize', this._syncMask);
    }
    this.purgeKeyListeners();
  },
  applyKeyListeners: function () {
    var d = YAHOO.util.Event,
      a = YAHOO.env.ua;
    var c = a.ie || a.webkit ? 'keydown' : 'keypress';
    var b = a.ie || a.opera || a.webkit ? 'keydown' : 'keypress';
    d.on(this.yearEl, 'keypress', this._handleEnterKey, this, true);
    d.on(this.yearEl, c, this._handleDirectionKeys, this, true);
    d.on(this.lastCtrl, b, this._handleTabKey, this, true);
    d.on(this.firstCtrl, b, this._handleShiftTabKey, this, true);
  },
  purgeKeyListeners: function () {
    var d = YAHOO.util.Event,
      a = YAHOO.env.ua;
    var c = a.ie || a.webkit ? 'keydown' : 'keypress';
    var b = a.ie || a.opera || a.webkit ? 'keydown' : 'keypress';
    d.removeListener(this.yearEl, 'keypress', this._handleEnterKey);
    d.removeListener(this.yearEl, c, this._handleDirectionKeys);
    d.removeListener(this.lastCtrl, b, this._handleTabKey);
    d.removeListener(this.firstCtrl, b, this._handleShiftTabKey);
  },
  submit: function () {
    if (this.validate()) {
      this.hide();
      this.setMonth(this._getMonthFromUI());
      this.setYear(this._getYearFromUI());
      var b = this.cal;
      var a = YAHOO.widget.CalendarNavigator.UPDATE_DELAY;
      if (a > 0) {
        var c = this;
        window.setTimeout(function () {
          c._update(b);
        }, a);
      } else {
        this._update(b);
      }
    }
  },
  _update: function (b) {
    var a = YAHOO.widget.DateMath.getDate(
      this.getYear() - b.cfg.getProperty('YEAR_OFFSET'),
      this.getMonth(),
      1
    );
    b.cfg.setProperty('pagedate', a);
    b.render();
  },
  cancel: function () {
    this.hide();
  },
  validate: function () {
    if (this._getYearFromUI() !== null) {
      this.clearErrors();
      return true;
    } else {
      this.setYearError();
      this.setError(this.__getCfg('invalidYear', true));
      return false;
    }
  },
  setError: function (a) {
    if (this.errorEl) {
      this.errorEl.innerHTML = a;
      this._show(this.errorEl, true);
    }
  },
  clearError: function () {
    if (this.errorEl) {
      this.errorEl.innerHTML = '';
      this._show(this.errorEl, false);
    }
  },
  setYearError: function () {
    YAHOO.util.Dom.addClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID);
  },
  clearYearError: function () {
    YAHOO.util.Dom.removeClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID);
  },
  clearErrors: function () {
    this.clearError();
    this.clearYearError();
  },
  setInitialFocus: function () {
    var a = this.submitEl,
      c = this.__getCfg('initialFocus');
    if (c && c.toLowerCase) {
      c = c.toLowerCase();
      if (c == 'year') {
        a = this.yearEl;
        try {
          this.yearEl.select();
        } catch (b) {}
      } else {
        if (c == 'month') {
          a = this.monthEl;
        }
      }
    }
    if (a && YAHOO.lang.isFunction(a.focus)) {
      try {
        a.focus();
      } catch (d) {}
    }
  },
  erase: function () {
    if (this.__rendered) {
      this.purgeListeners();
      this.yearEl = null;
      this.monthEl = null;
      this.errorEl = null;
      this.submitEl = null;
      this.cancelEl = null;
      this.firstCtrl = null;
      this.lastCtrl = null;
      if (this.navEl) {
        this.navEl.innerHTML = '';
      }
      var b = this.navEl.parentNode;
      if (b) {
        b.removeChild(this.navEl);
      }
      this.navEl = null;
      var a = this.maskEl.parentNode;
      if (a) {
        a.removeChild(this.maskEl);
      }
      this.maskEl = null;
      this.__rendered = false;
    }
  },
  destroy: function () {
    this.erase();
    this._doc = null;
    this.cal = null;
    this.id = null;
  },
  _show: function (b, a) {
    if (b) {
      YAHOO.util.Dom.setStyle(b, 'display', a ? 'block' : 'none');
    }
  },
  _getMonthFromUI: function () {
    if (this.monthEl) {
      return this.monthEl.selectedIndex;
    } else {
      return 0;
    }
  },
  _getYearFromUI: function () {
    var b = YAHOO.widget.CalendarNavigator;
    var a = null;
    if (this.yearEl) {
      var c = this.yearEl.value;
      c = c.replace(b.TRIM, '$1');
      if (b.YR_PATTERN.test(c)) {
        a = parseInt(c, 10);
      }
    }
    return a;
  },
  _updateYearUI: function () {
    if (this.yearEl && this._year !== null) {
      this.yearEl.value = this._year;
    }
  },
  _updateMonthUI: function () {
    if (this.monthEl) {
      this.monthEl.selectedIndex = this._month;
    }
  },
  _setFirstLastElements: function () {
    this.firstCtrl = this.monthEl;
    this.lastCtrl = this.cancelEl;
    if (this.__isMac) {
      if (YAHOO.env.ua.webkit && YAHOO.env.ua.webkit < 420) {
        this.firstCtrl = this.monthEl;
        this.lastCtrl = this.yearEl;
      }
      if (YAHOO.env.ua.gecko) {
        this.firstCtrl = this.yearEl;
        this.lastCtrl = this.yearEl;
      }
    }
  },
  _handleEnterKey: function (b) {
    var a = YAHOO.util.KeyListener.KEY;
    if (YAHOO.util.Event.getCharCode(b) == a.ENTER) {
      YAHOO.util.Event.preventDefault(b);
      this.submit();
    }
  },
  _handleDirectionKeys: function (h) {
    var g = YAHOO.util.Event,
      a = YAHOO.util.KeyListener.KEY,
      d = YAHOO.widget.CalendarNavigator;
    var f = this.yearEl.value ? parseInt(this.yearEl.value, 10) : null;
    if (isFinite(f)) {
      var b = false;
      switch (g.getCharCode(h)) {
        case a.UP:
          this.yearEl.value = f + d.YR_MINOR_INC;
          b = true;
          break;
        case a.DOWN:
          this.yearEl.value = Math.max(f - d.YR_MINOR_INC, 0);
          b = true;
          break;
        case a.PAGE_UP:
          this.yearEl.value = f + d.YR_MAJOR_INC;
          b = true;
          break;
        case a.PAGE_DOWN:
          this.yearEl.value = Math.max(f - d.YR_MAJOR_INC, 0);
          b = true;
          break;
        default:
          break;
      }
      if (b) {
        g.preventDefault(h);
        try {
          this.yearEl.select();
        } catch (c) {}
      }
    }
  },
  _handleTabKey: function (d) {
    var c = YAHOO.util.Event,
      a = YAHOO.util.KeyListener.KEY;
    if (c.getCharCode(d) == a.TAB && !d.shiftKey) {
      try {
        c.preventDefault(d);
        this.firstCtrl.focus();
      } catch (b) {}
    }
  },
  _handleShiftTabKey: function (d) {
    var c = YAHOO.util.Event,
      a = YAHOO.util.KeyListener.KEY;
    if (d.shiftKey && c.getCharCode(d) == a.TAB) {
      try {
        c.preventDefault(d);
        this.lastCtrl.focus();
      } catch (b) {}
    }
  },
  __getCfg: function (d, b) {
    var c = YAHOO.widget.CalendarNavigator.DEFAULT_CONFIG;
    var a = this.cal.cfg.getProperty('navigator');
    if (b) {
      return a !== true && a.strings && a.strings[d] ? a.strings[d] : c.strings[d];
    } else {
      return a !== true && a[d] ? a[d] : c[d];
    }
  },
  __isMac: navigator.userAgent.toLowerCase().indexOf('macintosh') != -1,
};
YAHOO.register('calendar', YAHOO.widget.Calendar, { version: '@VERSION@', build: '@BUILD@' });
