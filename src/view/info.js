import AbstractView from './abstract';
import {getHumanizeVisibleDateForInfo} from '../utils/date';
import {countOffersCost} from '../utils/common';

const TRIP_POINT_TITLE_COUNT = 3;


const createInfoTemplate = (points) => {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const infoTitle = points.length <= TRIP_POINT_TITLE_COUNT
    ? points.map((point) => point.destination.name).join(' &mdash; ')
    : `${firstPoint.destination.name} &mdash; ... &mdash; ${lastPoint.destination.name}`;

  const tripCost = points.reduce((cost, {basePrice, offers}) => cost + basePrice + countOffersCost(offers), 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${infoTitle}</h1>

        <p class="trip-info__dates">${getHumanizeVisibleDateForInfo(firstPoint.dateFrom, lastPoint.dateTo)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
      </p>
    </section>`
  );
};


export default class Info extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createInfoTemplate(this._points);
  }
}
