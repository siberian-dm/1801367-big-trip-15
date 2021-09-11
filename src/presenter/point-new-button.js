import PointNewButtonView from '../view/point-new-button.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType, Status} from '../utils/const.js';


export default class PointNewButton {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleButtonClick = this._handleButtonClick.bind(this);

    this._model.menu.addObserver(this._handleModelEvent);
    this._model.pointNewButton.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._component;

    this._component = new PointNewButtonView(this._model.pointNewButton.getStatus());

    this._component.setButtonClickHandler(this._handleButtonClick);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.STATS_SHOW:
      case UpdateType.TABLE_SHOW:
      case UpdateType.NEW_POINT_FORM_SHOW:
      case UpdateType.NEW_POINT_FORM_DESTROY:
        this.init();
    }
  }

  _handleButtonClick() {
    this._model.pointNewButton.setStatus(UpdateType.NEW_POINT_FORM_SHOW, Status.DISABLED);
  }
}
