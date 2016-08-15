( function( doc, nav ) {

  var video, outputVideo, scratchContext, scratchCanvas, frame, backgroundData;

  function initialize() {

  // The source video.

    video = doc.getElementById( 'v' );
    outputVideo = doc.getElementById( 'greenv' );

  // The replacement image

    var backgroundCanvas = doc.getElementById( 'backcanvas' );
    var backgroundContext = backgroundCanvas.getContext( '2d' );
    var img = document.getElementById( 'bb' );
    backgroundContext.drawImage( img, 300, 300, 1000, 1000, 0, 0, 1000, 1000 );
    backgroundData = backgroundContext.getImageData( 0, 0, 820, 640 ).data;

  // The working canvas.

    scratchCanvas = doc.getElementById( 'c' );
    scratchContext = scratchCanvas.getContext( '2d' );

    nav.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia );

    // Get the webcam's stream.

    nav.getUserMedia( { video: true }, startStream, function() {} );
  }

  function startStream( stream ) {
    video.src = URL.createObjectURL( stream );
    video.play();

    createGreenStream();

    requestAnimationFrame( drawCanvasFrame );
  }

  function drawCanvasFrame() {

// render the green screen modified frames

    frame = readFrame();
    if ( frame ) {
      replaceGreen( frame );
      scratchContext.putImageData( frame, 0, 0 );
    }
    requestAnimationFrame( drawCanvasFrame );
  }

  function createGreenStream() {

// build the processed output video stream

    var outputStream = scratchCanvas.captureStream( 25 );
    outputVideo.src = URL.createObjectURL( outputStream );
    outputVideo.play();
  }

  function readFrame() {
    try {
      scratchContext.drawImage( video, 0, 0, video.width, video.height );
    } catch ( e ) {

      // The video may not be ready, yet.
      return null;
    }

// get the image data for the input video frame

    return scratchContext.getImageData( 0, 0, video.width, video.height );
  }

  function replaceGreen( frame ) {

    var len = frame.data.length;

    for ( var i = 0, j = 0; j < len; i++, j += 4 ) {

    // Convert from RGB to HSL...

      var hsl = rgb2hsl( frame.data[j], frame.data[j + 1], frame.data[j + 2] );
      var h = hsl[0], s = hsl[1], l = hsl[2];

    // ... and check if we have a somewhat green background

      if ( h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75 ) {

      //.. and replace with the background pixels

      frame.data[j] = backgroundData[ j ];
      frame.data[j + 1] = backgroundData[ j + 1 ];
      frame.data[j + 2] = backgroundData[ j + 2 ];
      frame.data[j + 3] = 255;
      }
    }
  }

  function rgb2hsl( r, g, b ) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min( r, g, b );
    var max = Math.max( r, g, b );
    var delta = max - min;
    var h, s, l;

    if ( max == min ) {
      h = 0;
    } else if ( r == max ) {
      h = ( g - b ) / delta;
    } else if ( g == max ) {
      h = 2 + ( b - r ) / delta;
    } else if ( b == max ) {
      h = 4 + ( r - g ) / delta;
    }

    h = Math.min( h * 60, 360 );

    if ( h < 0 ) {
      h += 360;
    }

    l = ( min + max ) / 2;

    if ( max == min ) {
      s = 0;
    } else if ( l <= 0.5 ) {
      s = delta / ( max + min );
    } else {
      s = delta / ( 2 - max - min );
    }

    return [ h, s * 100, l * 100 ];
  }

  addEventListener( 'DOMContentLoaded', initialize );

} ) ( document, navigator );
