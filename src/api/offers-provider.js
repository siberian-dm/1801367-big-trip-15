import {isOnline} from '../utils/common.js';


const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.type]: current,
    }), {});


export default class OffersProvider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers);
          this._store.setItems(items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems());

    return Promise.resolve(storeOffers);
  }
}
