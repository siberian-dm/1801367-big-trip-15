import PointPresenter from './point';

import InfoView from '../view/trip-info';
import MenuView from '../view/menu';
import FiltersView from '../view/filters';
import SortView from '../view/sort';
import PointsView from '../view/trip-points';
import NoPointsView from '../view/no-trip-points';

import {render, RenderPosition} from '../utils/render';


export default class Trip {
  constructor(infoContainer, menuContainer, filtersContainer, pointsContainer) {
    this._infoContainer = infoContainer;
    this._menuContainer = menuContainer;
    this._filtersContainer = filtersContainer;
    this._pointsContainer = pointsContainer;

    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._sortComponent = new SortView();
    this._pointsComponent = new PointsView();
    this._noPointsComponent = new NoPointsView();
  }

  init(points) {
    this._points = points.slice();

    render(this._menuContainer, this._menuComponent);
    render(this._filtersContainer, this._filtersComponent);
    render(this._pointsContainer, this._pointsComponent);
    this._renderTrip();
  }

  _renderSort() {

  }

  _renderNoPonts() {

  }

  _renderPoint(container, point) {
    this._pointComponent = new PointPresenter(container);

    this._pointComponent.init(point);
  }

  _renderTrip() {
    if (!this._points.length) {
      render(this._pointsComponent, this._noPointsComponent);
    }
    else {
      this._tripInfoComponent = new InfoView(this._points);

      render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      render(this._pointsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

      this._points.forEach((point) => this._renderPoint(this._pointsComponent, point));
    }
  }
}
