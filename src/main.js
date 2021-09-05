import MenuView from './view/menu';
import StatsView from './view/stats';
import InfoPresenter from './presenter/info';
import FilterPresenter from './presenter/filter';
import SortPresenter from './presenter/sort';
import TripPresenter from './presenter/trip';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import SortModel from './model/sort';
import {createTripPointObjects} from './mock/trip-point';
import {remove, render} from './utils/render';
import {MenuItem, UpdateType, FilterType} from './const';


const TRIP_POINT_COUNT = 8;

const points = createTripPointObjects(TRIP_POINT_COUNT);

const mainContainer = document.querySelector('.page-body');
const infoContainer = mainContainer.querySelector('.trip-main');
const menuContainer = mainContainer.querySelector('.trip-controls__navigation');
const filtersContainer = mainContainer.querySelector('.trip-controls__filters');
const pointsContainer = mainContainer.querySelector('.trip-events');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel(pointsModel);

const sortModel = new SortModel(filterModel);

const infoPresenter = new InfoPresenter(infoContainer, pointsModel, filterModel);
infoPresenter.init();

const filterPresenter = new FilterPresenter(filtersContainer, filterModel);
filterPresenter.init();

const sortPresenter = new SortPresenter(pointsContainer, pointsModel, filterModel, sortModel);
sortPresenter.init();

const tripPresenter = new TripPresenter(pointsContainer, pointsModel, filterModel, sortModel);
tripPresenter.init();

const menuComponent = new MenuView();
render(menuContainer, menuComponent);

const statsComponent = new StatsView();


const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statsComponent);
      sortPresenter.init();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      sortPresenter.destroy();
      render(pointsContainer, statsComponent);
      break;
  }
};


menuComponent.setMenuClickHandler(handleMenuClick);

const newPointButton = infoContainer.querySelector('.trip-main__event-add-btn');


const handlePointNewFormClose = () => {
  newPointButton.disabled = false;
};


newPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handlePointNewFormClose);
  newPointButton.disabled = true;
});
