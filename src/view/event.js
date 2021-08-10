import AbstractView from './abstract';
import {getHumanizeDate, getHumanizeVisibleDate, getHumanizeEventTime, getHumanizeEventDuration} from '../utils/date-format';


const createSelectedOffersTemplate = (offers) => {
  let offerItems = '';
  for (const offer of offers) {
    offerItems += (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }

  return offerItems;
};


const createEventTemplate = (event) => {
  const eventBasePrice = event['base_price'];
  const eventDateFrom = event['date_from'];
  const eventDateTo = event['date_to'];
  const eventDestination = event['destination'];
  const eventOffers = event['offers'];
  const eventType = event['type'];
  const eventIsFavorite = event['is_favorite'];

  const favoriteClassName = eventIsFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const eventSelectedOffers = eventOffers.length ? createSelectedOffersTemplate(eventOffers) : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getHumanizeDate(eventDateFrom)}">${getHumanizeVisibleDate(eventDateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${eventDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${eventDateFrom}">${getHumanizeEventTime(eventDateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${eventDateTo}">${getHumanizeEventTime(eventDateTo)}</time>
          </p>
          <p class="event__duration">${getHumanizeEventDuration(eventDateFrom, eventDateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${eventBasePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${eventSelectedOffers}
        </ul>
        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};


export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._callback = {};
    this._switchToFormHandler = this._switchToFormHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _switchToFormHandler(evt) {
    evt.preventDefault();
    this._callback.switchToForm();
  }

  setSwitchToFormHandler(callback) {
    this._callback.switchToForm = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._switchToFormHandler);
  }
}
