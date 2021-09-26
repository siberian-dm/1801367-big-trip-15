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

import Api from './api/api';
import Store from './api/store';
import PointsProvider from './api/points-provider';
import DestinationsProvider from './api/destinations-provider';
import OffersProvider from './api/offers-provider';

import {UpdateType, Url} from './utils/const';

const AUTHORIZATION = 'Basic hS2235qweSWsd66hjklgatepeRos';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip/';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const POINTS_STORE_NAME = `${STORE_PREFIX}-${STORE_VER}-${Url.POINTS}`;
const DESTINATIONS_STORE_NAME = `${STORE_PREFIX}-${STORE_VER}-${Url.DESTINATIONS}`;
const OFFERS_STORE_NAME = `${STORE_PREFIX}-${STORE_VER}-${Url.OFFERS}`;

const mainContainer = document.querySelector('.page-body');
const infoContainer = mainContainer.querySelector('.trip-main');
const menuContainer = mainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const pointsContainer = mainContainer.querySelector('.trip-events');

const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const detinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);

const api = new Api(END_POINT, AUTHORIZATION);
const apiWithPointsProvider = new PointsProvider(api, pointsStore);
const apiWithDestinationsProvider = new DestinationsProvider(api, detinationsStore);
const apiWithOffersProvider = new OffersProvider(api, offersStore);


const model = {
  points: new PointsModel(),
  destinations: new DestinationsModel(),
  offers: new OffersModel(),
  menu: new MenuModel(),
  pointNewButton: new PointNewButtonModel(),
};

Promise.all([
  apiWithPointsProvider.getPoints(),
  apiWithDestinationsProvider.getDestinations(),
  apiWithOffersProvider.getOffers(),
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

const tripPresenter = new TripPresenter(pointsContainer, model, apiWithPointsProvider);
tripPresenter.init();

const statsPresenter = new StatsPresenter(pointsContainer, model);
statsPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithPointsProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
