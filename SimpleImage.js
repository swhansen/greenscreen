// Copyright 2015 Owen Astrachan, Drew Hilton, Susan Rodger, Robert Duvall
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Created by Nick Parlante
// Updated by Robert Duvall


// select acceptable mime types
globalAcceptedFileType = 'image.*';
// used as a label on the toggle button
globalToggleButtonText = '[See Image Fit to Window]';
// hack: image needed to seed "sized" image
//globaleEmptyImageLocation = 'cs101/js/cs101/empty.png';
globaleEmptyImageLocation = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAQAAAAnZu5uAAAAAXNSR0IArs4c6QAAABVJREFUeJxiYPgPhyQwAQAAAP//AwCgshjoJhZxhgAAAABJRU5ErkJggg=='


// Note there is an Image built in, so don't use that name.
// Represents one pixel in a SimpleImage, supports rgb get/set.
SimplePixel = function(image, x, y) {
    funCheck("SimplePixel", 3, arguments.length);
    this.simple_image = image;
    this.x = x;
    this.y = y;
};

SimplePixel.prototype = {
    constructor: SimplePixel,
    getX: function () {
        funCheck("getX", 0, arguments.length);
        return this.x;
    },
    getY: function () {
        funCheck("getY", 0, arguments.length);
        return this.y;
    },
    getRed: function () {
        funCheck("getRed", 0, arguments.length);
        return this.simple_image.getRed(this.x, this.y);
    },
    getGreen: function () {
        funCheck("getGreen", 0, arguments.length);
        return this.simple_image.getGreen(this.x, this.y);
    },
    getBlue: function () {
        funCheck("getBlue", 0, arguments.length);
        return this.simple_image.getBlue(this.x, this.y);
    },
    getAlpha: function () {
        funCheck("getAlpha", 0, arguments.length);
        return this.simple_image.getAlpha(this.x, this.y);
    },
    setRed: function (val) {
        funCheck("setRed", 1, arguments.length);
        this.simple_image.setRed(this.x, this.y, val);
    },
    setGreen: function (val) {
        funCheck("setGreen", 1, arguments.length);
        this.simple_image.setGreen(this.x, this.y, val);
    },
    setBlue: function (val) {
        funCheck("setBlue", 1, arguments.length);
        this.simple_image.setBlue(this.x, this.y, val);
    },
    setAlpha: function (val) {
        funCheck("setAlpha", 1, arguments.length);
        this.simple_image.setAlpha(this.x, this.y, val);
    },
    setAllFrom: function (pixel) {
        funCheck("setAllFrom", 1, arguments.length);
        this.simple_image.setRed(this.x, this.y, pixel.getRed());
        this.simple_image.setGreen(this.x, this.y, pixel.getGreen());
        this.simple_image.setBlue(this.x, this.y, pixel.getBlue());
        this.simple_image.setAlpha(this.x, this.y, pixel.getAlpha());
    },

    toString: function () {
        return "r:" + this.getRed() + " g:" + this.getGreen() + " b:" + this.getBlue();
    },
    // Render pixel as string
    getString: function () {
        return this.toString();
    }
};


