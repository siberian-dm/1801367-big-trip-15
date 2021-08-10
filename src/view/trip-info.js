import AbstractView from './abstract';
import {getHumanizeVisibleDateForInfo} from '../utils';

const TRIP_POINT_TITLE_COUNT = 3;


const createTripInfoTemplate = (events) => {
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];
  const initialValue = 0;

  const tripInfoTitle = events.length <= TRIP_POINT_TITLE_COUNT
    ? events.map((event) => event.destination.name).join(' &mdash; ')
    : `${firstEvent.destination.name} &mdash; ... &mdash; ${lastEvent.destination.name}`;

  const tripInfoDates = getHumanizeVisibleDateForInfo(firstEvent['date_from'], lastEvent['date_to']);

  const tripInfoCost = events.reduce((totalCost, event) => {
    const basePrice = event['base_price'];
    const offers = event['offers'];
    const offerCost = offers.reduce((cost, offer) => cost + offer.price, initialValue);

    return totalCost + basePrice + offerCost;
  }, initialValue);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${tripInfoDates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfoCost}</span>
      </p>
    </section>`
  );
};


export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
