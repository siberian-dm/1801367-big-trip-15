import MenuView from './view/menu';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {createTripPointObjects} from './mock/trip-point';
import {render} from './utils/render';
import {MenuItem, UpdateType, FilterType} from './const';

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

const tripPresenter = new TripPresenter(infoContainer, pointsContainer, pointsModel, filterModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(filtersContainer, filterModel);
filterPresenter.init();

const menuComponent = new MenuView();
render(menuContainer, menuComponent);


const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      // Показать статистику
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
  tripPresenter.destroy();
  tripPresenter.init();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createPoint(handlePointNewFormClose);
  newPointButton.disabled = true;
});
