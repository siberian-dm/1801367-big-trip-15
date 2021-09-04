import AbstractView from './abstract';


const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
);


export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _setMenuItem(menuItem) {
    const menuItems = this.getElement().querySelectorAll('a');

    menuItems.forEach((item) => item.classList.remove('trip-tabs__btn--active'));

    menuItem.classList.add('trip-tabs__btn--active');
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._setMenuItem(evt.target);
    this._callback.menuClick(evt.target.textContent);
  }
}
