import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();

    this._data = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  updateData({update, isUpdateNow}) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (isUpdateNow) {
      this.updateElement();
      this.restoreHandlers();
    }
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
