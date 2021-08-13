import AbstractView from './abstract';


const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';


export default class TripPointList extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}
