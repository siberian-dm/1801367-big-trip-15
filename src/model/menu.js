import AbstractObserver from './abstract-observer.js';
import {MenuItem} from '../utils/const.js';


export default class Menu extends AbstractObserver {
  constructor() {
    super();
    this._activeMenuItem = MenuItem.TABLE;
  }

  setMenuItem(updateType, menuItem) {
    this._activeMenuItem = menuItem;
    this._notify(updateType);
  }

  getMenuItem() {
    return this._activeMenuItem;
  }
}
