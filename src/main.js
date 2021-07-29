import {
  createTripInfoTemplate,
  createSiteMenuTemplate,
  createTripFiltersTemplate,
  createTripSortTemplate,
  createAddTripPointFormTemplate,
  createEditTripPointFormTemplate,
  createTripPointTemplate
} from './view/index.js';

const TRIP_POINTS_NUMBER = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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

for (let i = 0; i < TRIP_POINTS_NUMBER; i++) {
  render(tripEventListContainer, createTripPointTemplate(), 'beforeend');
}
