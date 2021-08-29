import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {createTripPointObjects} from './mock/trip-point';

const TRIP_POINT_COUNT = 15;

const points = createTripPointObjects(TRIP_POINT_COUNT);

const mainContainer = document.querySelector('.page-body');
const infoContainer = mainContainer.querySelector('.trip-main');
const menuContainer = mainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const pointsContainer = mainContainer.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(infoContainer, menuContainer, pointsContainer, pointsModel, filterModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(filtersContainer, filterModel);
filterPresenter.init();
