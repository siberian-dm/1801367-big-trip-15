import SiteMenuView from './view/site-menu';
import FilterListView from './view/filters';
import SortView from './view/sort';
import EventListView from './view/event-list';
import {createTripInfoTemplate} from './view/trip-info';
import {createEditTripPointFormTemplate} from './view/edit-event-form';
import {createTripPointTemplate} from './view/event';
import {createTripPointObjects} from './mock/trip-point';
import {renderElement, renderTemplate, RenderPosition} from './utils';

const TRIP_POINTS_OBJECTS = 15;

const tripPoints = createTripPointObjects(TRIP_POINTS_OBJECTS);

const siteMainContainer = document.querySelector('.page-body');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filterListContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const tripEventsContainer = siteMainContainer.querySelector('.trip-events');

renderTemplate(tripInfoContainer, createTripInfoTemplate(tripPoints), 'afterbegin');
renderElement(siteMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(filterListContainer, new FilterListView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEventsContainer, new EventListView().getElement(), RenderPosition.BEFOREEND);


const eventListContainer = tripEventsContainer.querySelector('.trip-events__list');
for (let i = 0; i < tripPoints.length; i++) {
  if (i === 0) {
    renderTemplate(eventListContainer, createEditTripPointFormTemplate(tripPoints[i]), 'beforeend');
  }
  else {
    renderTemplate(eventListContainer, createTripPointTemplate(tripPoints[i]), 'beforeend');
  }
}
