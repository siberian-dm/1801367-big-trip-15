import AbstractObserver from './abstract-observer';

export default class Points extends AbstractObserver{
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }
}
