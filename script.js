
window.addEventListener('load', function() {
    
    console.log('page is loaded');

   //Load the json data file 
   fetch('wetlands.json')
   .then(response => response.json())
   .then(data => {
        console.log(data);
        wetlandsFeaturesArray = data.features;
        wetlandsGeoArray = [];
        for (i = 0; i < wetlandsFeaturesArray.length; i++) {
            wetlandsGeoArray.push(wetlandsFeaturesArray[i].geometry.paths[0]);
        }
   })
   .catch(error => {
       console.log("Error!!! : " + error);
   })

   //Load the json data file 
   fetch('urban.json')
   .then(response => response.json())
   .then(data => {
        console.log(data);
        urbanFeaturesArray = data.features;
        urbanGeoArray = [];
        for (i = 0; i < urbanFeaturesArray.length; i++) {
            urbanGeoArray.push(urbanFeaturesArray[i].geometry.paths[0]);
        }
   })
   .catch(error => {
       console.log("Error!!! : " + error);
   })

})

/*----- p5 Code ------*/
//Declared in the Global Scope
let wetlandsFeaturesArray;
let urbanFeaturesArray;
let wetlandsGeoArray;
let urbanGeoArray;
// let cnv = createCanvas(800, 400);
//  cnv.parent('fluid-sketch-div');

// function setup(){
//     createCanvas(400,400);
//     background(220);
//     frameRate(1);
// }

// function draw(){
//     if (geometryArray){
//         // console.log(geometryArray);

//         // select a random path from the geometry Array and draw it
//         drawPath(geometryArray[floor(random(geometryArray.length))]);
//     }else {
//         console.log("Not yet");
//     }
// }

// function drawPath(pathData){
//     // for now, just console log the coordinates along the path
//     for (i = 0; i < pathData.length; i++) {
//         console.log(pathData[i]);
//     }

//     // eventually code for drawing a curve using path data could go here
// }