// Makes an invisible canvas, inited either with a "foo.jpg" url,
// or an htmlImage from loadImage().
// maybe: could make this work with another SimpleImage too.
SimpleImage = function () {
    if (arguments.length == 0 || arguments.length > 2) {
        funCheck("SimpleImage", 1, arguments.length);
        return null;
    }
    // function map for to support "overloaded constructor"
    var funMap = [
        function () {
            // should not be called
            return null;
        },
        function (image) {
            switch (typeof image) {
				case "string":
					return loadImage(image);
				case "HTMLImageElement":
					return image;
				default:
					throwError('The name you used to create a SimpleImage was not correct: ' + image);
			}
        },
        function (width, height) {
            if (width > 0 && height > 0) {
                return createImage(width, height);
            }
            else {
                throwError('You tried to create a SimpleImage with a negative width or height [' + width + 'x' + height + ']');
            }
        }
    ];

    var htmlImage = funMap[arguments.length].apply(this, arguments);
    // append canvas
    var output = getOutput();
    var canvas = makeCanvas('canvas', visible=false);
    output.appendChild(canvas);
    if (! htmlImage.complete) {
		// BUGBUG: will leaving this out work in general practice??
        // alert("Image still loading -- may need to run again");
    }
    this.origWidth = htmlImage.width;
    this.origHeight = htmlImage.height;
    this.width = htmlImage.width;
    this.height = htmlImage.height;
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = canvas.getContext("2d");
	this.context.drawImage(htmlImage, 0, 0, this.width, this.height);
    // Do this last so it gets the actual image data.
	try {
	    this.imageData = this.context.getImageData(0, 0, this.width, this.height);
	}
	catch (err) {
		throwError('The name you used to create a SimpleImage was not correct: ' + arguments[0]);
	}
}


SimpleImage.prototype = {
    constructor: SimpleImage,
    getWidth: function () {
        funCheck("getWidth", 0, arguments.length);
        return this.width;
    },
    getHeight: function () {
        funCheck("getHeight", 0, arguments.length);
        return this.height;
    },
    getRed: function (x, y) {
        funCheck("getRed", 2, arguments.length);
        return this.imageData.data[this.getIndex("getRed", x, y)];
    },
    getGreen: function (x, y) {
        funCheck("getGreen", 2, arguments.length);
        return this.imageData.data[this.getIndex("getGreen", x, y) + 1];
    },
    getBlue: function (x, y) {
        funCheck("getBlue", 2, arguments.length);
        return this.imageData.data[this.getIndex("getBlue", x, y) + 2];
    },
    getAlpha: function (x, y) {
        funCheck("getAlpha", 2, arguments.length);
        return this.imageData.data[this.getIndex("getAlpha", x, y) + 3];
    },
    // Computes index into 1-d array, and checks correctness of x,y values
    getIndex: function (funName, x, y) {
        funCheck("getIndex", 3, arguments.length);
        rangeCheck(x, 0, this.width, funName, "x", "wide");
        rangeCheck(y, 0, this.height, funName, "y", "tall");
        return (Math.floor(x) + Math.floor(y) * this.width) * 4;
    },
    // Gets the pixel object for this x,y.
    // Changes to the pixel write back to the image.
    getPixel: function (x, y) {
        funCheck("getPixel", 2, arguments.length);
        rangeCheck(x, 0, this.width, "getPixel", "x", "wide");
        rangeCheck(y, 0, this.height, "getPixel", "y", "tall");
        return new SimplePixel(this, x, y);
    },

    setRed: function (x, y, value) {
        funCheck("setRed", 3, arguments.length);
        this.imageData.data[this.getIndex("getRed", x, y)] = clamp(value);
    },
    setGreen: function (x, y, value) {
        funCheck("setGreen", 3, arguments.length);
        this.imageData.data[this.getIndex("getGreen", x, y) + 1] = clamp(value);
    },
    setBlue: function (x, y, value) {
        funCheck("setBlue", 3, arguments.length);
        this.imageData.data[this.getIndex("getBlue", x, y) + 2] = clamp(value);
    },
    setAlpha: function (x, y, value) {
        funCheck("setAlpha", 3, arguments.length);
        this.imageData.data[this.getIndex("getAlpha", x, y) + 3] = clamp(value);
    },
    setPixel: function (x, y, pixel) {
        funCheck("setPixel", 3, arguments.length);
        rangeCheck(x, 0, this.width, "setPixel", "x", "wide");
        rangeCheck(y, 0, this.height, "setPixel", "y", "tall");
        this.setRed(x, y, pixel.getRed());
        this.setBlue(x, y, pixel.getBlue());
        this.setGreen(x, y, pixel.getGreen());
        this.setAlpha(x, y, pixel.getAlpha());
    },
    setSize: function (width, height) {
        funCheck("setSize", 2, arguments.length);
        if (width > 0 && height > 0) {
            flush(this.context, this.imageData);
            width = Math.floor(width);
            height = Math.floor(height);
            this.imageData = setSize(this.canvas, width, height);
            this.width = width;
            this.height = height;
            // reset size permanently
            this.origWidth = width;
            this.origHeight = height;
        }
        else {
            throwError("You tried to set the size of a SimpleImage to a negative width or height [" + width + "x" + height + "]");
        }
    },
    // Draws to the given canvas, setting its size.
    // Used to implement printing of an image.
    drawTo: function (toCanvas) {
        // BUGBUG: remove this ...
        if (this.zoom == 1) {
            toCanvas.width = this.width;
            toCanvas.height = this.height;
            toCanvas.origWidth = this.origWidth;
            toCanvas.origHeight = this.origHeight;
            toCanvas.zoom = 0;
        }
        else {
            toCanvas.width = this.origWidth;
            toCanvas.height = this.origHeight;
            toCanvas.origWidth = this.width;
            toCanvas.origHeight = this.height;
            toCanvas.zoom = 1;
        }
        flush(this.context, this.imageData);
        toCanvas.getContext("2d").drawImage(this.canvas, 0, 0, toCanvas.width, toCanvas.height);
    },
    // Export an image as an array of pixels for the for-loop.
    toArray: function () {
        funCheck("toArray", 0, arguments.length);
        var array = new Array();
        // 1. simple-way (this is as good or faster in various browser tests)
        // var array = new Array(this.getWidth() * this.getHeight()); // 2. alloc way
        // var i = 0;  // 2.
        // nip 2012-7  .. change to cache-friendly y/x ordering
        // Non-firefox browsers may benefit.
        for (var y = 0; y < this.getHeight(); y++) {
            for (var x = 0; x < this.getWidth(); x++) {
                  //array[i++] = new SimplePixel(this, x, y);  // 2.
                  array.push(new SimplePixel(this, x, y));  // 1.
            }
        }
        return array;
    },
    // Support iterator within for loops (eventually)
    values: function() {
        funCheck("values", 0, arguments.length);
        return this.toArray();
    }
};

