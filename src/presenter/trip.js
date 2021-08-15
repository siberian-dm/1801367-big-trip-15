import TripInfoView from '../view/trip-info';
import SiteMenuView from '../view/site-menu';
import FiltersView from '../view/filters';
import SortView from '../view/sort';
import TripPointsView from '../view/trip-points';
import EditTripPointFormView from '../view/edit-trip-point-form';
import TripPointView from '../view/trip-point';
import NoTripPointsView from '../view/no-trip-points';
import {render, replace, remove, RenderPosition} from '../utils/render';

export default class Trip {
  constructor(tripInfoContainer, siteMenuContainer, filtersContainer, tripPointsContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._siteMenuContainer = siteMenuContainer;
    this._filtersContainer = filtersContainer;
    this._tripPointsContainer = tripPointsContainer;

    this._siteMenuComponent = new SiteMenuView();
    this._filtersComponent = new FiltersView();
    this._sortComponent = new SortView();
    this._tripPointsComponent = new TripPointsView();
    this._noTripPointsComponent = new NoTripPointsView();
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    render(this._siteMenuContainer, this._siteMenuComponent);
    render(this._filtersContainer, this._filtersComponent);
    render(this._tripPointsContainer, this._tripPointsComponent);
    this._renderTrip();
  }

  _renderSort() {

  }

  _renderNoTripPonts() {

  }

  _renderTripPoint(container, point) {
    const tripPointComponent = new TripPointView(point);
    const editTripPointFormComponent = new EditTripPointFormView(point);

    const replaceTripPointToForm = () => {
      replace(editTripPointFormComponent, tripPointComponent);
    };

    const replaceFormToTripPoint = () => {
      replace(tripPointComponent, editTripPointFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToTripPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.setSwitchToFormHandler(() => {
      replaceTripPointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editTripPointFormComponent.setSwitchToTripPointHandler(() => {
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editTripPointFormComponent.setFormSubmitHandler(() => {
      replaceFormToTripPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editTripPointFormComponent.setRemoveComponentHandler(() => {
      remove(editTripPointFormComponent);
      remove(tripPointComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(container, tripPointComponent);
  }

  _renderTrip() {
    if (!this._tripPoints.length) {
      render(this._tripPointsComponent, this._noTripPointsComponent);
    }
    else {
      this._tripInfoComponent = new TripInfoView(this._tripPoints);

      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      render(this._tripPointsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

      this._tripPoints.forEach((point) => this._renderTripPoint(this._tripPointsComponent, point));
    }
  }
}
