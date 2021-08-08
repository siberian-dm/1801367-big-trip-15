import TripInfoView from './view/trip-info';
import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import EventListView from './view/event-list';
import {createEditTripPointFormTemplate} from './view/edit-event-form';
import {createTripPointTemplate} from './view/event';
import {createTripPointObjects} from './mock/trip-point';
import {renderElement, renderTemplate, RenderPosition} from './utils';

const TRIP_POINTS_OBJECTS = 15;

const events = createTripPointObjects(TRIP_POINTS_OBJECTS);

const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

renderElement(tripInfoContainer, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(filterListContainer, new FilterListView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEventsContainer, new EventListView().getElement(), RenderPosition.BEFOREEND);


const eventListContainer = tripEventsContainer.querySelector('.trip-events__list');
for (let i = 0; i < events.length; i++) {
  if (i === 0) {
    renderTemplate(eventListContainer, createEditTripPointFormTemplate(events[i]), 'beforeend');
  }
  else {
    renderTemplate(eventListContainer, createTripPointTemplate(events[i]), 'beforeend');
  }
}
