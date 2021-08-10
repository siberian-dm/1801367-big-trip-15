import TripInfoView from './view/trip-info';
import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EditEventFormView from './view/edit-event-form';
import EventView from './view/event';
import NoEventView from './view/no-events';
import {createTripPointObjects} from './mock/trip-point';
import {render, replace, RenderPosition} from './utils/render';

const TRIP_EVENT_COUNT = 15;

const events = createTripPointObjects(TRIP_EVENT_COUNT);

const renderEvent = (eventListContainer, event) => {
  const eventComponent = new EventView(event);
  const editEventFormComponent = new EditEventFormView(event);

  const replaceEventToForm = () => {
    replace(editEventFormComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, editEventFormComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setSwitchToFormHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventFormComponent.setSwitchToEventHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editEventFormComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventListContainer, eventComponent, RenderPosition.BEFOREEND);
};


const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

render(siteMenuContainer, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView(), RenderPosition.BEFOREEND);

const eventListComponent = new EventListView();

render(tripEventsContainer, eventListComponent, RenderPosition.BEFOREEND);

if (!events.length){
  render(eventListComponent, new NoEventView(), RenderPosition.BEFOREEND);
}
else {
  render(tripInfoContainer, new TripInfoView(events), RenderPosition.AFTERBEGIN);
  render(tripEventsContainer, new SortView(), RenderPosition.AFTERBEGIN);

  for (let i = 0; i < events.length; i++) {
    renderEvent(eventListComponent, events[i]);
  }
}
