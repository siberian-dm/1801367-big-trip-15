import TripInfoView from './view/trip-info';
import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import EventListView from './view/event-list';
import EditEventFormView from './view/edit-event-form';
import EventView from './view/event';
import {createTripPointObjects} from './mock/trip-point';
import {render, RenderPosition} from './utils';

const TRIP_EVENT_COUNT = 15;

const events = createTripPointObjects(TRIP_EVENT_COUNT);

const renderEvent = (eventListContainer, event) => {
  const eventComponent = new EventView(event);
  const editEventFormComponent = new EditEventFormView(event);

  const replaceCardToForm = () => {
    eventListContainer.replaceChild(editEventFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    eventListContainer.replaceChild(eventComponent.getElement(), editEventFormComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  editEventFormComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(eventListContainer, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

render(tripInfoContainer, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
render(siteMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);

const eventListComponent = new EventListView();

render(tripEventsContainer, eventListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < events.length; i++) {
  renderEvent(eventListComponent.getElement(), events[i]);
}
