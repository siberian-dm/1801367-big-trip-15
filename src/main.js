import InfoPresenter from './presenter/info';
import PointNewButtonPresenter from './presenter/point-new-button';
import MenuPresenter from './presenter/menu';
import FilterPresenter from './presenter/filter';
import SortPresenter from './presenter/sort';
import TripPresenter from './presenter/trip';
import StatsPresenter from './presenter/stats';

import PointsModel from './model/points';
import FilterModel from './model/filter';
import MenuModel from './model/menu';
import PointNewButtonModel from './model/point-new-button';
import SortModel from './model/sort';

import {createTripPointObjects} from './mock/trip-point';

const TRIP_POINT_COUNT = 8;

const points = createTripPointObjects(TRIP_POINT_COUNT);

const mainContainer = document.querySelector('.page-body');
const infoContainer = mainContainer.querySelector('.trip-main');
const menuContainer = mainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const pointsContainer = mainContainer.querySelector('.trip-events');

const model = {
  points: new PointsModel(),
};

model.points.setPoints(points);
model.filter = new FilterModel(model.points);
model.sort = new SortModel(model.filter);
model.menu = new MenuModel();
model.pointNewButton = new PointNewButtonModel();

const infoPresenter = new InfoPresenter(infoContainer, model);
infoPresenter.init();

const pointNewButtonPresenter = new PointNewButtonPresenter(infoContainer, model);
pointNewButtonPresenter.init();

const menuPresenter = new MenuPresenter(menuContainer, model);
menuPresenter.init();

const filterPresenter = new FilterPresenter(filtersContainer, model);
filterPresenter.init();

const sortPresenter = new SortPresenter(pointsContainer, model);
sortPresenter.init();

const tripPresenter = new TripPresenter(pointsContainer, model);
tripPresenter.init();

const statsPresenter = new StatsPresenter(pointsContainer, model);
statsPresenter.init();
