import TripInfoView from './view/trip-info';
import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EditEventFormView from './view/edit-event-form';
import EventView from './view/event';
import NoEventView from './view/no-events';
import {createTripPointObjects} from './mock/trip-point';
import {render, RenderPosition} from './utils';

const TRIP_EVENT_COUNT = 15;

const events = createTripPointObjects(TRIP_EVENT_COUNT);

const renderEvent = (eventListContainer, event) => {
  const eventComponent = new EventView(event);
  const editEventFormComponent = new EditEventFormView(event);

  const replaceEventToForm = () => {
    eventListContainer.replaceChild(editEventFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListContainer.replaceChild(eventComponent.getElement(), editEventFormComponent.getElement());
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

  render(eventListContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

render(siteMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView().getElement(), RenderPosition.BEFOREEND);

const eventListComponent = new EventListView();

render(tripEventsContainer, eventListComponent.getElement(), RenderPosition.BEFOREEND);

if (!events.length){
  render(eventListComponent.getElement(), new NoEventView().getElement(), RenderPosition.BEFOREEND);
}
else {
  render(tripInfoContainer, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
  render(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);

  for (let i = 0; i < events.length; i++) {
    renderEvent(eventListComponent.getElement(), events[i]);
  }
}
