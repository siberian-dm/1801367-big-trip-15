import AbstractView from './abstract';
import {Status} from '../const';

const createButtonTemplate = (status) => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" 
  type="button" ${status === Status.DISABLED ? 'disabled' : ''}>New event</button>`
);

export default class PointNewButton extends AbstractView {
  constructor(status) {
    super();
    this._status = status;

    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createButtonTemplate(this._status);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener('click', this._buttonClickHandler);
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }
}
