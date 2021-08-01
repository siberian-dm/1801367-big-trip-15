import {
  createTripInfoTemplate,
  createSiteMenuTemplate,
  createTripFiltersTemplate,
  createTripSortTemplate,
  createAddTripPointFormTemplate,
  createEditTripPointFormTemplate,
  createTripPointTemplate
} from './view/index';
import {generateTripPoint} from './mock/trip-point';

const TRIP_POINTS_OBJECTS = 20;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripPoints = new Array(TRIP_POINTS_OBJECTS).fill().map(generateTripPoint);

const siteMainElement = document.querySelector('.page-body');
const siteMenuContainer = siteMainElement.querySelector('.trip-controls__navigation');
const tripFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const tripInfoContainer = siteMainElement.querySelector('.trip-main');

const tripEventListContainer = document.createElement('ul');
tripEventListContainer.classList.add('trip-events__list');

const tripEventsContainer = siteMainElement.querySelector('.trip-events')
  .insertAdjacentElement('beforeend', tripEventListContainer);

render(tripInfoContainer, createTripInfoTemplate(), 'afterbegin');
render(siteMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(tripFiltersContainer, createTripFiltersTemplate(), 'beforeend');
render(tripEventsContainer, createTripSortTemplate(), 'afterbegin');
render(tripEventListContainer, createEditTripPointFormTemplate(), 'afterbegin');
render(tripEventListContainer, createAddTripPointFormTemplate(), 'beforeend');

for (let i = 0; i < tripPoints.length; i++) {
  render(tripEventListContainer, createTripPointTemplate(tripPoints[i]), 'beforeend');
}
