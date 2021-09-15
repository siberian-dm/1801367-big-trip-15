import SmartView from './smart';
import {getHumanizeVisibleDateForForm, getDateInUtc, getDateDiff} from '../utils/date';
import {updateItem} from '../utils/common';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const createPointTypesTemplate = (types) =>
  types.map(({type, id, isChecked}) => (
    `<div class="event__type-item">
      <input id="${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="${id}">${type}</label>
    </div>`)).join('');


const createOffersTemplate = (offers, isDisabled) => {
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
        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${titleFormated}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
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
    isDestination,
    isDescription,
    isNewPoint,
    isDisabled,
    isSaving,
    isDeleting,
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
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypesTemplate(pointTypes)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}"
            type="text" name="event-destination" value="${isDestination ? destination.name : ''}"
            list="destination-list-${id}" autocomplete="off" required ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-${id}">
              ${cities.map((city) => `<option value="${city}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}"
            type="text" name="event-start-time" value="${getHumanizeVisibleDateForForm(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}"
            type="text" name="event-end-time" value="${getHumanizeVisibleDateForForm(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text"
            name="event-price" value="${basePrice}" autocomplete="off" required ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
    ${(() => {
      if (isNewPoint) {
        return 'Cancel';
      }

      return isDeleting ? 'Deleting...' : 'Delete';
    })()}
          </button>
          <button class="event__rollup-btn" ${isNewPoint ? 'style="display: none;"' : ''} type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${isAvailableOffers ? createOffersTemplate(availableOffers, isDisabled) : ''}
          ${isDescription ? createDestinationTemplate(destination) : ''}
        </section>
      </form>
    </li>`
  );
};


export default class PointEditForm extends SmartView {
  constructor({point, isNewPoint}, model) {
    super();
    this._model = model;
    this._data = PointEditForm.parseStateToData(point, model, isNewPoint);
    this._datepicker = {};

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._switchToPointHandler = this._switchToPointHandler.bind(this);
    this._removeComponentHandler = this._removeComponentHandler.bind(this);
    this._pointTypeCheckHandler = this._pointTypeCheckHandler.bind(this);
    this._offerCheckHandler = this._offerCheckHandler.bind(this);
    this._destinationChoiceHandler = this._destinationChoiceHandler.bind(this);
    this._changeDateFromHandler = this._changeDateFromHandler.bind(this);
    this._changeDateToHandler = this._changeDateToHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
  }

  reset(point) {
    this.updateData(
      {
        update: PointEditForm.parseStateToData(point, this._model),
        isUpdateNow: true,
      },
    );
  }

  getTemplate() {
    return createEditPointFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setSwitchToPointHandler(this._callback.switchToPoint);
    this.setDeleteClickHandler(this._callback.removeComponent);
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setSwitchToPointHandler(callback) {
    this._callback.switchToPoint = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._switchToPointHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.removeComponent = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._removeComponentHandler);
  }

  _resetDatepicker() {
    for (let datepicker of Object.values(this._datepicker)) {
      if (datepicker) {
        datepicker.destroy();
        datepicker = null;
      }
    }
  }

  _pointTypeCheckHandler(evt) {
    const checkedType = evt.target.value;
    const updatePointTypes = this._data.pointTypes.map((point) => (
      Object.assign({}, point, {isChecked: point.type === checkedType})
    ));
    const availableOffers = PointEditForm.parseOffersToData(
      [],
      checkedType,
      this._data.id,
      this._model.offers.getOffers(),
    );

    this.updateData(
      {
        update: {
          offers: [],
          type: checkedType,
          pointTypes: updatePointTypes,
          availableOffers: availableOffers,
          isAvailableOffers: !!availableOffers.length,
        },
        isUpdateNow: true,
      },
    );
  }

  _destinationChoiceHandler(evt) {
    const destination = this._data.destinations.find((dest) => dest.name === evt.target.value);

    if (!destination) {
      evt.target.setCustomValidity('The city must match the value in the list.');
    }
    else {
      evt.target.setCustomValidity('');

      const {description, pictures} = destination;

      this.updateData(
        {
          update: {
            destination: destination,
            isDescription: !!description || !!pictures.length,
            isDestination: true,
          },
          isUpdateNow: true,
        },
      );
    }

    evt.target.reportValidity();
  }

