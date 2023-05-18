const draw = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image(100, 100);
  img.src = 'https://www.tripsavvy.com/thmb/c5nIYqYcJf_hvTS1Qu4th0Mea5A=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/CratermainGettyImages-1158150928-0097b7d1b250427f96e90868a3cb3cf8.jpg';
  img.crossOrigin = 'Anonymous';
  let imgData;

  const drawImage = (img) => {
    canvas.width = img.naturalWidth/4;
    canvas.height = img.naturalHeight/4;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  // gets Euclidean distance between one pixel and another
  const getDistance = (pixel, start) => {
    return Math.sqrt(((start[0] - pixel[0]) ** 2) + ((start[1] - pixel[1]) ** 2) + ((start[2] - pixel[2]) ** 2));
    
  }

  const selectInitialCentroids = (imgRGBData, k) => {
    // const points = (imgRGBData.width * 3) + (imgRGBData.height * 3);
    const centroidsIndex = [];
    let index;
    // add check that index isn't already in centroidsIndex array
    for (let i = 0; i < k; i += 1) {
      let index = Math.floor(Math.random() * imgRGBData.length);
      centroidsIndex.push(index);
    };

    console.log('centroids index', centroidsIndex);

    const centroids = [];
    for (let i = 0; i < centroidsIndex.length; i += 1) {
      const centroid = imgRGBData[centroidsIndex[i]];
      centroids.push(centroid);
    }
    return centroids;
  };

  const imgRGBData = [];

  const createRGBPixelData = () => {
    console.log('img data length', imgData.data.length);
    for (let i = 0; i < imgData.data.length; i += 4) {
      console.log(i);
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      const pixel = [r, g, b];
      console.log('pixel', pixel)
      imgRGBData.push(pixel);
    }
    // console.log('img rgb data', imgRGBData);
    // return imgRGBData;
  }

  img.onload = () => {
    drawImage(img);
    imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('image data', imgData);
    createRGBPixelData();
    console.log('rgb data', imgRGBData);

    const centroids = selectInitialCentroids(imgRGBData, 2);
    console.log('centroids', centroids);
    const start = imgRGBData[0];
    centroids.forEach((centroid) => {
      const distance = getDistance(centroid, start);
      console.log('distance', distance);
    })

    // console.log('pixel length', imgRGBData.length);
    // console.log('sample pixel: :', imgRGBData[34444]);
    // convertRGBToHex(imgData.data);
    // console.log('hex values', hexValues);
  };

    // const hexValues = [];

  // const valueToHex = (color) => {
  //   console.log('color, ', color);
  //   const hex = color.toString(16);
  //   return hex;
  // }
  // const convertRGBToHex = () => {
  //   console.log('img data length', imgData.data.length);
  //   for (let i = 0; i < imgData.data.length; i += 4) {
  //     console.log(i);
  //     const r = imgData.data[i];
  //     const g = imgData.data[i + 1];
  //     const b = imgData.data[i + 2];
  //     // const a = imgData.data[i + 3];
  //     const hexValue = '#' + valueToHex(r) + valueToHex(g) + valueToHex(b);
  //     hexValues.push(hexValue);
  //   }
  // }

};