// eslint-disable-next-line no-unused-vars
import dayjs from 'dayjs';
import {
  DESCRIPTIONS,
  OFFER_TYPES,
  POINT_TYPES,
  POINT_TYPE_BASE_PRICE,
  PHOTOS_URL,
  CITIES
} from './const';
import {getRandomInteger} from '../utils';

const DESCRIPTION_ROW_MAX = 5;
const DESTINATION_PICTURES_MAX = 10;

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
    'description': generateDescription(),
    'name': CITIES[getRandomInteger(0, CITIES.length - 1)],
    'pictures': new Array(getRandomInteger(DESTINATION_PICTURES_MAX)).fill().map(generatePicture),
  }
);

const generateTripPoint = () => {
  const pointType = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];
  const pointOffers = OFFER_TYPES.find((offer) => offer.type === pointType).offers;
  return {
    'base_price': POINT_TYPE_BASE_PRICE[pointType],
    'date_from': '2019-07-10T22:55:56.845Z',
    'date_to': '2019-07-11T11:22:13.375Z',
    'destination': generateDestination(),
    'id': '0',
    'is_favorite': !!getRandomInteger(),
    'offers': new Array(getRandomInteger(0, pointOffers.length)).fill().map((_, index) => pointOffers[index]),
    'type': pointType,
  };
};

export {generateTripPoint};
