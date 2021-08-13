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

const TRIP_EVENT_COUNT = 15;

const events = createTripPointObjects(TRIP_EVENT_COUNT);

const renderEvent = (eventListContainer, event) => {
  const tripPointComponent = new TripPointView(event);
  const editTripPointFormComponent = new EditTripPointFormView(event);

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

  render(eventListContainer, tripPointComponent, RenderPosition.BEFOREEND);
};


const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

render(siteMenuContainer, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView(), RenderPosition.BEFOREEND);

const eventListComponent = new TripPointListView();

render(tripEventsContainer, eventListComponent, RenderPosition.BEFOREEND);

if (!events.length){
  render(eventListComponent, new NoTripPointsView(), RenderPosition.BEFOREEND);
}
else {
  render(tripInfoContainer, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  render(tripEventsContainer, new SortView(), RenderPosition.AFTERBEGIN);

  for (let i = 0; i < events.length; i++) {
    renderEvent(eventListComponent, events[i]);
  }
}
