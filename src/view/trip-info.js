import AbstractView from './abstract';
import {getHumanizeVisibleDateForInfo} from '../utils/date-format';

const TRIP_POINT_TITLE_COUNT = 3;


const createTripInfoTemplate = (tripPoints) => {
  const firstPoint = tripPoints[0];
  const lastPoint = tripPoints[tripPoints.length - 1];
  const initialValue = 0;

  const tripInfoTitle = tripPoints.length <= TRIP_POINT_TITLE_COUNT
    ? tripPoints.map((point) => point.destination.name).join(' &mdash; ')
    : `${firstPoint.destination.name} &mdash; ... &mdash; ${lastPoint.destination.name}`;

  const tripInfoCost = tripPoints.reduce((totalCost, point) => {
    const {basePrice, offers} = point;
    const offerCost = offers.reduce((cost, offer) => cost + offer.price, initialValue);

    return totalCost + basePrice + offerCost;
  }, initialValue);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${getHumanizeVisibleDateForInfo(firstPoint.dateFrom, lastPoint.dateTo)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfoCost}</span>
      </p>
    </section>`
  );
};


export default class TripInfo extends AbstractView {
  constructor(tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripPoints);
  }
}
