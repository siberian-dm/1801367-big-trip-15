import TripInfoView from './view/trip-info';
import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import TripPointListView from './view/trip-point-list';
import EditTripPointFormView from './view/edit-trip-point-form';
import TripPointView from './view/trip-point';
import NoTripPointsView from './view/no-trip-points';
import {createTripPointObjects} from './mock/trip-point';
import {render, replace, remove, RenderPosition} from './utils/render';

const TRIP_POINT_COUNT = 15;

const tripPoints = createTripPointObjects(TRIP_POINT_COUNT);

const renderTripPoint = (tripPointListContainer, tripPoint) => {
  const tripPointComponent = new TripPointView(tripPoint);
  const editTripPointFormComponent = new EditTripPointFormView(tripPoint);

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

  render(tripPointListContainer, tripPointComponent, RenderPosition.BEFOREEND);
};


const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripPointsContainer = siteMainContainer.querySelector('.trip-events');

render(siteMenuContainer, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView(), RenderPosition.BEFOREEND);

const tripPointListComponent = new TripPointListView();

render(tripPointsContainer, tripPointListComponent, RenderPosition.BEFOREEND);

if (!tripPoints.length) {
  render(tripPointListComponent, new NoTripPointsView(), RenderPosition.BEFOREEND);
}
else {
  render(tripInfoContainer, new TripInfoView(tripPoints), RenderPosition.AFTERBEGIN);
  render(tripPointsContainer, new SortView(), RenderPosition.AFTERBEGIN);

  for (let i = 0; i < tripPoints.length; i++) {
    renderTripPoint(tripPointListComponent, tripPoints[i]);
  }
}
