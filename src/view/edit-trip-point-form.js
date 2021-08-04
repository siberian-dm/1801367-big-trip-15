import {POINT_TYPES} from '../const';
import {CITIES, OFFER_TYPES} from '../mock/const';
import {getHumanizeVisibleDateInForm} from '../utils';

const createEventTypeListTemplate = (pointTypes, selectedType) => {
  let eventTypeItems = '';
  for (const pointType of pointTypes) {
    eventTypeItems += `
    <div class="event__type-item">
      <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === selectedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType}</label>
    </div>`;
  }
  return eventTypeItems;
};

const createDestinationListTemplate = (cities) => {
  let destinationItems = '';
  for (const city of cities) {
    destinationItems += `<option value="${city}"></option>`;
  }

  return destinationItems;
};

const createEventAvailableOffersTemplate = (offers, selectedOffers) => {
  const selectedOffersList = selectedOffers.map((offer) => offer.title);
  let offerItems = '';
  for (const offer of offers) {
    const isChecked = !!selectedOffersList.includes(offer.title);
    const offerTitleFormated = offer.title.toLowerCase().replace(/ /g, '-');
    offerItems += `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitleFormated}-1" type="checkbox" name="event-offer-${offerTitleFormated}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offerTitleFormated}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offerItems}
      </div>
    </section>`;
};

const createEventDestinationTemplate = (destination) => {
  const {description, pictures} = destination;
  let pictureItems = '';

  if (pictures.length > 0) {
    for (const picture of pictures) {
      pictureItems += `<img class="event__photo" src="${picture.src}" alt="Event photo">`;
    }
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictureItems}
        </div>
      </div>
    </section>`;
};

export const createEditTripPointFormTemplate = (tripPoint) => {
  const {
    base_price: basePrice,
    date_from: dateFrom,
    date_to: dateTo,
    destination,
    offers,
    type,
  } = tripPoint;


  const eventTypeOffers = OFFER_TYPES.find((offer) => offer.type === type).offers;

  const eventAvailableOffers = eventTypeOffers.length > 0
    ? createEventAvailableOffersTemplate(eventTypeOffers, offers)
    : '';

  const destinationDescription = destination.description || destination.pictures.length > 0
    ? createEventDestinationTemplate(destination)
    : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeListTemplate(POINT_TYPES, type)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationListTemplate(CITIES)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getHumanizeVisibleDateInForm(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getHumanizeVisibleDateInForm(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${eventAvailableOffers}
        ${destinationDescription}
      </section>
    </form>
  </li>`;
};
