import AbstractView from './abstract';


const createPointsContainerTemplate = () => '<ul class="trip-events__list"></ul>';


export default class PointsContainer extends AbstractView {
  getTemplate() {
    return createPointsContainerTemplate();
  }
}
