import {
  createTripInfoTemplate,
  createSiteMenuTemplate,
  createTripFiltersTemplate,
  createTripSortTemplate,
  createEditTripPointFormTemplate,
  createTripPointTemplate
} from './view/index';
import {createTripPointObjects} from './mock/trip-point';

const TRIP_POINTS_OBJECTS = 15;


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const tripPoints = createTripPointObjects(TRIP_POINTS_OBJECTS);

const siteMainElement = document.querySelector('.page-body');
const siteMenuContainer = siteMainElement.querySelector('.trip-controls__navigation');
const tripFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const tripInfoContainer = siteMainElement.querySelector('.trip-main');

const tripEventListContainer = document.createElement('ul');
tripEventListContainer.classList.add('trip-events__list');

const tripEventsContainer = siteMainElement.querySelector('.trip-events')
  .insertAdjacentElement('beforeend', tripEventListContainer);

render(tripInfoContainer, createTripInfoTemplate(tripPoints), 'afterbegin');
render(siteMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(tripFiltersContainer, createTripFiltersTemplate(), 'beforeend');
render(tripEventsContainer, createTripSortTemplate(), 'afterbegin');

for (let i = 0; i < tripPoints.length; i++) {
  if (i === 0) {
    render(tripEventListContainer, createEditTripPointFormTemplate(tripPoints[i]), 'beforeend');
  }
  else {
    render(tripEventListContainer, createTripPointTemplate(tripPoints[i]), 'beforeend');
  }
}
