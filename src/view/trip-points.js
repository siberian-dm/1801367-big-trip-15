import AbstractView from './abstract';


const createPointsTemplate = () => '<ul class="trip-events__list"></ul>';


export default class Points extends AbstractView {
  getTemplate() {
    return createPointsTemplate();
  }
}
