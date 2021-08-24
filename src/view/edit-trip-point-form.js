import SmartView from './smart';
import {DESTINATIONS, OFFER_TYPES} from '../const';
import {getHumanizeVisibleDateForForm} from '../utils/date-format';
import {updateItem} from '../utils/common';


const createPointTypesTemplate = (pointTypes, selectedType, id) =>
  pointTypes.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
    </div>`)).join('');


const createOffersTemplate = (offers) => {
  const availableOffers = offers.map((offer) => {
    const {
      id,
      title,
      price,
      isChecked,
      titleFormated,
    } = offer;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${titleFormated}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`);
  }).join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${availableOffers}
      </div>
    </section>`
  );
};


const createDestinationTemplate = (destination) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('')}
      </div>
    </div>
  </section>`
);


const createEditPointFormTemplate = (data) => {
  const {
    id,
    basePrice,
    dateFrom,
    dateTo,
    destination,
    type,
    cities,
    pointTypes,
    availableOffers,
    isAvailableOffers,
    isDescription,
  } = data;

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
                ${createPointTypesTemplate(pointTypes, type, id)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${cities.map((city) => `<option value="${city}"></option>`).join('')}
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
          ${isAvailableOffers ? createOffersTemplate(availableOffers) : ''}
          ${isDescription ? createDestinationTemplate(destination) : ''}
        </section>
      </form>
    </li>`
  );
};


export default class EditPointForm extends SmartView {
  constructor(point) {
    super();
    this._data = EditPointForm.parseStateToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._switchToPointHandler = this._switchToPointHandler.bind(this);
    this._removeComponentHandler = this._removeComponentHandler.bind(this);
    this._pointTypeCheckHandler = this._pointTypeCheckHandler.bind(this);
    this._offerCheckHandler = this._offerCheckHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setSwitchToPointHandler(this._callback.switchToPoint);
    this.setRemoveComponentHandler(this._callback.removeComponent);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setSwitchToPointHandler(callback) {
    this._callback.switchToPoint = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._switchToPointHandler);
  }

  setRemoveComponentHandler(callback) {
    this._callback.removeComponent = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._removeComponentHandler);
  }

  _pointTypeCheckHandler(evt) {
    const checkedType = evt.target.value;

    this.updateData({
      offers: [],
      type: checkedType,
      availableOffers: this._data.offerData.get(checkedType),
      isAvailableOffers: !!this._data.offerData.get(checkedType).length,
    });
  }

  _offerCheckHandler(evt) {
    const checkedtOffer = this._data.availableOffers.find((offer) => offer.titleFormated === evt.target.name);
    const updateOffer = Object.assign({}, checkedtOffer, {isChecked: !checkedtOffer.isChecked});

    this.updateData({
      availableOffers: updateItem(this._data.availableOffers, updateOffer),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPointForm.parseDataToState(this._data));
  }

  _switchToPointHandler(evt) {
    evt.preventDefault();
    this._callback.switchToPoint();
  }

  _removeComponentHandler(evt) {
    evt.preventDefault();
    this._callback.removeComponent();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-list')
      .addEventListener('change', this._pointTypeCheckHandler);

    if (this._data.isAvailableOffers) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerCheckHandler);
    }
  }

  static parseOffersToData(id) {
    const parseOfferToData = (offer) => {
      const {title, price} = offer;
      const titleFormated = `event-offer-${title.toLowerCase().replace(/ /g, '-')}`;
      const offerId = `${titleFormated}-${id}`;
      return {
        title,
        price,
        id: offerId,
        titleFormated: titleFormated,
        isChecked: false,
      };
    };

    const offerData = new Map;

    for (const offerType of OFFER_TYPES) {
      offerData.set(offerType.type, offerType.offers.map(parseOfferToData));
    }

    return offerData;
  }

  static parseStateToData(point) {
    const {destination: {description, pictures}, offers, type, id} = point;

    const offerData = EditPointForm.parseOffersToData(id);
    const cities = DESTINATIONS.map((city) => city.name);
    const pointTypes = OFFER_TYPES.map((offer) => offer.type);

    const availableOffers = offerData.get(type).map((offersByType) => {
      const isChecked = offers.some((offer) => offer.title === offersByType.title);

      return Object.assign({}, offersByType, {isChecked: isChecked});
    });

    return Object.assign(
      {},
      point,
      {
        offerData,
        cities,
        pointTypes,
        availableOffers,
        isAvailableOffers: !!availableOffers.length,
        isDescription: !!description || !!pictures.length,
      },
    );
  }

  static parseDataToState(data) {
    data = Object.assign({}, data);

    data.offers = data.availableOffers.filter((offer) => offer.isChecked)
      .map((offer) => ({title: offer.title, price: offer.price}));

    delete data.offerData;
    delete data.cities;
    delete data.pointTypes;
    delete data.availableOffers;
    delete data.isAvailableOffers;
    delete data.isDescription;

    return data;
  }
}
