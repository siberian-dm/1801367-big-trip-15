import AbstractObserver from './abstract-observer.js';
import {Status} from '../utils/const.js';


export default class PointNewButton extends AbstractObserver {
  constructor() {
    super();
    this._status = Status.ENABLED;
  }

  setStatus(updateType, status) {
    this._status = status;
    this._notify(updateType);
  }

  getStatus() {
    return this._status;
  }
}