  _changeDateFromHandler([userDate]) {
    this.updateData(
      {
        update: {
          dateFrom: getDateInUtc(userDate),
        },
        isUpdateNow: false,
      },
    );

    if (getDateDiff(this._data.dateFrom, this._data.dateTo) > 0) {
      this._data.dateTo = this._data.dateFrom;
    }

    this._datepicker.dateTo.destroy();
    this._datepicker.dateTo = null;
    this._setDateToDatepicker();
  }

  _changeDateToHandler([userDate]) {
    this.updateData(
      {
        update: {
          dateTo: getDateInUtc(userDate),
        },
        isUpdateNow: false,
      },
    );
  }

  _priceInputHandler(evt) {
    const re = /^\d+$/;

    if (!re.test(evt.target.value)) {
      evt.target.setCustomValidity('Price can only be a positive integer!');
    }
    else {
      evt.target.setCustomValidity('');

      this.updateData(
        {
          update: {
            basePrice: +evt.target.value,
          },
          isUpdateNow: false,
        },
      );
    }

    evt.target.reportValidity();
  }

  _offerCheckHandler(evt) {
    const checkedtOffer = this._data.availableOffers.find((offer) => offer.titleFormated === evt.target.name);
    const updateOffer = Object.assign({}, checkedtOffer, {isChecked: !checkedtOffer.isChecked});

    this.updateData(
      {
        update: {
          availableOffers: updateItem(this._data.availableOffers, updateOffer),
        },
        isUpdateNow: false,
      },
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit(PointEditForm.parseDataToState(this._data));
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

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChoiceHandler);

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceInputHandler);

    if (this._data.isAvailableOffers) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerCheckHandler);
    }
  }

  _setDateFromDatepicker() {
    if (this._datepicker.dateFrom) {
      this._datepicker.dateFrom.destroy();
      this._datepicker.dateFrom = null;
    }

    this._datepicker.dateFrom = flatpickr(
      this.getElement().querySelector('.event__input--time[name=event-start-time]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        ['time_24hr']: true,
        defaultDate: this._data.dateFrom,
        onClose: this._changeDateFromHandler,
      },
    );
  }

  _setDateToDatepicker() {
    if (this._datepicker.dateTo) {
      this._datepicker.dateTo.destroy();
      this._datepicker.dateTo = null;
    }

    this._datepicker.dateTo = flatpickr(
      this.getElement().querySelector('.event__input--time[name=event-end-time]'),
      {
        enableTime: true,
        minDate: this._data.dateFrom,
        dateFormat: 'd/m/y H:i',
        ['time_24hr']: true,
        defaultDate: this._data.dateTo,
        onClose: this._changeDateToHandler,
      },
    );
  }

  static parseOffersToData(offers, type, id, offerTypes) {
    const availableOffers = offerTypes.find((offerType) => offerType.type === type).offers;

    return availableOffers.map((offer) => {
      const isChecked = offers.some((element) => element.title === offer.title);
      const titleFormated = `event-offer-${offer.title.toLowerCase().replace(/ /g, '-')}`;
      const offerId = `${titleFormated}-${id}`;

      return Object.assign({}, offer, {isChecked, titleFormated, id: offerId});
    });
  }

  static parseStateToData(point, model, isNewPoint = false) {
    const {destination, offers, type, id} = point;

    const destinations = model.destinations.getDestinations();

    const cities = destinations.map((city) => city.name);

    let description = null;
    let pictures = [];

    if (destination) {
      description = destination.description;
      pictures = destination.pictures;
    }

    const offerTypes = model.offers.getOffers();

    const pointTypes = offerTypes.map((offer) => (
      {
        type: offer.type,
        id: `event-type-${offer.type}-${id}`,
        isChecked: offer.type === type,
      }
    ));

    const availableOffers = PointEditForm.parseOffersToData(offers, type, id, offerTypes);

    return Object.assign(
      {},
      point,
      {
        cities,
        pointTypes,
        destinations,
        availableOffers,
        isAvailableOffers: !!availableOffers.length,
        isDescription: !!description || !!pictures.length,
        isDestination: !!destination,
        isNewPoint,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToState(data) {
    data = Object.assign({}, data);

    data.offers = data.availableOffers.filter((offer) => offer.isChecked)
      .map((offer) => ({title: offer.title, price: offer.price}));

    delete data.cities;
    delete data.pointTypes;
    delete data.destinations;
    delete data.availableOffers;
    delete data.isAvailableOffers;
    delete data.isDescription;
    delete data.isDestination;
    delete data.isNewPoint;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
