YAHOO.widget.Chart = function (d, a, j, g) {
  this._type = d;
  this._dataSource = j;
  var f = {
    align: '',
    allowNetworking: '',
    allowScriptAccess: '',
    base: '',
    bgcolor: '',
    menu: '',
    name: '',
    quality: '',
    salign: '',
    scale: '',
    tabindex: '',
    wmode: '',
  };
  var b = {
    fixedAttributes: { allowScriptAccess: 'always' },
    flashVars: { allowedDomain: document.location.hostname },
    backgroundColor: '#ffffff',
    host: this,
    version: 9.045,
  };
  for (var c in g) {
    if (f.hasOwnProperty(c)) {
      b.fixedAttributes[c] = g[c];
    } else {
      b[c] = g[c];
    }
  }
  this._id = b.id = b.id || YAHOO.util.Dom.generateId(null, 'yuigen');
  this._swfURL = YAHOO.widget.Chart.SWFURL;
  this._containerID = a;
  this._attributes = b;
  this._swfEmbed = new YAHOO.widget.SWF(a, YAHOO.widget.Chart.SWFURL, b);
  this._swf = this._swfEmbed.swf;
  this._swfEmbed.subscribe('swfReady', this._eventHandler, this, true);
  try {
    this.createEvent('contentReady');
  } catch (h) {}
  this.createEvent('itemMouseOverEvent');
  this.createEvent('itemMouseOutEvent');
  this.createEvent('itemClickEvent');
  this.createEvent('itemDoubleClickEvent');
  this.createEvent('itemDragStartEvent');
  this.createEvent('itemDragEvent');
  this.createEvent('itemDragEndEvent');
};
YAHOO.extend(YAHOO.widget.Chart, YAHOO.util.AttributeProvider, {
  _type: null,
  _pollingID: null,
  _pollingInterval: null,
  _dataTipFunction: null,
  _legendLabelFunction: null,
  _seriesFunctions: null,
  toString: function () {
    return 'Chart ' + this._id;
  },
  setStyle: function (a, b) {
    b = YAHOO.lang.JSON.stringify(b);
    this._swf.setStyle(a, b);
  },
  setStyles: function (a) {
    a = YAHOO.lang.JSON.stringify(a);
    this._swf.setStyles(a);
  },
  setSeriesStyles: function (b) {
    for (var a = 0; a < b.length; a++) {
      b[a] = YAHOO.lang.JSON.stringify(b[a]);
    }
    this._swf.setSeriesStyles(b);
  },
  destroy: function () {
    if (this._dataSource !== null) {
      if (this._pollingID !== null) {
        this._dataSource.clearInterval(this._pollingID);
        this._pollingID = null;
      }
    }
    if (this._dataTipFunction) {
      YAHOO.widget.Chart.removeProxyFunction(this._dataTipFunction);
    }
    if (this._legendLabelFunction) {
      YAHOO.widget.Chart.removeProxyFunction(this._legendLabelFunction);
    }
    if (this._swf) {
      var b = YAHOO.util.Dom.get(this._containerID);
      b.removeChild(this._swf);
    }
    var a = this._id;
    for (var c in this) {
      if (YAHOO.lang.hasOwnProperty(this, c)) {
        this[c] = null;
      }
    }
  },
  _initAttributes: function (a) {
    this.setAttributeConfig('altText', { method: this._setAltText, getter: this._getAltText });
    this.setAttributeConfig('swfURL', { getter: this._getSWFURL });
    this.setAttributeConfig('request', { method: this._setRequest, getter: this._getRequest });
    this.setAttributeConfig('dataSource', {
      method: this._setDataSource,
      getter: this._getDataSource,
    });
    this.setAttributeConfig('series', { method: this._setSeriesDefs, getter: this._getSeriesDefs });
    this.setAttributeConfig('categoryNames', {
      validator: YAHOO.lang.isArray,
      method: this._setCategoryNames,
      getter: this._getCategoryNames,
    });
    this.setAttributeConfig('dataTipFunction', {
      method: this._setDataTipFunction,
      getter: this._getDataTipFunction,
    });
    this.setAttributeConfig('legendLabelFunction', {
      method: this._setLegendLabelFunction,
      getter: this._getLegendLabelFunction,
    });
    this.setAttributeConfig('polling', { method: this._setPolling, getter: this._getPolling });
  },
  _eventHandler: function (a) {
    if (a.type == 'swfReady') {
      this._swf = this._swfEmbed._swf;
      this._loadHandler();
      this.fireEvent('contentReady');
    }
  },
  _loadHandler: function () {
    if (!this._swf || !this._swf.setType) {
      return;
    }
    this._swf.setType(this._type);
    if (this._attributes.style) {
      var a = this._attributes.style;
      this.setStyles(a);
    }
    this._initialized = false;
    this._initAttributes(this._attributes);
    this.setAttributes(this._attributes, true);
    this._initialized = true;
    if (this._dataSource) {
      this.set('dataSource', this._dataSource);
    }
  },
  refreshData: function () {
    if (!this._initialized) {
      return;
    }
    if (this._dataSource !== null) {
      if (this._pollingID !== null) {
        this._dataSource.clearInterval(this._pollingID);
        this._pollingID = null;
      }
      if (this._pollingInterval > 0) {
        this._pollingID = this._dataSource.setInterval(
          this._pollingInterval,
          this._request,
          this._loadDataHandler,
          this
        );
      }
      this._dataSource.sendRequest(this._request, this._loadDataHandler, this);
    }
  },
  _loadDataHandler: function (d, c, m) {
    if (this._swf) {
      if (m) {
      } else {
        var j;
        if (this._seriesFunctions) {
          var k = this._seriesFunctions.length;
          for (j = 0; j < k; j++) {
            YAHOO.widget.Chart.removeProxyFunction(this._seriesFunctions[j]);
          }
          this._seriesFunctions = null;
        }
        this._seriesFunctions = [];
        var g = [];
        var f = 0;
        var n = null;
        if (this._seriesDefs !== null) {
          f = this._seriesDefs.length;
          for (j = 0; j < f; j++) {
            n = this._seriesDefs[j];
            var b = {};
            for (var a in n) {
              if (YAHOO.lang.hasOwnProperty(n, a)) {
                if (a == 'style') {
                  if (n.style !== null) {
                    b.style = YAHOO.lang.JSON.stringify(n.style);
                  }
                } else {
                  if (a == 'labelFunction') {
                    if (n.labelFunction !== null) {
                      b.labelFunction = YAHOO.widget.Chart.getFunctionReference(n.labelFunction);
                      this._seriesFunctions.push(b.labelFunction);
                    }
                  } else {
                    if (a == 'dataTipFunction') {
                      if (n.dataTipFunction !== null) {
                        b.dataTipFunction = YAHOO.widget.Chart.getFunctionReference(
                          n.dataTipFunction
                        );
                        this._seriesFunctions.push(b.dataTipFunction);
                      }
                    } else {
                      if (a == 'legendLabelFunction') {
                        if (n.legendLabelFunction !== null) {
                          b.legendLabelFunction = YAHOO.widget.Chart.getFunctionReference(
                            n.legendLabelFunction
                          );
                          this._seriesFunctions.push(b.legendLabelFunction);
                        }
                      } else {
                        b[a] = n[a];
                      }
                    }
                  }
                }
              }
            }
            g.push(b);
          }
        }
        if (f > 0) {
          for (j = 0; j < f; j++) {
            n = g[j];
            if (!n.type) {
              n.type = this._type;
            }
            n.dataProvider = c.results;
          }
        } else {
          var h = { type: this._type, dataProvider: c.results };
          g.push(h);
        }
        try {
          if (this._swf.setDataProvider) {
            this._swf.setDataProvider(g);
          }
        } catch (l) {
          this._swf.setDataProvider(g);
        }
      }
    }
  },
  _request: '',
  _getRequest: function () {
    return this._request;
  },
  _setRequest: function (a) {
    this._request = a;
    this.refreshData();
  },
  _dataSource: null,
  _getDataSource: function () {
    return this._dataSource;
  },
  _setDataSource: function (a) {
    this._dataSource = a;
    this.refreshData();
  },
  _seriesDefs: null,
  _getSeriesDefs: function () {
    return this._seriesDefs;
  },
  _setSeriesDefs: function (a) {
    this._seriesDefs = a;
    this.refreshData();
  },
  _getCategoryNames: function () {
    return this._swf.getCategoryNames();
  },
  _setCategoryNames: function (a) {
    this._swf.setCategoryNames(a);
  },
  _setDataTipFunction: function (a) {
    if (this._dataTipFunction) {
      YAHOO.widget.Chart.removeProxyFunction(this._dataTipFunction);
    }
    if (a) {
      this._dataTipFunction = a = YAHOO.widget.Chart.getFunctionReference(a);
    }
    this._swf.setDataTipFunction(a);
  },
  _setLegendLabelFunction: function (a) {
    if (this._legendLabelFunction) {
      YAHOO.widget.Chart.removeProxyFunction(this._legendLabelFunction);
    }
    if (a) {
      this._legendLabelFunction = a = YAHOO.widget.Chart.getFunctionReference(a);
    }
    this._swf.setLegendLabelFunction(a);
  },
  _getLegendLabelFunction: function () {
    return this._legendLabelFunction;
  },
  _getPolling: function () {
    return this._pollingInterval;
  },
  _setPolling: function (a) {
    this._pollingInterval = a;
    this.refreshData();
  },
  _swfEmbed: null,
  _swfURL: null,
  _containerID: null,
  _swf: null,
  _id: null,
  _initialized: false,
  _attributes: null,
  set: function (a, b) {
    this._attributes[a] = b;
    YAHOO.widget.Chart.superclass.set.call(this, a, b);
  },
  _getSWFURL: function () {
    return this._swfURL;
  },
  _getAltText: function () {
    return this._swf.getAltText();
  },
  _setAltText: function (a) {
    this._swf.setAltText(a);
  },
});
YAHOO.widget.Chart.proxyFunctionCount = 0;
YAHOO.widget.Chart.createProxyFunction = function (c, b) {
  var b = b || null;
  var a = YAHOO.widget.Chart.proxyFunctionCount;
  YAHOO.widget.Chart['proxyFunction' + a] = function () {
    return c.apply(b, arguments);
  };
  YAHOO.widget.Chart.proxyFunctionCount++;
  return 'YAHOO.widget.Chart.proxyFunction' + a.toString();
};
YAHOO.widget.Chart.getFunctionReference = function (b) {
  if (typeof b == 'function') {
    b = YAHOO.widget.Chart.createProxyFunction(b);
  } else {
    if (b.func && typeof b.func == 'function') {
      var a = [b.func];
      if (b.scope && typeof b.scope == 'object') {
        a.push(b.scope);
      }
      b = YAHOO.widget.Chart.createProxyFunction.apply(this, a);
    }
  }
  return b;
};
YAHOO.widget.Chart.removeProxyFunction = function (a) {
  if (!a || a.indexOf('YAHOO.widget.Chart.proxyFunction') < 0) {
    return;
  }
  a = a.substr(26);
  YAHOO.widget.Chart[a] = null;
};
YAHOO.widget.Chart.SWFURL = 'assets/charts.swf';
YAHOO.widget.PieChart = function (a, c, b) {
  YAHOO.widget.PieChart.superclass.constructor.call(this, 'pie', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.PieChart, YAHOO.widget.Chart, {
  _initAttributes: function (a) {
    YAHOO.widget.PieChart.superclass._initAttributes.call(this, a);
    this.setAttributeConfig('dataField', {
      validator: YAHOO.lang.isString,
      method: this._setDataField,
      getter: this._getDataField,
    });
    this.setAttributeConfig('categoryField', {
      validator: YAHOO.lang.isString,
      method: this._setCategoryField,
      getter: this._getCategoryField,
    });
  },
  _getDataField: function () {
    return this._swf.getDataField();
  },
  _setDataField: function (a) {
    this._swf.setDataField(a);
  },
  _getCategoryField: function () {
    return this._swf.getCategoryField();
  },
  _setCategoryField: function (a) {
    this._swf.setCategoryField(a);
  },
});
YAHOO.widget.CartesianChart = function (c, a, d, b) {
  YAHOO.widget.CartesianChart.superclass.constructor.call(this, c, a, d, b);
};
YAHOO.lang.extend(YAHOO.widget.CartesianChart, YAHOO.widget.Chart, {
  _xAxisLabelFunctions: [],
  _yAxisLabelFunctions: [],
  destroy: function () {
    this._removeAxisFunctions(this._xAxisLabelFunctions);
    this._removeAxisFunctions(this._yAxisLabelFunctions);
    YAHOO.widget.CartesianChart.superclass.destroy.call(this);
  },
  _initAttributes: function (a) {
    YAHOO.widget.CartesianChart.superclass._initAttributes.call(this, a);
    this.setAttributeConfig('xField', {
      validator: YAHOO.lang.isString,
      method: this._setXField,
      getter: this._getXField,
    });
    this.setAttributeConfig('yField', {
      validator: YAHOO.lang.isString,
      method: this._setYField,
      getter: this._getYField,
    });
    this.setAttributeConfig('xAxis', { method: this._setXAxis });
    this.setAttributeConfig('xAxes', { method: this._setXAxes });
    this.setAttributeConfig('yAxis', { method: this._setYAxis });
    this.setAttributeConfig('yAxes', { method: this._setYAxes });
    this.setAttributeConfig('constrainViewport', { method: this._setConstrainViewport });
  },
  _getXField: function () {
    return this._swf.getHorizontalField();
  },
  _setXField: function (a) {
    this._swf.setHorizontalField(a);
  },
  _getYField: function () {
    return this._swf.getVerticalField();
  },
  _setYField: function (a) {
    this._swf.setVerticalField(a);
  },
  _getClonedAxis: function (a) {
    var b = {};
    for (var c in a) {
      if (c == 'labelFunction') {
        if (a.labelFunction && a.labelFunction !== null) {
          b.labelFunction = YAHOO.widget.Chart.getFunctionReference(a.labelFunction);
        }
      } else {
        b[c] = a[c];
      }
    }
    return b;
  },
  _removeAxisFunctions: function (c) {
    if (c && c.length > 0) {
      var a = c.length;
      for (var b = 0; b < a; b++) {
        if (c[b] !== null) {
          YAHOO.widget.Chart.removeProxyFunction(c[b]);
        }
      }
      c = [];
    }
  },
  _setXAxis: function (a) {
    if (a.position != 'bottom' && a.position != 'top') {
      a.position = 'bottom';
    }
    this._removeAxisFunctions(this._xAxisLabelFunctions);
    a = this._getClonedAxis(a);
    this._xAxisLabelFunctions.push(a.labelFunction);
    this._swf.setHorizontalAxis(a);
  },
  _setXAxes: function (c) {
    this._removeAxisFunctions(this._xAxisLabelFunctions);
    var a = c.length;
    for (var b = 0; b < a; b++) {
      if (c[b].position == 'left') {
        c[b].position = 'bottom';
      }
      c[b] = this._getClonedAxis(c[b]);
      if (c[b].labelFunction) {
        this._xAxisLabelFunctions.push(c[b].labelFunction);
      }
      this._swf.setHorizontalAxis(c[b]);
    }
  },
  _setYAxis: function (a) {
    this._removeAxisFunctions(this._yAxisLabelFunctions);
    a = this._getClonedAxis(a);
    this._yAxisLabelFunctions.push(a.labelFunction);
    this._swf.setVerticalAxis(a);
  },
  _setYAxes: function (c) {
    this._removeAxisFunctions(this._yAxisLabelFunctions);
    var a = c.length;
    for (var b = 0; b < a; b++) {
      c[b] = this._getClonedAxis(c[b]);
      if (c[b].labelFunction) {
        this._yAxisLabelFunctions.push(c[b].labelFunction);
      }
      this._swf.setVerticalAxis(c[b]);
    }
  },
  _setConstrainViewport: function (a) {
    this._swf.setConstrainViewport(a);
  },
  setSeriesStylesByIndex: function (a, b) {
    b = YAHOO.lang.JSON.stringify(b);
    if (this._swf && this._swf.setSeriesStylesByIndex) {
      this._swf.setSeriesStylesByIndex(a, b);
    }
  },
});
YAHOO.widget.LineChart = function (a, c, b) {
  YAHOO.widget.LineChart.superclass.constructor.call(this, 'line', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.LineChart, YAHOO.widget.CartesianChart);
YAHOO.widget.ColumnChart = function (a, c, b) {
  YAHOO.widget.ColumnChart.superclass.constructor.call(this, 'column', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.ColumnChart, YAHOO.widget.CartesianChart);
YAHOO.widget.BarChart = function (a, c, b) {
  YAHOO.widget.BarChart.superclass.constructor.call(this, 'bar', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.BarChart, YAHOO.widget.CartesianChart);
YAHOO.widget.StackedColumnChart = function (a, c, b) {
  YAHOO.widget.StackedColumnChart.superclass.constructor.call(this, 'stackcolumn', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.StackedColumnChart, YAHOO.widget.CartesianChart);
YAHOO.widget.StackedBarChart = function (a, c, b) {
  YAHOO.widget.StackedBarChart.superclass.constructor.call(this, 'stackbar', a, c, b);
};
YAHOO.lang.extend(YAHOO.widget.StackedBarChart, YAHOO.widget.CartesianChart);
YAHOO.widget.Axis = function () {};
YAHOO.widget.Axis.prototype = {
  type: null,
  reverse: false,
  labelFunction: null,
  labelSpacing: 2,
  title: null,
};
YAHOO.widget.NumericAxis = function () {
  YAHOO.widget.NumericAxis.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.NumericAxis, YAHOO.widget.Axis, {
  type: 'numeric',
  minimum: NaN,
  maximum: NaN,
  majorUnit: NaN,
  minorUnit: NaN,
  snapToUnits: true,
  stackingEnabled: false,
  alwaysShowZero: true,
  scale: 'linear',
  roundMajorUnit: true,
  calculateByLabelSize: true,
  position: 'left',
  adjustMaximumByMajorUnit: true,
  adjustMinimumByMajorUnit: true,
});
YAHOO.widget.TimeAxis = function () {
  YAHOO.widget.TimeAxis.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.TimeAxis, YAHOO.widget.Axis, {
  type: 'time',
  minimum: null,
  maximum: null,
  majorUnit: NaN,
  majorTimeUnit: null,
  minorUnit: NaN,
  minorTimeUnit: null,
  snapToUnits: true,
  stackingEnabled: false,
  calculateByLabelSize: true,
});
YAHOO.widget.CategoryAxis = function () {
  YAHOO.widget.CategoryAxis.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.CategoryAxis, YAHOO.widget.Axis, {
  type: 'category',
  categoryNames: null,
  calculateCategoryCount: false,
});
YAHOO.widget.Series = function () {};
YAHOO.widget.Series.prototype = { type: null, displayName: null };
YAHOO.widget.CartesianSeries = function () {
  YAHOO.widget.CartesianSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.CartesianSeries, YAHOO.widget.Series, {
  xField: null,
  yField: null,
  axis: 'primary',
  showInLegend: true,
});
YAHOO.widget.ColumnSeries = function () {
  YAHOO.widget.ColumnSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.ColumnSeries, YAHOO.widget.CartesianSeries, { type: 'column' });
YAHOO.widget.LineSeries = function () {
  YAHOO.widget.LineSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.LineSeries, YAHOO.widget.CartesianSeries, { type: 'line' });
YAHOO.widget.BarSeries = function () {
  YAHOO.widget.BarSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.BarSeries, YAHOO.widget.CartesianSeries, { type: 'bar' });
YAHOO.widget.PieSeries = function () {
  YAHOO.widget.PieSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.PieSeries, YAHOO.widget.Series, {
  type: 'pie',
  dataField: null,
  categoryField: null,
  labelFunction: null,
});
YAHOO.widget.StackedBarSeries = function () {
  YAHOO.widget.StackedBarSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.StackedBarSeries, YAHOO.widget.CartesianSeries, {
  type: 'stackbar',
});
YAHOO.widget.StackedColumnSeries = function () {
  YAHOO.widget.StackedColumnSeries.superclass.constructor.call(this);
};
YAHOO.lang.extend(YAHOO.widget.StackedColumnSeries, YAHOO.widget.CartesianSeries, {
  type: 'stackcolumn',
});
YAHOO.register('charts', YAHOO.widget.Chart, { version: '@VERSION@', build: '@BUILD@' });
