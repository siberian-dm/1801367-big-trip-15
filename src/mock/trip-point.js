import {POINT_TYPE_BASE_PRICE} from './const';
import {OFFER_TYPES, DESTINATIONS} from '../const';
import {getRandomInteger} from './random';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);


const generateTripPoint = (dateFrom, dateTo, index) => {
  const pointTypes = OFFER_TYPES.map((offer) => offer.type);
  const pointType = pointTypes[getRandomInteger(0, pointTypes.length - 1)];
  const pointOffers = OFFER_TYPES.find((offer) => offer.type === pointType).offers;

  return {
    basePrice: POINT_TYPE_BASE_PRICE[pointType],
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)],
    id: index,
    isFavorite: !!getRandomInteger(),
    offers: new Array(getRandomInteger(0, pointOffers.length)).fill().map((_, offerIndex) => pointOffers[offerIndex]),
    type: pointType,
  };
};


const createTripPointObjects = (objectsNumber) => {
  const oneMinute = 6e4;
  let dateFrom = dayjs();
  let dateTo = dateFrom.add(getRandomInteger(20, 360), 'minute');
  const tripPointList = [];

  for (let i = 0; i < objectsNumber; i++) {
    if (i > 0) {
      dateFrom = dateTo.add((dateTo - dateFrom) / oneMinute + getRandomInteger(20, 240), 'minute');
      dateTo = dateFrom.add(getRandomInteger(20, 720), 'minute');
    }
    tripPointList.push(generateTripPoint(dateFrom.utc().format(), dateTo.utc().format(), i));
  }

  return tripPointList;
};

export {createTripPointObjects};
