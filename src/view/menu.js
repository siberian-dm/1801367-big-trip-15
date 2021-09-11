import AbstractView from './abstract';
import {MenuItem} from '../utils/const';


const createMenuTemplate = (menuItem) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn ${menuItem === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}" href="#">Table</a>
    <a class="trip-tabs__btn ${menuItem === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}" href="#">Stats</a>
  </nav>`
);


export default class Menu extends AbstractView {
  constructor(currentMenuItem) {
    super();
    this._currentMenuItem = currentMenuItem;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._currentMenuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.textContent);
  }
}
