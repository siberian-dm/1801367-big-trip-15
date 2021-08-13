import AbstractView from './abstract';

const createNoEventsTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';


export default class NoTripPoints extends AbstractView {
  getTemplate() {
    return createNoEventsTemplate();
  }
}
