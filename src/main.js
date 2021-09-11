import InfoPresenter from './presenter/info';
import PointNewButtonPresenter from './presenter/point-new-button';
import MenuPresenter from './presenter/menu';
import FilterPresenter from './presenter/filter';
import SortPresenter from './presenter/sort';
import TripPresenter from './presenter/trip';
import StatsPresenter from './presenter/stats';

import PointsModel from './model/points';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';
import FilterModel from './model/filter';
import MenuModel from './model/menu';
import PointNewButtonModel from './model/point-new-button';
import SortModel from './model/sort';

import Api from './utils/api';
import {UpdateType} from './utils/const';

const AUTHORIZATION = 'Basic hS2sd66hjklgatetros';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';

const mainContainer = document.querySelector('.page-body');
const infoContainer = mainContainer.querySelector('.trip-main');
const menuContainer = mainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const pointsContainer = mainContainer.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const model = {
  points: new PointsModel(),
  destinations: new DestinationsModel(),
  offers: new OffersModel(),
  menu: new MenuModel(),
  pointNewButton: new PointNewButtonModel(),
};

Promise.all([
  api.getPoints(),
  api.getDestinations(),
  api.getOffers(),
])
  .then(([points, destinations, offers]) => {
    model.destinations.setDestinations(destinations);
    model.offers.setOffers(offers);
    model.points.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    model.points.setPoints(UpdateType.INIT, []);
  });

model.filter = new FilterModel(model.points);
model.sort = new SortModel(model.filter);

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

const tripPresenter = new TripPresenter(pointsContainer, model, api);
tripPresenter.init();

const statsPresenter = new StatsPresenter(pointsContainer, model);
statsPresenter.init();
