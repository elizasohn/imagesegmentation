// data = {
//   const image = await FileAttachment("obama.png").image();
//   const height = Math.round(width * image.height / image.width);
//   const context = DOM.context2d(width, height, 1);
//   context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
//   const {data: rgba} = context.getImageData(0, 0, width, height);
//   const data = new Float64Array(width * height);
//   for (let i = 0, n = rgba.length / 4; i < n; ++i) data[i] = Math.max(0, 1 - rgba[i * 4] / 254);
//   data.width = width;
//   data.height = height;
//   return data;
// };

// export default data;
