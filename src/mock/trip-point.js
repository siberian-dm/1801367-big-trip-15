import dayjs from 'dayjs';
import {DESCRIPTIONS, POINT_TYPE_BASE_PRICE, PHOTOS_URL} from './const';
import {POINT_TYPES, OFFER_TYPES, CITIES} from '../const';
import {getRandomInteger} from './random';

const DESCRIPTION_ROW_MAX = 5;
const DESTINATION_PICTURES_MAX = 5;


const generateDescription = () => new Array(getRandomInteger(DESCRIPTION_ROW_MAX))
  .fill()
  .map(() => DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)])
  .join(' ');


const generatePicture = () => (
  {
    'src': `${PHOTOS_URL + getRandomInteger(DESTINATION_PICTURES_MAX)}`,
    'description': generateDescription(),
  }
);


const generateDestination = () => (
  {
    'description': getRandomInteger() ? generateDescription() : '',
    'name': CITIES[getRandomInteger(0, CITIES.length - 1)],
    'pictures': new Array(getRandomInteger(0, DESTINATION_PICTURES_MAX)).fill().map(generatePicture),
  }
);


const generateTripPoint = (dateFrom, dateTo, index) => {
  const pointType = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];
  const pointOffers = OFFER_TYPES.find((offer) => offer.type === pointType).offers;

  return {
    'basePrice': POINT_TYPE_BASE_PRICE[pointType],
    'dateFrom': dateFrom,
    'dateTo': dateTo,
    'destination': generateDestination(),
    'id': index,
    'isFavorite': !!getRandomInteger(),
    'offers': new Array(getRandomInteger(0, pointOffers.length)).fill().map((_, offerIndex) => pointOffers[offerIndex]),
    'type': pointType,
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
    tripPointList.push(generateTripPoint(dateFrom, dateTo, i));
  }

  return tripPointList;
};

export {createTripPointObjects};
