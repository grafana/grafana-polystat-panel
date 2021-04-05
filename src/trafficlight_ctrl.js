import {MetricsPanelCtrl} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series';

import './css/trafficlight-panel.css!';
import { stringToJsRegex } from '@grafana/data';

const panelDefaults = {
  bgColor: null
  ,trafficLightSettings:
  {
    lightsPerLine:5,
    width:20,
    invertScale:false,
    showValue:true,
    showTrend:true,
    redThreshold:20,
    greenThreshold:80,
    max:100,
    fontSize:'12px',
    fontColor: 'black',
    units:'',
    digits:1,
    spreadControls:false,
    sortLights:false,
    renderLink:false,
    linkUrl: "",
    linkTooltip: "",
    linkTargetBlank:false
  }
};



export class TrafficLightCtrl extends MetricsPanelCtrl {
  constructor($scope, $injector, templateSrv) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, panelDefaults);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));

    this.percentPerLight=100;

    this.data=[]
    this.templateSrv = templateSrv
    this.updateTraffics();
  }



  onDataError() {
    this.series = [];
    this.render();
  }

  onRender() {
    //this.data = this.parseSeries(this.series);
    this.applyRegex();
  }
  applyRegex(){
    let seriesList = this.series;
    if (seriesList && seriesList.length > 0) {
      for (let i = 0; i < seriesList.length; i++) {
        if (this.panel.trafficLightSettings.regexPattern !== '' && this.panel.trafficLightSettings.regexPattern !== undefined) {
          const regexVal = stringToJsRegex(this.panel.trafficLightSettings.regexPattern);
          if (seriesList[i].id && regexVal.test(seriesList[i].id.toString())) {
            const temp = regexVal.exec(seriesList[i].id.toString());
            if (!temp) {
              continue;
            }
            let extractedtxt = '';
            if (temp.length > 1) {
              temp.slice(1).forEach((value, i) => {
                if (value) {
                  extractedtxt += extractedtxt.length > 0 ? ' ' + value.toString() : value.toString();
                }
              });
              this.data[i].name = extractedtxt;
            }
          }
          else {
            this.data[i].name = seriesList[i].id;
            seriesList[i].label = seriesList[i].id;
  
          }
        }
        else {
          this.data[i].name = seriesList[i].id;
          seriesList[i].label = seriesList[i].id;

        }
      }
    }
  }



  onDataReceived(dataList) {
    var newseries=[]

    try
    {
      this.series = dataList.map(this.seriesHandler.bind(this));



      for(var i =0;i<this.series.length;i++)
      {
        var newserie={
          "name":this.series[i].label,
          "value":this.series[i].datapoints.slice(-1)[0][0]
        }

        if(this.series[i].datapoints.length>1)
        {
          newserie.trend=newserie.value-this.series[i].datapoints.slice(-2)[0][0]

          if(newserie.trend>0)
            if(this.panel.trafficLightSettings.invertScale)
              newserie.trendClass='traffic-light-trend-bad'
            else
              newserie.trendClass='traffic-light-trend-good'
          else if(newserie.trend<0)
            if(this.panel.trafficLightSettings.invertScale)
              newserie.trendClass='traffic-light-trend-good'
            else
              newserie.trendClass='traffic-light-trend-bad'
          else
            newserie.trendClass='traffic-light-trend-neutral'
        }
        newseries.push(newserie);
      }

    }
    catch(e)
    {
      // This is not a time serie
      this.series=[];
      for(var i=0;i<dataList[0].rows.length;i++)
      {
        var newserie={
          "name":dataList[0].rows[i][0],
          "value":dataList[0].rows[i][1]
        }
        newseries.push(newserie);
      }
    }

  //    console.log(newseries)

    if(this.panel.trafficLightSettings.sortLights)
    {
      this.data=_.sortBy(newseries, [function(o) { return o.name.replace(":","").replace(" ","").replace("}","").replace("{","") }]);
    }
    else
    {
      if(this.panel.trafficLightSettings.invertScale)
        this.data=_.orderBy(newseries, 'value','desc');
      else
        this.data=_.orderBy(newseries, 'value','asc');
    }   
    this.applyRegex(); 
  }

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });
    return series;
  }

  onInitEditMode() {

    this.addEditorTab('Options', 'public/plugins/snuids-trafficlights-panel/editor.html', 2);
  }

  onPanelTeardown() {
    this.$timeout.cancel(this.nextTickPromise);
  }

  renderLink(link, scopedVars, format){
    var scoped = {}
    for (var key in scopedVars) {
        scoped[key] = { value: scopedVars[key] }
    }
    if (format) {
        return this.templateSrv.replace(link, scoped, format)
    } else {
        return this.templateSrv.replace(link, scoped)
    }
  }

  updateTraffics() {

    var trafficsperline=this.panel.trafficLightSettings.lightsPerLine;

    if(this.panel.trafficLightSettings.spreadControls)
    {
      trafficsperline=this.data.length;
      if(this.data.length==0)
        trafficsperline=1;
      this.percentPerLight=100/trafficsperline;
    }
    else
      this.percentPerLight=100/trafficsperline;

    this.lines=[];
    var metrics=[];
    for(var i=0;i<this.data.length;i++)
    {
      if((i%trafficsperline)==0)
			{
				metrics=[];
				this.lines.push(metrics);
      }
      metrics.push(this.data[i]);
    }
    this.nextTickPromise = this.$timeout(this.updateTraffics.bind(this), 1000);
  }

  link(scope, elem, attrs, ctrl) {
    this.events.on('render', () => {
      const $panelContainer = elem.find('.panel-container');

      if (this.panel.bgColor) {
        $panelContainer.css('background-color', this.panel.bgColor);
      } else {
        $panelContainer.css('background-color', '');
      }
      setTimeout(() => ctrl.renderingCompleted(), 1250);
    });
  }
}

TrafficLightCtrl.templateUrl = 'module.html';
