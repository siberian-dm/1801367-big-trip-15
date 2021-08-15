import TripPresenter from './presenter/trip';
import {createTripPointObjects} from './mock/trip-point';

const TRIP_POINT_COUNT = 15;

const tripPoints = createTripPointObjects(TRIP_POINT_COUNT);

const siteMainContainer = document.querySelector('.page-body');
const tripInfoContainer = siteMainContainer.querySelector('.trip-main');
const siteMenuContainer = siteMainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = siteMainContainer.querySelector('.trip-controls__filters');
const tripPointsContainer = siteMainContainer.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripInfoContainer, siteMenuContainer, filtersContainer, tripPointsContainer);

tripPresenter.init(tripPoints);
