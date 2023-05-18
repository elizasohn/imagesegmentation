const selectInitialCentroids = (imgRGBData, k) => {
  const points = (imgRGBData.width * 3) + (imgRGBData.height * 3);
  const centroidsIndex = [];
  let index;
  // add check that index isn't already in centroidsIndex array
  for (let i = 0; i <= k; i += 1) {
    index = randomBetween(0, points);
    centroidsIndex.push(index);
  };

  const centroids = [];
  for (let i = 0; i < centroidsIndex.length; i += 4) {
    const centroid = [points[centroidsIndex[i]], points[centroidsIndex[i+1], points[centroidsIndex[i +2]]]];
    centroids.push(centroid);
  }
  return centroids;
};