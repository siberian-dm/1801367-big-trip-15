import {isOnline} from '../utils/common.js';


const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.name]: current,
    }), {});


export default class DestinationsProvider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructure(destinations);
          this._store.setItems(items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems());

    return Promise.resolve(storeDestinations);
  }
}
