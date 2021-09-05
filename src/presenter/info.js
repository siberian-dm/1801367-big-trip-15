import InfoView from '../view/trip-info.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import { UpdateType } from '../const.js';


export default class Info {
  constructor(infoContainer, pointsModel, filterModel) {
    this._infoContainer = infoContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._infoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const points = this._filterModel.getFilteredPoints();

    if (!points.length) {
      remove(this._infoComponent);
      this._infoComponent = null;

      return;
    }

    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new InfoView(points);

    if (prevInfoComponent === null) {
      render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);

      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.init();
    }
  }
}
