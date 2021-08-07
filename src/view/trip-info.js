import {getHumanizeVisibleDateForInfo} from '../utils';

const TRIP_POINT_TITLE_COUNT = 3;


export const createTripInfoTemplate = (tripPoints) => {
  const firstTripPoint = tripPoints[0];
  const lastTripPoint = tripPoints[tripPoints.length - 1];
  const initialValue = 0;

  const tripInfoTitle = tripPoints.length <= TRIP_POINT_TITLE_COUNT
    ? tripPoints.map((tripPoint) => tripPoint.destination.name).join(' &mdash; ')
    : `${firstTripPoint.destination.name} &mdash; ... &mdash; ${lastTripPoint.destination.name}`;

  const tripInfoDates = getHumanizeVisibleDateForInfo(firstTripPoint.date_from, lastTripPoint.date_to);

  const tripInfoCost = tripPoints.reduce((totalCost, tripPoint) => {
    const {base_price: basePrice, offers} = tripPoint;
    return totalCost + basePrice + offers.reduce((cost, offer) => cost + offer.price, initialValue);
  }, initialValue);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${tripInfoDates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfoCost}</span>
      </p>
    </section>`;
};
