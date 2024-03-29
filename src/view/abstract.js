import {createElement} from '../utils/render';

const SHAKE_ANIMATION_TIMEOUT = 600;
const MINUTE_TO_MS = 1000;


export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._callback = {};
    this._element = null;
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MINUTE_TO_MS}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      if (callback) {
        callback();
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
