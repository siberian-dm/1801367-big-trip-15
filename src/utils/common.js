export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};

export const countOffersCost = (offers) => offers.reduce((cost, offer) => cost + offer.price, 0);

export const isOnline = () => window.navigator.onLine;
