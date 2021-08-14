import AbstractView from './abstract';


const createTripPointsTemplate = () => '<ul class="trip-events__list"></ul>';


export default class TripPoints extends AbstractView {
  getTemplate() {
    return createTripPointsTemplate();
  }
}
