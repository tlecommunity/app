YAHOO.widget.LogMsg = function (a) {
  this.msg = this.time = this.category = this.source = this.sourceDetail = null;
  if (a && a.constructor == Object) {
    for (var b in a) {
      if (a.hasOwnProperty(b)) {
        this[b] = a[b];
      }
    }
  }
};
YAHOO.widget.LogWriter = function (a) {
  if (!a) {
    YAHOO.log('Could not instantiate LogWriter due to invalid source.', 'error', 'LogWriter');
    return;
  }
  this._source = a;
};
YAHOO.widget.LogWriter.prototype.toString = function () {
  return 'LogWriter ' + this._sSource;
};
YAHOO.widget.LogWriter.prototype.log = function (a, b) {
  YAHOO.widget.Logger.log(a, b, this._source);
};
YAHOO.widget.LogWriter.prototype.getSource = function () {
  return this._source;
};
YAHOO.widget.LogWriter.prototype.setSource = function (a) {
  if (!a) {
    YAHOO.log('Could not set source due to invalid source.', 'error', this.toString());
    return;
  } else {
    this._source = a;
  }
};
YAHOO.widget.LogWriter.prototype._source = null;
if (!YAHOO.widget.Logger) {
  YAHOO.widget.Logger = {
    loggerEnabled: true,
    _browserConsoleEnabled: false,
    categories: ['info', 'warn', 'error', 'time', 'window'],
    sources: ['global'],
    _stack: [],
    maxStackEntries: 2500,
    _startTime: new Date().getTime(),
    _lastTime: null,
    _windowErrorsHandled: false,
    _origOnWindowError: null,
  };
  YAHOO.widget.Logger.log = function (b, f, g) {
    if (this.loggerEnabled) {
      if (!f) {
        f = 'info';
      } else {
        f = f.toLocaleLowerCase();
        if (this._isNewCategory(f)) {
          this._createNewCategory(f);
        }
      }
      var c = 'global';
      var a = null;
      if (g) {
        var d = g.indexOf(' ');
        if (d > 0) {
          c = g.substring(0, d);
          a = g.substring(d, g.length);
        } else {
          c = g;
        }
        if (this._isNewSource(c)) {
          this._createNewSource(c);
        }
      }
      var h = new Date();
      var j = new YAHOO.widget.LogMsg({ msg: b, time: h, category: f, source: c, sourceDetail: a });
      var i = this._stack;
      var e = this.maxStackEntries;
      if (e && !isNaN(e) && i.length >= e) {
        i.shift();
      }
      i.push(j);
      this.newLogEvent.fire(j);
      if (this._browserConsoleEnabled) {
        this._printToBrowserConsole(j);
      }
      return true;
    } else {
      return false;
    }
  };
  YAHOO.widget.Logger.reset = function () {
    this._stack = [];
    this._startTime = new Date().getTime();
    this.loggerEnabled = true;
    this.log('Logger reset');
    this.logResetEvent.fire();
  };
  YAHOO.widget.Logger.getStack = function () {
    return this._stack;
  };
  YAHOO.widget.Logger.getStartTime = function () {
    return this._startTime;
  };
  YAHOO.widget.Logger.disableBrowserConsole = function () {
    YAHOO.log('Logger output to the function console.log() has been disabled.');
    this._browserConsoleEnabled = false;
  };
  YAHOO.widget.Logger.enableBrowserConsole = function () {
    this._browserConsoleEnabled = true;
    YAHOO.log('Logger output to the function console.log() has been enabled.');
  };
  YAHOO.widget.Logger.handleWindowErrors = function () {
    if (!YAHOO.widget.Logger._windowErrorsHandled) {
      if (window.error) {
        YAHOO.widget.Logger._origOnWindowError = window.onerror;
      }
      window.onerror = YAHOO.widget.Logger._onWindowError;
      YAHOO.widget.Logger._windowErrorsHandled = true;
      YAHOO.log('Logger handling of window.onerror has been enabled.');
    } else {
      YAHOO.log('Logger handling of window.onerror had already been enabled.');
    }
  };
  YAHOO.widget.Logger.unhandleWindowErrors = function () {
    if (YAHOO.widget.Logger._windowErrorsHandled) {
      if (YAHOO.widget.Logger._origOnWindowError) {
        window.onerror = YAHOO.widget.Logger._origOnWindowError;
        YAHOO.widget.Logger._origOnWindowError = null;
      } else {
        window.onerror = null;
      }
      YAHOO.widget.Logger._windowErrorsHandled = false;
      YAHOO.log('Logger handling of window.onerror has been disabled.');
    } else {
      YAHOO.log('Logger handling of window.onerror had already been disabled.');
    }
  };
  YAHOO.widget.Logger.categoryCreateEvent = new YAHOO.util.CustomEvent(
    'categoryCreate',
    this,
    true
  );
  YAHOO.widget.Logger.sourceCreateEvent = new YAHOO.util.CustomEvent('sourceCreate', this, true);
  YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent('newLog', this, true);
  YAHOO.widget.Logger.logResetEvent = new YAHOO.util.CustomEvent('logReset', this, true);
  YAHOO.widget.Logger._createNewCategory = function (a) {
    this.categories.push(a);
    this.categoryCreateEvent.fire(a);
  };
  YAHOO.widget.Logger._isNewCategory = function (b) {
    for (var a = 0; a < this.categories.length; a++) {
      if (b == this.categories[a]) {
        return false;
      }
    }
    return true;
  };
  YAHOO.widget.Logger._createNewSource = function (a) {
    this.sources.push(a);
    this.sourceCreateEvent.fire(a);
  };
  YAHOO.widget.Logger._isNewSource = function (a) {
    if (a) {
      for (var b = 0; b < this.sources.length; b++) {
        if (a == this.sources[b]) {
          return false;
        }
      }
      return true;
    }
  };
  YAHOO.widget.Logger._printToBrowserConsole = function (c) {
    if ((window.console && console.log) || (window.opera && opera.postError)) {
      var e = c.category;
      var d = c.category.substring(0, 4).toUpperCase();
      var g = c.time;
      var f;
      if (g.toLocaleTimeString) {
        f = g.toLocaleTimeString();
      } else {
        f = g.toString();
      }
      var h = g.getTime();
      var b = YAHOO.widget.Logger._lastTime ? h - YAHOO.widget.Logger._lastTime : 0;
      YAHOO.widget.Logger._lastTime = h;
      var a = f + ' (' + b + 'ms): ' + c.source + ': ';
      if (window.console) {
        console.log(a, c.msg);
      } else {
        opera.postError(a + c.msg);
      }
    }
  };
  YAHOO.widget.Logger._onWindowError = function (a, c, b) {
    try {
      YAHOO.widget.Logger.log(a + ' (' + c + ', line ' + b + ')', 'window');
      if (YAHOO.widget.Logger._origOnWindowError) {
        YAHOO.widget.Logger._origOnWindowError();
      }
    } catch (d) {
      return false;
    }
  };
  YAHOO.widget.Logger.log('Logger initialized');
}
(function () {
  var c = YAHOO.widget.Logger,
    e = YAHOO.util,
    f = e.Dom,
    a = e.Event,
    h = document;
  function b(i, d) {
    i = h.createElement(i);
    if (d) {
      for (var j in d) {
        if (d.hasOwnProperty(j)) {
          i[j] = d[j];
        }
      }
    }
    return i;
  }
  function g(i, d) {
    this._sName = g._index;
    g._index++;
    this._init.apply(this, arguments);
    if (this.autoRender !== false) {
      this.render();
    }
  }
  YAHOO.lang.augmentObject(g, {
    _index: 0,
    ENTRY_TEMPLATE: (function () {
      return b('pre', { className: 'yui-log-entry' });
    })(),
    VERBOSE_TEMPLATE:
      "<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}:</p><p>{sourceAndDetail}</p><p>{message}</p>",
    BASIC_TEMPLATE:
      "<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {message}</p>",
  });
  g.prototype = {
    logReaderEnabled: true,
    width: null,
    height: null,
    top: null,
    left: null,
    right: null,
    bottom: null,
    fontSize: null,
    footerEnabled: true,
    verboseOutput: true,
    entryFormat: null,
    newestOnTop: true,
    outputBuffer: 100,
    thresholdMax: 500,
    thresholdMin: 100,
    isCollapsed: false,
    isPaused: false,
    draggable: true,
    toString: function () {
      return 'LogReader instance' + this._sName;
    },
    pause: function () {
      this.isPaused = true;
      this._timeout = null;
      this.logReaderEnabled = false;
      if (this._btnPause) {
        this._btnPause.value = 'Resume';
      }
    },
    resume: function () {
      this.isPaused = false;
      this.logReaderEnabled = true;
      this._printBuffer();
      if (this._btnPause) {
        this._btnPause.value = 'Pause';
      }
    },
    render: function () {
      if (this.rendered) {
        return;
      }
      this._initContainerEl();
      this._initHeaderEl();
      this._initConsoleEl();
      this._initFooterEl();
      this._initCategories();
      this._initSources();
      this._initDragDrop();
      c.newLogEvent.subscribe(this._onNewLog, this);
      c.logResetEvent.subscribe(this._onReset, this);
      c.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
      c.sourceCreateEvent.subscribe(this._onSourceCreate, this);
      this.rendered = true;
      this._filterLogs();
    },
    destroy: function () {
      a.purgeElement(this._elContainer, true);
      this._elContainer.innerHTML = '';
      this._elContainer.parentNode.removeChild(this._elContainer);
      this.rendered = false;
    },
    hide: function () {
      this._elContainer.style.display = 'none';
    },
    show: function () {
      this._elContainer.style.display = 'block';
    },
    collapse: function () {
      this._elConsole.style.display = 'none';
      if (this._elFt) {
        this._elFt.style.display = 'none';
      }
      this._btnCollapse.value = 'Expand';
      this.isCollapsed = true;
    },
    expand: function () {
      this._elConsole.style.display = 'block';
      if (this._elFt) {
        this._elFt.style.display = 'block';
      }
      this._btnCollapse.value = 'Collapse';
      this.isCollapsed = false;
    },
    getCheckbox: function (d) {
      return this._filterCheckboxes[d];
    },
    getCategories: function () {
      return this._categoryFilters;
    },
    showCategory: function (j) {
      var l = this._categoryFilters;
      if (l.indexOf) {
        if (l.indexOf(j) > -1) {
          return;
        }
      } else {
        for (var d = 0; d < l.length; d++) {
          if (l[d] === j) {
            return;
          }
        }
      }
      this._categoryFilters.push(j);
      this._filterLogs();
      var k = this.getCheckbox(j);
      if (k) {
        k.checked = true;
      }
    },
    hideCategory: function (j) {
      var l = this._categoryFilters;
      for (var d = 0; d < l.length; d++) {
        if (j == l[d]) {
          l.splice(d, 1);
          break;
        }
      }
      this._filterLogs();
      var k = this.getCheckbox(j);
      if (k) {
        k.checked = false;
      }
    },
    getSources: function () {
      return this._sourceFilters;
    },
    showSource: function (d) {
      var l = this._sourceFilters;
      if (l.indexOf) {
        if (l.indexOf(d) > -1) {
          return;
        }
      } else {
        for (var j = 0; j < l.length; j++) {
          if (d == l[j]) {
            return;
          }
        }
      }
      l.push(d);
      this._filterLogs();
      var k = this.getCheckbox(d);
      if (k) {
        k.checked = true;
      }
    },
    hideSource: function (d) {
      var l = this._sourceFilters;
      for (var j = 0; j < l.length; j++) {
        if (d == l[j]) {
          l.splice(j, 1);
          break;
        }
      }
      this._filterLogs();
      var k = this.getCheckbox(d);
      if (k) {
        k.checked = false;
      }
    },
    clearConsole: function () {
      this._timeout = null;
      this._buffer = [];
      this._consoleMsgCount = 0;
      var d = this._elConsole;
      d.innerHTML = '';
    },
    setTitle: function (d) {
      this._title.innerHTML = this.html2Text(d);
    },
    getLastTime: function () {
      return this._lastTime;
    },
    formatMsg: function (i) {
      var d = this.entryFormat || (this.verboseOutput ? g.VERBOSE_TEMPLATE : g.BASIC_TEMPLATE),
        j = {
          category: i.category,
          label: i.category.substring(0, 4).toUpperCase(),
          sourceAndDetail: i.sourceDetail ? i.source + ' ' + i.sourceDetail : i.source,
          message: this.html2Text(i.msg || i.message || ''),
        };
      if (i.time && i.time.getTime) {
        j.localTime = i.time.toLocaleTimeString ? i.time.toLocaleTimeString() : i.time.toString();
        j.elapsedTime = i.time.getTime() - this.getLastTime();
        j.totalTime = i.time.getTime() - c.getStartTime();
      }
      var k = g.ENTRY_TEMPLATE.cloneNode(true);
      if (this.verboseOutput) {
        k.className += ' yui-log-verbose';
      }
      k.innerHTML = d.replace(/\{(\w+)\}/g, function (l, m) {
        return m in j ? j[m] : '';
      });
      return k;
    },
    html2Text: function (d) {
      if (d) {
        d += '';
        return d.replace(/&/g, '&#38;').replace(/</g, '&#60;').replace(/>/g, '&#62;');
      }
      return '';
    },
    _sName: null,
    _buffer: null,
    _consoleMsgCount: 0,
    _lastTime: null,
    _timeout: null,
    _filterCheckboxes: null,
    _categoryFilters: null,
    _sourceFilters: null,
    _elContainer: null,
    _elHd: null,
    _elCollapse: null,
    _btnCollapse: null,
    _title: null,
    _elConsole: null,
    _elFt: null,
    _elBtns: null,
    _elCategoryFilters: null,
    _elSourceFilters: null,
    _btnPause: null,
    _btnClear: null,
    _init: function (d, i) {
      this._buffer = [];
      this._filterCheckboxes = {};
      this._lastTime = c.getStartTime();
      if (i && i.constructor == Object) {
        for (var j in i) {
          if (i.hasOwnProperty(j)) {
            this[j] = i[j];
          }
        }
      }
      this._elContainer = f.get(d);
      YAHOO.log('LogReader initialized', null, this.toString());
    },
    _initContainerEl: function () {
      if (!this._elContainer || !/div$/i.test(this._elContainer.tagName)) {
        this._elContainer = h.body.insertBefore(b('div'), h.body.firstChild);
        f.addClass(this._elContainer, 'yui-log-container');
      }
      f.addClass(this._elContainer, 'yui-log');
      var k = this._elContainer.style,
        d = ['width', 'right', 'top', 'fontSize'],
        l,
        j;
      for (j = d.length - 1; j >= 0; --j) {
        l = d[j];
        if (this[l]) {
          k[l] = this[l];
        }
      }
      if (this.left) {
        k.left = this.left;
        k.right = 'auto';
      }
      if (this.bottom) {
        k.bottom = this.bottom;
        k.top = 'auto';
      }
      if (YAHOO.env.ua.opera) {
        h.body.style += '';
      }
    },
    _initHeaderEl: function () {
      if (this._elHd) {
        a.purgeElement(this._elHd, true);
        this._elHd.innerHTML = '';
      }
      this._elHd = b('div', { className: 'yui-log-hd' });
      f.generateId(this._elHd, 'yui-log-hd' + this._sName);
      this._elCollapse = b('div', { className: 'yui-log-btns' });
      this._btnCollapse = b('input', {
        type: 'button',
        className: 'yui-log-button',
        value: 'Collapse',
      });
      a.on(this._btnCollapse, 'click', this._onClickCollapseBtn, this);
      this._title = b('h4', { innerHTML: 'Logger Console' });
      this._elCollapse.appendChild(this._btnCollapse);
      this._elHd.appendChild(this._elCollapse);
      this._elHd.appendChild(this._title);
      this._elContainer.appendChild(this._elHd);
    },
    _initConsoleEl: function () {
      if (this._elConsole) {
        a.purgeElement(this._elConsole, true);
        this._elConsole.innerHTML = '';
      }
      this._elConsole = b('div', { className: 'yui-log-bd' });
      if (this.height) {
        this._elConsole.style.height = this.height;
      }
      this._elContainer.appendChild(this._elConsole);
    },
    _initFooterEl: function () {
      if (this.footerEnabled) {
        if (this._elFt) {
          a.purgeElement(this._elFt, true);
          this._elFt.innerHTML = '';
        }
        this._elFt = b('div', { className: 'yui-log-ft' });
        this._elBtns = b('div', { className: 'yui-log-btns' });
        this._btnPause = b('input', {
          type: 'button',
          className: 'yui-log-button',
          value: 'Pause',
        });
        a.on(this._btnPause, 'click', this._onClickPauseBtn, this);
        this._btnClear = b('input', {
          type: 'button',
          className: 'yui-log-button',
          value: 'Clear',
        });
        a.on(this._btnClear, 'click', this._onClickClearBtn, this);
        this._elCategoryFilters = b('div', { className: 'yui-log-categoryfilters' });
        this._elSourceFilters = b('div', { className: 'yui-log-sourcefilters' });
        this._elBtns.appendChild(this._btnPause);
        this._elBtns.appendChild(this._btnClear);
        this._elFt.appendChild(this._elBtns);
        this._elFt.appendChild(this._elCategoryFilters);
        this._elFt.appendChild(this._elSourceFilters);
        this._elContainer.appendChild(this._elFt);
      }
    },
    _initDragDrop: function () {
      if (e.DD && this.draggable && this._elHd) {
        var d = new e.DD(this._elContainer);
        d.setHandleElId(this._elHd.id);
        this._elHd.style.cursor = 'move';
      }
    },
    _initCategories: function () {
      this._categoryFilters = [];
      var k = c.categories;
      for (var d = 0; d < k.length; d++) {
        var i = k[d];
        this._categoryFilters.push(i);
        if (this._elCategoryFilters) {
          this._createCategoryCheckbox(i);
        }
      }
    },
    _initSources: function () {
      this._sourceFilters = [];
      var k = c.sources;
      for (var i = 0; i < k.length; i++) {
        var d = k[i];
        this._sourceFilters.push(d);
        if (this._elSourceFilters) {
          this._createSourceCheckbox(d);
        }
      }
    },
    _createCategoryCheckbox: function (l) {
      if (this._elFt) {
        var k = b('span', { className: 'yui-log-filtergrp' }),
          j = f.generateId(null, 'yui-log-filter-' + l + this._sName),
          d = b('input', {
            id: j,
            className: 'yui-log-filter-' + l,
            type: 'checkbox',
            category: l,
          }),
          i = b('label', { htmlFor: j, className: l, innerHTML: l });
        a.on(d, 'click', this._onCheckCategory, this);
        this._filterCheckboxes[l] = d;
        k.appendChild(d);
        k.appendChild(i);
        this._elCategoryFilters.appendChild(k);
        d.checked = true;
      }
    },
    _createSourceCheckbox: function (d) {
      if (this._elFt) {
        var l = b('span', { className: 'yui-log-filtergrp' }),
          k = f.generateId(null, 'yui-log-filter-' + d + this._sName),
          i = b('input', { id: k, className: 'yui-log-filter-' + d, type: 'checkbox', source: d }),
          j = b('label', { htmlFor: k, className: d, innerHTML: d });
        a.on(i, 'click', this._onCheckSource, this);
        this._filterCheckboxes[d] = i;
        l.appendChild(i);
        l.appendChild(j);
        this._elSourceFilters.appendChild(l);
        i.checked = true;
      }
    },
    _filterLogs: function () {
      if (this._elConsole !== null) {
        this.clearConsole();
        this._printToConsole(c.getStack());
      }
    },
    _printBuffer: function () {
      this._timeout = null;
      if (this._elConsole !== null) {
        var j = this.thresholdMax;
        j = j && !isNaN(j) ? j : 500;
        if (this._consoleMsgCount < j) {
          var d = [];
          for (var k = 0; k < this._buffer.length; k++) {
            d[k] = this._buffer[k];
          }
          this._buffer = [];
          this._printToConsole(d);
        } else {
          this._filterLogs();
        }
        if (!this.newestOnTop) {
          this._elConsole.scrollTop = this._elConsole.scrollHeight;
        }
      }
    },
    _printToConsole: function (r) {
      var k = r.length,
        v = h.createDocumentFragment(),
        y = [],
        z = this.thresholdMin,
        l = this._sourceFilters.length,
        w = this._categoryFilters.length,
        t,
        q,
        p,
        o,
        u;
      if (isNaN(z) || z > this.thresholdMax) {
        z = 0;
      }
      t = k > z ? k - z : 0;
      for (q = t; q < k; q++) {
        var n = false,
          s = false,
          x = r[q],
          d = x.source,
          m = x.category;
        for (p = 0; p < l; p++) {
          if (d == this._sourceFilters[p]) {
            s = true;
            break;
          }
        }
        if (s) {
          for (p = 0; p < w; p++) {
            if (m == this._categoryFilters[p]) {
              n = true;
              break;
            }
          }
        }
        if (n) {
          if (this._consoleMsgCount === 0) {
            this._lastTime = x.time.getTime();
          }
          o = this.formatMsg(x);
          if (typeof o === 'string') {
            y[y.length] = o;
          } else {
            v.insertBefore(o, this.newestOnTop ? v.firstChild || null : null);
          }
          this._consoleMsgCount++;
          this._lastTime = x.time.getTime();
        }
      }
      if (y.length) {
        y.splice(0, 0, this._elConsole.innerHTML);
        this._elConsole.innerHTML = this.newestOnTop ? y.reverse().join('') : y.join('');
      } else {
        if (v.firstChild) {
          this._elConsole.insertBefore(
            v,
            this.newestOnTop ? this._elConsole.firstChild || null : null
          );
        }
      }
    },
    _onCategoryCreate: function (k, j, d) {
      var i = j[0];
      d._categoryFilters.push(i);
      if (d._elFt) {
        d._createCategoryCheckbox(i);
      }
    },
    _onSourceCreate: function (k, j, d) {
      var i = j[0];
      d._sourceFilters.push(i);
      if (d._elFt) {
        d._createSourceCheckbox(i);
      }
    },
    _onCheckCategory: function (d, i) {
      var j = this.category;
      if (!this.checked) {
        i.hideCategory(j);
      } else {
        i.showCategory(j);
      }
    },
    _onCheckSource: function (d, i) {
      var j = this.source;
      if (!this.checked) {
        i.hideSource(j);
      } else {
        i.showSource(j);
      }
    },
    _onClickCollapseBtn: function (d, i) {
      if (!i.isCollapsed) {
        i.collapse();
      } else {
        i.expand();
      }
    },
    _onClickPauseBtn: function (d, i) {
      if (!i.isPaused) {
        i.pause();
      } else {
        i.resume();
      }
    },
    _onClickClearBtn: function (d, i) {
      i.clearConsole();
    },
    _onNewLog: function (k, j, d) {
      var i = j[0];
      d._buffer.push(i);
      if (d.logReaderEnabled === true && d._timeout === null) {
        d._timeout = setTimeout(function () {
          d._printBuffer();
        }, d.outputBuffer);
      }
    },
    _onReset: function (j, i, d) {
      d._filterLogs();
    },
  };
  YAHOO.widget.LogReader = g;
})();
YAHOO.register('logger', YAHOO.widget.Logger, { version: '@VERSION@', build: '@BUILD@' });
