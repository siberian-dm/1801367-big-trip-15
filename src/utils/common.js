export const updatePoint = (points, updatedPoint) => {
  const index = points.findIndex((point) => point.id === updatedPoint.id);

  if (index === -1) {
    return points;
  }

  return [
    ...points.slice(0, index),
    updatedPoint,
    ...points.slice(index + 1),
  ];
};
