class Polyline {
  constructor() {
    this.lines = [];
  }

  createPolyline(pointData) {
    let totalLength = 0;
    this.lines = [];
    for (let i = 0; i < pointData.length - 1; i++) {
      totalLength += dist(pointData[i][0], pointData[i][1], pointData[i + 1][0], pointData[i + 1][1]);
    }

    for (let i = 0; i < pointData.length; i++) {
      let length = 0;
      for (let j = 0; j < i; j++) {
        length += dist(pointData[j][0], pointData[j][1], pointData[j + 1][0], pointData[j + 1][1]);
      }
      // console.log(i, distance);
      let value = length / totalLength;
      this.lines.push(new Point2D(pointData[i][0], pointData[i][1], value));
    }
  }

  getLength(){
    return this.lines.length;
  }
  
  addPoint(newPoint) {
    this.lines.push(newPoint);
  }

  getPoint(index) {
    return this.lines[index];
  }
  
  getAllPoints(){
    return this.lines;
  }

  setPoint(newPoint, index) {
    this.lines[index] = newPoint;
  }

  upSamplePolyline(totalPoints) {
    let newLine = new Polyline();

    // set all points to null
    for (let i = 0; i < totalPoints; i++) {
      newLine.addPoint(null);
    }

    // fill in positions of existing points based on value
    let usedIndices = [];
    for (let i = 0; i < this.lines.length; i++) {
      let index = floor((totalPoints - 1) * (this.lines[i].value / 1));
      newLine.setPoint(this.lines[i], index);
      usedIndices.push(index);
    }
    // console.log(usedIndices);


    //fill in missing points proportionately
    for (let i = 0; i < usedIndices.length - 1; i++) {
      let minIndex = usedIndices[i];
      let maxIndex = usedIndices[i + 1];
      let intervals = maxIndex - minIndex;

      for (let j = 1; j < intervals; j++) {
        newLine.setPoint(new Point2D(
            lerp(newLine.getPoint(minIndex).x, newLine.getPoint(maxIndex).x, j / intervals),
            lerp(newLine.getPoint(minIndex).y, newLine.getPoint(maxIndex).y, j / intervals),
            lerp(newLine.getPoint(minIndex).value, newLine.getPoint(maxIndex).value, j / intervals)),
          minIndex + j);
      }
    }
    this.lines = newLine.getAllPoints().slice(0);
  }

  display() {
    beginShape();
    for (let i = 0; i < this.lines.length; i++) {
      vertex(this.lines[i].x, this.lines[i].y);
    }
    endShape();
  }

}