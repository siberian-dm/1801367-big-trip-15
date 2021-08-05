import {getHumanizeVisibleDateForInfo} from '../utils';

const TRIP_POINT_TITLE_COUNT = 3;

export const createTripInfoTemplate = (tripPoints) => {
  const tripInfoTitle = tripPoints.length <= TRIP_POINT_TITLE_COUNT
    ? tripPoints.map((tripPoint) => tripPoint.destination.name).join(' &mdash; ')
    : `${tripPoints[0].destination.name} &mdash; ... &mdash; ${tripPoints[tripPoints.length - 1].destination.name}`;

  const tripInfoDates = getHumanizeVisibleDateForInfo(tripPoints[0].date_from, tripPoints[tripPoints.length - 1].date_to);

  const tripInfoCost = tripPoints.reduce((totalCost, tripPoint) => {
    const {base_price: basePrice, offers} = tripPoint;
    return totalCost + basePrice + offers.reduce((cost, offer) => cost + offer.price, 0);
  }, 0);

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
