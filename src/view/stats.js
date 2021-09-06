import AbstractView from './abstract';
import {getDateDiff, getHumanizeEventDuration} from '../utils/date-format';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;


const createChartTemplate = (moneyCtx, {title, labels, data, formatter}) => (
  new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  }));


const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);


export default class Stats extends AbstractView {
  constructor(points) {
    super();

    this._chart = {};

    this._data = Stats.parsePointsToData(points);

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    this._clearCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _setCharts() {
    this._clearCharts();

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._chart.moneyChart = this._renderChart(moneyCtx, this._data.money);
    this._chart.typeChart = this._renderChart(typeCtx, this._data.type);
    this._chart.timeSpendChart = this._renderChart(timeCtx, this._data.timeSpend);
  }

  _renderChart(container, data) {
    container.height = BAR_HEIGHT * data.labels.length;
    createChartTemplate(container, data);
  }

  _clearCharts() {
    for (let chart of Object.values(this._chart)) {
      if (chart !== null) {
        chart = null;
      }
    }
  }

  static parsePointsToData(points) {
    const pointTypes = new Set(points.map(({type}) => type));
    const moneyData = Array.from(pointTypes)
      .map((pointType) => (
        {
          type: pointType.toUpperCase(),
          totalCost: points.reduce((cost, {basePrice, type}) => (
            type === pointType ? cost + basePrice : cost + 0
          ), 0),
        }
      ));

    moneyData.sort((itemA, itemB) => itemB.totalCost - itemA.totalCost);

    const typeData = Array.from(pointTypes)
      .map((pointType) => (
        {
          type: pointType.toUpperCase(),
          totalTimes: points.reduce((times, {type}) => (
            type === pointType ? times + 1 : times + 0
          ), 0),
        }
      ));

    typeData.sort((itemA, itemB) => itemB.totalTimes - itemA.totalTimes);

    const timeSpendData = Array.from(pointTypes)
      .map((pointType) => (
        {
          type: pointType.toUpperCase(),
          totalDuration: points.reduce((duration, {dateFrom, dateTo, type}) => (
            type === pointType ? duration + getDateDiff(dateTo, dateFrom) : duration + 0
          ), 0),
        }
      ));

    timeSpendData.sort((itemA, itemB) => itemB.totalDuration - itemA.totalDuration);

    return {
      money: {
        title: 'MONEY',
        labels: moneyData.map(({type}) => type),
        data: moneyData.map(({totalCost}) => totalCost),
        formatter: (val) => `€ ${val}`,
      },
      type: {
        title: 'TYPE',
        labels: typeData.map(({type}) => type),
        data: typeData.map(({totalTimes}) => totalTimes),
        formatter: (val) => `${val}x`,
      },
      timeSpend: {
        title: 'TIME-SPEND',
        labels: timeSpendData.map(({type}) => type),
        data: timeSpendData.map(({totalDuration}) => totalDuration),
        formatter: (val) => getHumanizeEventDuration(val),
      },
    };
  }
}