// create an empty image of the given size
function createImage (width, height) {
    var imgData = makeHTMLImage(globaleEmptyImageLocation);
    imgData.width = width;
    imgData.height = height;
    console.log("creating image: " + imgData.width + "x" + imgData.height);
    return imgData;
	// BUGBUG: try this
	// var blankImage = dom.createElement("img");
    // Safari crashes without image data
    // blankImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
}

// Clamp values to be in the range 0..255. Used by setRed() et al.
function clamp (value) {
    return Math.max(0, Math.min(Math.floor(value), 255));
}

// Push accumulated local changes out to the screen
function flush (context, imageData) {
    context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
}

// Change the size of the image to the given, scaling the pixels.
function setSize (canvas, newWidth, newHeight) {
    var output = getOutput();
    var canvasNew = makeCanvas('canvas', visible=false);
    canvasNew.width = newWidth;
    canvasNew.height = newHeight;
    output.appendChild(canvasNew);
    // draw old canvas to new canvas
    var contextNew = canvasNew.getContext("2d");
    contextNew.drawImage(canvas, 0, 0, newWidth, newHeight);
    return contextNew.getImageData(0, 0, newWidth, newHeight);
}

// Set this image to be the same size to the passed in image.
// This image may end up a little bigger than the passed image
// to keep its proportions.
// Useful to set a back image to match the size of the front
// image for bluescreen.
function setSizeTo (fromImage, toImage) {
    if (fromImage.width) {
        var wScale = toImage.width / fromImage.width;
        var hScale = toImage.height / fromImage.height;
        var scale = Math.max(wScale, hScale);
        if (scale != 1) {
            setSize(fromImage.width * scale, fromImage.height * scale);
        }
    }
}
