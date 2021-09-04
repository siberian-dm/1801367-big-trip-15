import AbstractView from './abstract';
import {FilterType} from '../const';

const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no past events now',
  [FilterType.PAST]: 'There are no future events now',
};

const createNoPointsTemplate = (filterType) => `<p class="trip-events__msg">${NoPointsText[filterType]}</p>`;


export default class NoPoints extends AbstractView {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createNoPointsTemplate(this._data);
  }
}
