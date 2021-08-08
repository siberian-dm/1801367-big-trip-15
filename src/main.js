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

const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

render(tripInfoContainer, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
render(siteMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filterListContainer, new FilterListView().getElement(), RenderPosition.BEFOREEND);
render(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsContainer, new EventListView().getElement(), RenderPosition.BEFOREEND);


const eventListContainer = tripEventsContainer.querySelector('.trip-events__list');
for (let i = 0; i < events.length; i++) {
  if (i === 0) {
    render(eventListContainer, new EditEventFormView(events[i]).getElement(), RenderPosition.BEFOREEND);
  }
  else {
    render(eventListContainer, new EventView(events[i]).getElement(), RenderPosition.BEFOREEND);
  }
}
