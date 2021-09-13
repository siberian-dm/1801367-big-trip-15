import InfoView from '../view/info.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType} from '../utils/const.js';


export default class Info {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._model.points.addObserver(this._handleModelEvent);
  }

  init() {
    const points = this._model.points.getPoints();

    if (!points.length) {
      remove(this._component);
      this._component = null;

      return;
    }

    const prevComponent = this._component;

    this._component = new InfoView(points);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.AFTERBEGIN);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.init();
    }
  }
}
