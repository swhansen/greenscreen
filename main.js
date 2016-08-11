(function (doc, nav) {


  var video, videog, greenvideo, width, height, context, canvas, i, replaceImageData, frame;


var rCanvas, rContext;

  var imageObj;

  function initialize() {

    // The source video.

    video = doc.getElementById("v");
    greenvideo = doc.getElementById("greenv");

    width = video.width;
    height = video.height;

  // The replacement image

// create the replacement image canvas

    i = document.getElementById( 'replaceimage' );

//rCanvas = document.getElementById( 'foocanvas' );
//var rctx = rCanvas.getContext( '2d' );


//var ccc = doc.getElementById('foocanvas');
var ccc = document.createElement('canvas');
var cvs=ccc.getContext("2d");
cvs.width = i.width;
cvs.height = i.height;
cvs.drawImage(i, 10, 10 );
//cvs.getContext('2d').drawImage(i, 0, 0, i.width, i.height);

var pixelData = cvs.getContext('2d').getImageData( 10, 10, 50, 50 )
var pix = pixelData.data

for (var ii = 0, n = pix.length; i < n; i += 4) {
    pix[ii  ] = 255 - pix[ii  ]; // red
    pix[ii+1] = 255 - pix[ii+1]; // green
    pix[ii+2] = 255 - pix[ii+2]; // blue
    // i+3 is alpha (the fourth element)
}

console.log( pix );





////rCanvas = doc.getElementById("foocanvas");
//rContext = rCanvas.getContext("2d");
//
var rwidth = i.width;
var rheight = i.height;

//rContext.getContext('2d').drawImage(i, 0, 0, i.width, i.height);




    var rImagectx = i.getContext( '2d' );
    var rWidth = parseInt( i.getAttribute("width"));
    var rHeight = parseInt( i.getAttribute("height"));
    console.log( 'rImage:', rWidth, rHeight );


    replaceImageData = rImagectx.getImageData( 0, 0, rWidth, rHeight );


  // The target canvas.

     canvas = doc.getElementById("c");
     context = canvas.getContext("2d");

    nav.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

    // Get the webcam's stream.

    nav.getUserMedia({video: true}, startStream, function() {});

    //createGreenStream();
  }

  function startStream( stream ) {
    video.src = URL.createObjectURL( stream );
    greenvideo.src = URL.createObjectURL( stream );


    video.play();

    // Ready! Let's start drawing.
    createGreenStream();
    requestAnimationFrame( draw );
  }

  function draw() {
     frame = readFrame();

    if ( frame ) {
      replaceGreen( frame );


      context.putImageData( frame, 0, 0 );

    }

    // Wait for the next frame.

    requestAnimationFrame( draw );
   // createGreenStream( frame );
  }

  function createGreenStream() {
    var stream = canvas.captureStream( 25 );
    greenvideo.src = URL.createObjectURL( stream );




    greenvideo.play();
  }

  function readFrame() {
    try {
      context.drawImage( video, 0, 0, width, height );
    } catch (e) {
      // The video may not be ready, yet.
      return null;
    }

    return context.getImageData( 0, 0, width, height );
  }

  function replaceGreen( frame ) {

    var len = frame.data.length;

    for (var i = 0, j = 0; j < len; i++, j += 4) {

      // Convert from RGB to HSL...

      var hsl = rgb2hsl(frame.data[j], frame.data[j + 1], frame.data[j + 2]);
      var h = hsl[0], s = hsl[1], l = hsl[2];

      // ... and check if we have a somewhat green pixel.

      if (h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75) {

     // frame.data[j] =     replaceImageData[ j ];
     // frame.data[j + 1] = replaceImageData[ j + 1];
     // frame.data[j + 2] = replaceImageData[j + 2];
     // frame.data[j + 3] = 0;
     //console.log( 'replaceImageData-r:', frame.data[j] )

       frame.data[j] = 255;
       frame.data[j + 1] = 0;
       frame.data[j + 2] =  0;
       frame.data[j + 3] = 255;

      // return frame;

      }
    }
  }

  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max == min) {
      h = 0;
    } else if (r == max) {
      h = (g - b) / delta;
    } else if (g == max) {
      h = 2 + (b - r) / delta;
    } else if (b == max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    l = (min + max) / 2;

    if (max == min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
  }

  addEventListener("DOMContentLoaded", initialize);

} ) ( document, navigator );
