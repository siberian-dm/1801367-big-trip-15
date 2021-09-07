import MenuView from '../view/menu.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType, MenuItem, Status } from '../const.js';


export default class Menu {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuClick = this._handleMenuClick.bind(this);

    this._model.menu.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._component;

    this._component = new MenuView(this._model.menu.getMenuItem());

    this._component.setMenuClickHandler(this._handleMenuClick);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);

  }

  _handleModelEvent() {
    this.init();
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.TABLE:
        this._model.menu.setMenuItem(UpdateType.TABLE_SHOW, menuItem);
        this._model.filter.setStatus(UpdateType.STATS_SHOW, Status.ENABLED);
        this._model.pointNewButton.setStatus(UpdateType.TABLE_SHOW, Status.ENABLED);
        break;
      case MenuItem.STATS:
        this._model.menu.setMenuItem(UpdateType.STATS_SHOW, menuItem);
        this._model.filter.setStatus(UpdateType.STATS_SHOW, Status.DISABLED);
        this._model.pointNewButton.setStatus(UpdateType.STATS_SHOW, Status.DISABLED);
    }
  }
}
