// let dataA = [
//   [-150, 50],
//   [-50, 0],
//   [-50, -100],
//   [-150, -150],
// ];
// let dataB = [
//   [100, 50],
//   [125, 25],
//   [50, -50],
//   [50, -125],
//   [100, -150]
// ];

let dataA, dataB;
let polylineA = new Polyline();
let polylineB = new Polyline();
let polylinesGenerated = false;
let period = 750;
let started = false;
let currentFrame;



function setup() {
  var canvas = createCanvas(800, 400);
  canvas.parent('fluid-sketch-div');
  background(40, 120, 150);
  // noLoop();
}

function draw() {
  // background(40, 120, 150);
  translate(width / 2, height / 2);

  if (wetlandsGeoArray && urbanGeoArray) {
    
    if (!started) {
      currentFrame = 0;
      console.log("first frame= ", frameCount);
      started = true;
    }

    if (currentFrame == 1000) {
      background(40, 120, 150);
      polylinesGenerated = false;
      currentFrame = 0;
    }else {
      currentFrame++;
      console.log(currentFrame);
    }

    if (!polylinesGenerated) {
      generatePolylines();
      polylinesGenerated = true;
    }
    // console.log(geometryArray);
    if (currentFrame < period){
      renderLines();
    }

    // select a random path from the geometry Array and draw it
    // drawPath(geometryArray[floor(random(geometryArray.length))]);
  } else {
    console.log("Not yet");
  }
}

function generatePolylines() {
  let dataA = urbanGeoArray[floor(random(urbanGeoArray.length))];
  let dataB = wetlandsGeoArray[floor(random(wetlandsGeoArray.length))];

  dataA = scaleData(dataA, -width / 4, 0);
  dataB = scaleData(dataB, width / 4, 0);

  console.log(dataA);
  console.log(dataB);

  // startX = dataB[0][0];
  // startY = dataB[0][1];
  // for (let i = 0; i < dataB.length; i++){
  //   dataB[i][0] = (dataB[i][0] - startX) * 1000000;
  //   dataB[i][1] = (dataB[i][1] - startY) * 1000000;
  // }

  //read in data to polyline arrays
  polylineA.createPolyline(dataA);
  polylineB.createPolyline(dataB);

  //resample paths so that there is an equal number of points in each polyline
  polylineA.upSamplePolyline(max(polylineA.getLength(), polylineB.getLength()));
  polylineB.upSamplePolyline(max(polylineA.getLength(), polylineB.getLength()));

}

function renderLines() {
  noFill();
  // //draw polyline A
  // noFill();
  // stroke(0);
  // strokeWeight(3);
  // polylineA.display();

  // //draw polyline B
  // noFill();
  // strokeWeight(3);
  // stroke(232, 111, 238);
  // polylineB.display();

  //  //draw interpolated polyline periodically
  //  stroke(lerp(0, 232, 0.5 * (cos(frameCount * TWO_PI / period) + 1)),
  //    lerp(0, 111, 0.5 * (cos(frameCount * TWO_PI / period) + 1)),
  //    lerp(0, 238, 0.5 * (cos(frameCount * TWO_PI / period) + 1)));
  //  beginShape();
  //  for (let i = 0; i < polylineA.getLength(); i++) {
  //    let xval = lerp(polylineA.getPoint(i).x, polylineB.getPoint(i).x, 0.5 * (cos(frameCount * TWO_PI / period) + 1));
  //    let yval = lerp(polylineA.getPoint(i).y, polylineB.getPoint(i).y, 0.5 * (cos(frameCount * TWO_PI / period) + 1));
  //    vertex(xval, yval);
  //  }
  //  endShape();

  //draw interpolated polyline once
  stroke(lerp(0, 232, 0.5 * currentFrame /  period),
    lerp(0, 111, 0.5 * currentFrame /  period),
    lerp(0, 238, 0.5 * currentFrame /  period));
  beginShape();
  for (let i = 0; i < polylineA.getLength(); i++) {
    let xval = lerp(polylineA.getPoint(i).x, polylineB.getPoint(i).x, 0.5 * currentFrame /  period);
    let yval = lerp(polylineA.getPoint(i).y, polylineB.getPoint(i).y, 0.5 * currentFrame /  period);
    vertex(xval, yval);
  }
  endShape();

    //draw interpolated polyline once
    stroke(lerp(232, 0, 0.5 * currentFrame / period),
    lerp(111, 0, 0.5 * currentFrame / period),
    lerp(238, 0, 0.5 * currentFrame / period));
  beginShape();
  for (let i = 0; i < polylineA.getLength(); i++) {
    let xval = lerp(polylineB.getPoint(i).x, polylineA.getPoint(i).x,  0.5 * currentFrame / period);
    let yval = lerp(polylineB.getPoint(i).y, polylineA.getPoint(i).y, 0.5 * currentFrame / period);
    vertex(xval, yval);
  }
  endShape();

  

  textAlign(CENTER);
  noStroke()
  textSize(30);
  fill(232, 111, 238);
  text("WETLANDS", width / 4, height / 2 - 20);
  fill(0);
  text("URBAN", - width / 4, height / 2 - 20);
}

function scaleData(data, offsetX, offsetY) {
  let startX = data[0][0];
  let startY = data[0][1];
  let minX = startX;
  let minY = startY;
  let maxX = startX;
  let maxY = startY;

  console.log("initial min/max= ", minX, minY, maxX, maxY);

  //find min and max values for bounding box
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] < minX) { minX = data[i][0]; }
    if (data[i][1] < minY) { minY = data[i][1]; }
    if (data[i][0] > maxX) { maxX = data[i][0]; }
    if (data[i][1] > maxY) { maxY = data[i][1]; }
  }

  console.log("adjusted min/max= ", minX, minY, maxX, maxY);

  let boxWidth = abs(maxX - minX);
  let boxHeight = abs(maxY - minY);
  console.log("boxWidth= ", boxWidth);
  console.log("boxHeight= ", boxHeight);

  //finde the center of the bounding box
  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;

  //set scale factor based on bounding box
  let scaleFactor = max(boxWidth / (width / 2 - 100), boxHeight / (height - 100));
  console.log("scaleFactor= ", scaleFactor);

  for (let i = 0; i < data.length; i++) {
    data[i][0] = (data[i][0] - centerX) / scaleFactor + offsetX;
    data[i][1] = (data[i][1] - centerY) / scaleFactor + offsetY;
  }

  return data;

}