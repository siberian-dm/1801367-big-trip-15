import AbstractView from './abstract';
import {POINT_TYPES} from '../const';
import {CITIES, OFFER_TYPES} from '../const';
import {getHumanizeVisibleDateForForm} from '../utils/date-format';


const createPointTypeListTemplate = (pointTypes, selectedType, id) => {
  let pointTypeItems = '';
  for (const eventType of pointTypes) {
    pointTypeItems += (
      `<div class="event__type-item">
        <input id="event-type-${eventType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === selectedType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType}</label>
      </div>`
    );
  }

  return pointTypeItems;
};


const createDestinationListTemplate = (cities) => {
  let destinationItems = '';
  for (const city of cities) {
    destinationItems += `<option value="${city}"></option>`;
  }

  return destinationItems;
};


const createOffersTemplate = (offers, selectedOffers, id) => {
  const selectedOffersList = selectedOffers.map((offer) => offer.title);

  let offerItems = '';
  for (const offer of offers) {
    const isChecked = !!selectedOffersList.includes(offer.title);
    const offerTitleFormated = offer.title.toLowerCase().replace(/ /g, '-');
    offerItems += (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitleFormated}-${id}" type="checkbox" name="event-offer-${offerTitleFormated}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offerTitleFormated}-${id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offerItems}
      </div>
    </section>`
  );
};


const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;

  let pictureItems = '';
  if (pictures.length) {
    for (const picture of pictures) {
      pictureItems += `<img class="event__photo" src="${picture.src}" alt="Event photo">`;
    }
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictureItems}
        </div>
      </div>
    </section>`
  );
};


const createEditTripPointFormTemplate = (tripPoint) => {
  const {id, basePrice, dateFrom, dateTo, destination, offers, type} = tripPoint;

  const tripPointOffers = OFFER_TYPES.find((offer) => offer.type === type).offers;

  const offersToRender = tripPointOffers.length
    ? createOffersTemplate(tripPointOffers, offers, id)
    : '';

  const destinationDescription = destination.description || destination.pictures.length
    ? createDestinationTemplate(destination)
    : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypeListTemplate(POINT_TYPES, type, id)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${createDestinationListTemplate(CITIES)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getHumanizeVisibleDateForForm(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getHumanizeVisibleDateForForm(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersToRender}
          ${destinationDescription}
        </section>
      </form>
    </li>`
  );
};


export default class EditTripPointForm extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._switchToTripPointHandler = this._switchToTripPointHandler.bind(this);
    this._removeComponentHandler = this._removeComponentHandler.bind(this);
  }

  getTemplate() {
    return createEditTripPointFormTemplate(this._event);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _switchToTripPointHandler(evt) {
    evt.preventDefault();
    this._callback.switchToTripPoint();
  }

  _removeComponentHandler(evt) {
    evt.preventDefault();
    this._callback.removeComponent();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setSwitchToTripPointHandler(callback) {
    this._callback.switchToTripPoint = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._switchToTripPointHandler);
  }

  setRemoveComponentHandler(callback) {
    this._callback.removeComponent = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._removeComponentHandler);
  }
}
