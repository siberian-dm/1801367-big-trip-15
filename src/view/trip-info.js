import AbstractView from './abstract';
import {getHumanizeVisibleDateForInfo} from '../utils/date-format';

const TRIP_POINT_TITLE_COUNT = 3;


const createTripInfoTemplate = (tripPoints) => {
  const firstEvent = tripPoints[0];
  const lastEvent = tripPoints[tripPoints.length - 1];
  const initialValue = 0;

  const tripInfoTitle = tripPoints.length <= TRIP_POINT_TITLE_COUNT
    ? tripPoints.map((event) => event.destination.name).join(' &mdash; ')
    : `${firstEvent.destination.name} &mdash; ... &mdash; ${lastEvent.destination.name}`;

  const tripInfoCost = tripPoints.reduce((totalCost, tripPoint) => {
    const {basePrice, offers} = tripPoint;
    const offerCost = offers.reduce((cost, offer) => cost + offer.price, initialValue);

    return totalCost + basePrice + offerCost;
  }, initialValue);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${getHumanizeVisibleDateForInfo(firstEvent.dateFrom, lastEvent.dateTo)}</p>
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
