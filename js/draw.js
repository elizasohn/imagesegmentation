const observer = (
  targetNode,
  callback,
  config = { childList: true, subtree: true, attributes: true }
) => {
  const obs = new MutationObserver(callback);
  obs.observe(targetNode, config);
	return observer;
};

const draw = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image(100, 100);
  
  // comment out following line to try with popsicle
  img.src = '../images/craterlake.jpeg';

  // un comment following line to try with popsicle
  // img.src = '../images/popsicle.jpeg';

  img.crossOrigin = 'Anonymous';
  let imgData;

  const drawImage = (img) => {
    // comment out following two lines to try with popsicle
    canvas.width = img.naturalWidth/1.5;
    canvas.height = img.naturalHeight / 1.5;
    
    // uncomment following two lines to try with popsicle
    // canvas.width = img.naturalWidth/4;
    // canvas.height = img.naturalHeight/4;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // gets Euclidean distance between one pixel and another
  const getDistance = (pixel, start) => {
    return Math.sqrt(((start[0] - pixel[0]) ** 2) + ((start[1] - pixel[1]) ** 2) + ((start[2] - pixel[2]) ** 2));
    
  }

  const selectInitialCentroidsRandom = (imgRGBData, k) => {
    const centroidsIndex = [];
    let index;
    for (let i = 0; i < k; i += 1) {
      index = Math.floor(Math.random() * imgRGBData.length);
      // check if index is already in centroidsIndex
      while (centroidsIndex.includes(index)) {
        index = Math.floor(Math.random() * imgRGBData.length);
      }
      centroidsIndex.push(index);
    };
    const centroids = [];
    for (let i = 0; i < centroidsIndex.length; i += 1) {
      const centroid = imgRGBData[centroidsIndex[i]];
      centroids.push(centroid);
    }
    return centroids;
  };
  
  const getShardMeans = (composite, shardLength) => {
    const shardMeans = [];
    for (let start = 0; start < composite.length; start += shardLength) {
      const cloneComposite = composite.slice(0);
      const shard = cloneComposite.slice(start, (start + shardLength));
      const shardMean = shard[Math.round((shard.length - 1) / 2)];
      shardMeans.push(shardMean);
    };
    shardMeans.forEach((mean) => {
      mean.pop();
    })
    return shardMeans;
  }

  const initializeCentroidsNaiveSharding = (imgRGBData, k) => {
    const centroidsIndex = [];
    let index;
    const composite = JSON.parse(JSON.stringify(imgRGBData));
    composite.forEach((row) => {
      const sum = row.reduce((a, b) => a + b, 0);
      row.push(sum);
    });
    composite.sort((a, b) => b[3] - a[3]);
    const shardLength = (composite.length / k);
    const shardMeans = getShardMeans(composite, shardLength);
    return shardMeans;
  }

  const imgRGBData = [];

  const createRGBPixelData = () => {
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      const pixel = [r, g, b];
      imgRGBData.push(pixel);
    }
  };

  const createCanvasData = (newRGBData, width, height) => {
    const canvasData = [];
    for (let i = 0; i < newRGBData.length; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        if (j < 3) {
          canvasData.push(newRGBData[i][j]);
        } else {
          canvasData.push(255);
        }
      }
    }
    const uint8 = new Uint8ClampedArray(canvasData);
    console.log('canvas data: ', canvasData);
    const newImageData = new ImageData(new Uint8ClampedArray(canvasData), width, height);
    return newImageData;
  };

  const assignToCentroids = (imgRGBData, centroids) => {
    const assignments = {};
    for (let i = 0; i < centroids.length; i += 1) {
      assignments[i] = {
        pixels: [],
        centroid: centroids[i],
      };
    };
    for (const element of imgRGBData) {
      const pixel = element;
      let closestCentroid, closestCentroidIndex, previousDistance;
      for (let i = 0; i < centroids.length; i += 1) {
        const centroid = centroids[i];
        if (i === 0) {
          closestCentroid = centroid;
          closestCentroidIndex = i;
          previousDistance = getDistance(pixel, closestCentroid);
        } else {
          const distance = getDistance(pixel, centroid);
          if (distance < previousDistance) {
            previousDistance = distance;
            closestCentroid = centroid;
            closestCentroidIndex = i;
          }
        }
      }
      assignments[closestCentroidIndex].pixels.push(imgRGBData.indexOf(pixel));
    }
    return assignments;
  }

  const getMeans = (pixels) => {
    const totalPixels = pixels.length;
    const means = [];
    for (let i = 0; i < 3; i += 1) {
      means.push(0);
    }
    for (const element of pixels) {
      const pixel = imgRGBData[element];
      for (let j = 0; j < pixel.length; j += 1) {
        const value = pixel[j];
        means[j] += value;
      }
    }
    for (let i = 0; i < 3; i += 1) {
      means[i] = Math.round(means[i] / totalPixels);
    }
    return means;
  };

  const recalculateCentroids = (imgRGBData, assignments, k) => {
    let newCentroid;
    const newCentroidList = [];
    for (const k in assignments) {
      const centroidGroup = assignments[k];
      if (centroidGroup.pixels.length > 0) {
        newCentroid = getMeans(centroidGroup.pixels);
      } else {
        newCentroid = selectInitialCentroids(imgRGBData, 1)[0];
      }
      newCentroidList.push(newCentroid);
    }
    return newCentroidList;
  }

  const updateImgData = (assignments, imgRGBData, k) => {
    console.log('img RGB data 188: ', imgRGBData);
    const newRGBData = [];
    for (const element of imgRGBData) {
      newRGBData.push(0);
    };
    for (let i = 0; i < k; i += 1) {
      let centroidRGBData = assignments[i].centroid;
      console.log('assignments centroid: ', centroidRGBData);
      assignments[i].pixels.forEach((pixel) => {
        newRGBData[pixel] = centroidRGBData;
      })
    };
    return newRGBData;
  };

  const runKmeans = (imgRGBData, k, maxIterations, width, height) => {
    let iterations = 0;
    let oldCentroids, assignments, centroids;

    //initialize centroids
    // uncomment following line to use with random initial centroids
    // centroids = selectInitialCentroids(imgRGBData, k);

    //comment out following line to use with random initial centroids
    centroids = initializeCentroidsNaiveSharding(imgRGBData, k);

    // run algorithm
    while (iterations < maxIterations) {
      console.log('iteration: ', iterations);
      oldCentroids = [...centroids];
      iterations += 1;

      assignments = assignToCentroids(imgRGBData, centroids);
      centroids = recalculateCentroids(imgRGBData, assignments, k);
    }
    console.log('imgRGBdata', imgRGBData);
    const newRGBData = updateImgData(assignments, imgRGBData, k);
    const canvasData = createCanvasData(newRGBData, canvas.width, canvas.height);
    return canvasData;
  }
  
  const showLoading = () => {
    document.querySelector('.submit').classList.add('hidden');
    document.querySelector('.loading').classList.remove('hidden');
  };

  const hideLoading = () => {
    document.querySelector('.submit').classList.remove('hidden');
    document.querySelector('.loading').classList.add('hidden');
  };

  const displayResults = (k, iterations) => {
    const canvasData = runKmeans(imgRGBData, k, iterations, canvas.width, canvas.height);
    console.log('canvas data after kmeans: ', canvasData);
    ctx.putImageData(canvasData, 0, 0);
    hideLoading();
  };

  img.onload = () => {
    drawImage(img);
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('image data', imgData);
    createRGBPixelData();
    console.log('rgb data', imgRGBData);
    const submitBtn = document.querySelector('.submit');
    const submitDiv = document.querySelector('.submit-container');
    const loading = document.querySelector('.loading');
    const kslider = document.getElementById('k-fader');
    const islider = document.getElementById('i-fader');

    observer(loading, (mutationList) => {
      if (!mutationList[0].target.classList.contains('hidden')) {
        setTimeout(() => {
          displayResults(kslider.value, islider.value);
        }, 500);
      }
    })
    
    submitDiv.addEventListener('click', () => {
      showLoading();
    })
  };
};