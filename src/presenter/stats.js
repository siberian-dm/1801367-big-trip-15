import StatsView from '../view/stats.js';
import {MenuItem, UpdateType} from '../utils/const.js';
import {remove, render, replace} from '../utils/render.js';


export default class Stats {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._model.menu.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._model.menu.getMenuItem() === MenuItem.TABLE) {
      return;
    }

    const points = this._model.points.getPoints();

    if (!points.length) {
      remove(this._component);
      this._component = null;

      return;
    }

    const prevComponent = this._component;

    this._component = new StatsView(points);

    if (prevComponent === null) {
      render(this._container, this._component);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _destroy() {
    remove(this._component);
    this._component = null;
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.TABLE_SHOW:
        this._destroy();
        break;
      case UpdateType.STATS_SHOW:
        this.init();
    }
  }
}
