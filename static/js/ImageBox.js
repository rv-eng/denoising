/*!
    ImageBox.js
    Copyright (c) 2016 Jan Novak <novakj4@gmail.com> and Benedikt Bitterli <benedikt.bitterli@gmail.com>
    Released under the MIT license

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be included in all copies
    or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    The wheelzoom class is based on code written by Jack Moore.
    The original source code is released under the MIT license
    and can be found at http://www.jacklmoore.com/wheelzoom.
*/

var imageBoxSettings = {
    zoom: 0.1,
    width: 1024,
    height: 1024
};

window.wheelzoom2 = (function(){

    var canvas = document.createElement('canvas');
    var canvas2 = document.createElement('canvas');

    var main = function(img, image2, settings){
        if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

        var width;
        var height;
        var previousEvent;
        var cachedDataUrl;
        var cachedDataUrl2;

        function setSrcToBackground(img) {
            img.style.backgroundImage = 'url("'+img.src+'")';
            img.style.backgroundRepeat = 'no-repeat';
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            // canvas.height = Math.min(720, canvas.width * (img.imHeight / img.imWidth));
            img.bgOffsetX = (canvas.width - img.naturalWidth)/2;
            img.bgOffsetY = (canvas.height - img.naturalHeight)/2;
            cachedDataUrl = canvas.toDataURL();
            img.src = cachedDataUrl;

            reset();
        }

        function setSrcToBackground2(img) {
            img.style.backgroundImage = 'url("'+img.src+'")';
            img.style.backgroundRepeat = 'no-repeat';
            canvas2.width = img.naturalWidth;
            canvas2.height = img.naturalHeight;
            // canvas.height = Math.min(720, canvas.width * (img.imHeight / img.imWidth));
            img.bgOffsetX = (canvas.width - img.naturalWidth)/2;
            img.bgOffsetY = (canvas.height - img.naturalHeight)/2;
            cachedDataUrl2 = canvas2.toDataURL();
            img.src = cachedDataUrl2;

            // reset2();
        }        

        function updateBgStyle() {

            var minX = -img.bgOffsetX;
            var maxX = img.imWidth - img.bgWidth + img.bgOffsetX;
            if (img.bgWidth - img.bgOffsetX * 2 >= img.imWidth) {
                img.bgPosX = Math.max(Math.min(img.bgPosX, minX), maxX);
            } else {
                img.bgPosX = Math.min(Math.max(img.bgPosX, minX), maxX);
            }

            var minY = -img.bgOffsetY;
            var maxY = img.imHeight - img.bgHeight + img.bgOffsetY;
            if (img.bgHeight - img.bgOffsetY * 2 >= img.imHeight) {
                img.bgPosY = Math.max(Math.min(img.bgPosY, minY), maxY);
            } else {
                img.bgPosY = Math.min(Math.max(img.bgPosY, minY), maxY);
            }

            img.style.backgroundSize = img.bgWidth+'px '+img.bgHeight+'px';
            img.style.backgroundPosition = (img.bgOffsetX + img.bgPosX)+'px '+ (img.bgOffsetY + img.bgPosY)+'px';

            var minX = -image2.bgOffsetX;
            var maxX = image2.imWidth - image2.bgWidth + image2.bgOffsetX;
            if (image2.bgWidth - image2.bgOffsetX * 2 >= image2.imWidth) {
                image2.bgPosX = Math.max(Math.min(image2.bgPosX, minX), maxX);
            } else {
                image2.bgPosX = Math.min(Math.max(image2.bgPosX, minX), maxX);
            }

            var minY = -image2.bgOffsetY;
            var maxY = image2.imHeight - image2.bgHeight + image2.bgOffsetY;
            if (image2.bgHeight - image2.bgOffsetY * 2 >= image2.imHeight) {
                image2.bgPosY = Math.max(Math.min(image2.bgPosY, minY), maxY);
            } else {
                image2.bgPosY = Math.min(Math.max(image2.bgPosY, minY), maxY);
            }

            image2.style.backgroundSize = image2.bgWidth+'px '+image2.bgHeight+'px';
            image2.style.backgroundPosition = (image2.bgOffsetX + image2.bgPosX)+'px '+ (image2.bgOffsetY + image2.bgPosY)+'px';


            // // Apply anti-aliasing when not zoomed in too much, and when not viewing at a power of 2.
            // var globalZoomFactor = img.bgWidth / img.imWidth;
            // if (globalZoomFactor > 4 || (globalZoomFactor >= 1 && Math.log2(globalZoomFactor) % 1 < 0.001)) {
            //     img.className = "image-display pixelated";
            // } else {
            //     img.className = "image-display";
            // }
        }

        function reset() {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            img.bgOffsetX = (canvas.width - img.naturalWidth)/2;
            img.bgOffsetY = (canvas.height - img.naturalHeight)/2;

            if (canvas) {
                var zoomFactor = 2*Math.min(canvas.width / img.imWidth, canvas.height / img.imHeight);
            } else {
                var zoomFactor = 2;
            }

            img.bgWidth = canvas.width;
            img.bgHeight = canvas.height;
            img.bgPosX = (img.imWidth - img.bgWidth) / 2;
            img.bgPosY = (img.imHeight - img.bgHeight) / 2;

            image2.bgWidth = canvas.width;
            image2.bgHeight = canvas.height;
            image2.bgPosX = (image2.imWidth - image2.bgWidth) / 2;
            image2.bgPosY = (image2.imHeight - image2.bgHeight) / 2;

            updateBgStyle();
        }

        function onwheel(e) {
            var deltaY = 0;

            e.preventDefault();

            if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
                deltaY = -e.deltaY;
            } else if (e.wheelDelta) {
                deltaY = e.wheelDelta;
            }

            // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
            // We have to calculate the target element's position relative to the document, and subtrack that from the
            // cursor's position relative to the document.
            var rect = img.getBoundingClientRect();
            var offsetX = e.pageX - rect.left - window.pageXOffset - img.bgOffsetX;
            var offsetY = e.pageY - rect.top - window.pageYOffset - img.bgOffsetY;

            // Record the offset between the bg edge and cursor:
            var bgCursorX = offsetX - img.bgPosX;
            var bgCursorY = offsetY - img.bgPosY;

            // Use the previous offset to get the percent offset between the bg edge and cursor:
            var bgRatioX = bgCursorX/img.bgWidth;
            var bgRatioY = bgCursorY/img.bgHeight;

            var zoomFactor = 1 + settings.zoom;
            if (deltaY >= 0) {
                zoomFactor = 1 / zoomFactor;
            }

            img.bgWidth *= zoomFactor;
            img.bgHeight *= zoomFactor;

            // Take the percent offset and apply it to the new size:
            img.bgPosX = offsetX - (img.bgWidth * bgRatioX);
            img.bgPosY = offsetY - (img.bgHeight * bgRatioY);

            image2.bgWidth *= zoomFactor;
            image2.bgHeight *= zoomFactor;

            // Take the percent offset and apply it to the new size:
            image2.bgPosX = offsetX - (image2.bgWidth * bgRatioX);
            image2.bgPosY = offsetY - (image2.bgHeight * bgRatioY);

            updateBgStyle();
        }

        function drag(e) {
            e.preventDefault();
            img.bgPosX += (e.pageX - previousEvent.pageX);
            img.bgPosY += (e.pageY - previousEvent.pageY);

            image2.bgPosX += (e.pageX - previousEvent.pageX);
            image2.bgPosY += (e.pageY - previousEvent.pageY);

            previousEvent = e;
            updateBgStyle();
        }

        function removeDrag() {
            document.removeEventListener('mouseup', removeDrag);
            document.removeEventListener('mousemove', drag);
        }

        // Make the background draggable
        function draggable(e) {
            e.preventDefault();
            previousEvent = e;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', removeDrag);
        }

        function load() {
            if (img.src === cachedDataUrl) return;

            img.imWidth = img.naturalWidth;
            img.imHeight = img.naturalHeight;

            img.bgWidth = img.imWidth;
            img.bgHeight = img.imHeight;
            img.bgPosX = 0;
            img.bgPosY = 0;

            img.style.backgroundSize     = img.bgWidth+'px '+img.bgHeight+'px';
            img.style.backgroundPosition = img.bgPosX+' '+img.bgPosY;

            setSrcToBackground(img);

            img.addEventListener('wheelzoom.reset', reset);
            img.addEventListener('wheel', onwheel);
            img.addEventListener('mousedown', draggable);            

            if (image2.src === cachedDataUrl2) return;

            image2.imWidth = image2.naturalWidth;
            image2.imHeight = image2.naturalHeight;

            image2.bgWidth = image2.imWidth;
            image2.bgHeight = image2.imHeight;
            image2.bgPosX = 0;
            image2.bgPosY = 0;

            image2.style.backgroundSize     = image2.bgWidth+'px '+image2.bgHeight+'px';
            image2.style.backgroundPosition = image2.bgPosX+' '+image2.bgPosY;

            setSrcToBackground2(image2);

            image2.addEventListener('wheelzoom.reset', reset);
            image2.addEventListener('wheel', onwheel);
            image2.addEventListener('mousedown', draggable);
        }

        var destroy = function (originalProperties) {
            img.removeEventListener('wheelzoom.destroy', destroy);
            img.removeEventListener('wheelzoom.reset', reset);
            img.removeEventListener('load', load);
            img.removeEventListener('mouseup', removeDrag);
            img.removeEventListener('mousemove', drag);
            img.removeEventListener('mousedown', draggable);
            img.removeEventListener('wheel', onwheel);

            img.style.backgroundImage = originalProperties.backgroundImage;
            img.style.backgroundRepeat = originalProperties.backgroundRepeat;
            img.src = originalProperties.src;

            image2.removeEventListener('wheelzoom.destroy', destroy);
            image2.removeEventListener('wheelzoom.reset', reset);
            image2.removeEventListener('load', load);
            image2.removeEventListener('mouseup', removeDrag);
            image2.removeEventListener('mousemove', drag);
            image2.removeEventListener('mousedown', draggable);
            image2.removeEventListener('wheel', onwheel);

            image2.style.backgroundImage = originalProperties.backgroundImage2;
            image2.style.backgroundRepeat = originalProperties.backgroundRepeat2;
            image2.src = originalProperties.src2;
        }.bind(null, {
            backgroundImage: img.style.backgroundImage,
            backgroundRepeat: img.style.backgroundRepeat,
            src: img.src,
            backgroundImage2: image2.style.backgroundImage,
            backgroundRepeat2: image2.style.backgroundRepeat,
            src2: image2.src
        });

        img.addEventListener('wheelzoom.destroy', destroy);

        if (img.complete) {
            load();
        }

        img.addEventListener('load', load);

        // image2.addEventListener('wheelzoom.destroy', destroy);

        // if (image2.complete) {
        //     load();
        // }

        // image2.addEventListener('load', load);
    };

    // Do nothing in IE8
    if (typeof window.getComputedStyle !== 'function') {
        return function(elements) {
            return elements;
        };
    } else {
        return function(elements, elements2, settings) {
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, main, settings);
            } else if (elements && elements.nodeName) {
                main(elements, elements2,  settings);
            }
            return elements;
        };
    }
}());


var ImageBox = function(parent, config) {
    var self = this;

    var box = document.createElement('div');
    box.style += "font-family: "
    box.className = "image-box";

    // var h1 = document.createElement('h1');
    // h1.className = "title";
    // h1.appendChild(document.createTextNode("Images"));
    // box.appendChild(h1);

    // var help = document.createElement('div');
    // help.appendChild(document.createTextNode("Use mouse wheel to zoom in/out, click and drag to pan. Press keys [1], [2], ... , [W], [E] to switch between each method."));
    // help.className = "help";
    // box.appendChild(help);

    this.tree = [];
    this.selection = [];
    this.buildTreeNode(config, 0, this.tree, box);

    for (var i = 0; i < this.selection.length; ++i) {
        this.selection[i] = 0;
    }
    this.showContent(0, 0);
    parent.appendChild(box);

    document.addEventListener("keypress", function(event) { self.keyPressHandler(event); });
    this.lazyLoadImages();
}


// New method for lazy loading images
ImageBox.prototype.lazyLoadImages = function() {
    var lazyImages = [].slice.call(document.querySelectorAll('.lazy-load'));
    var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var image = entry.target;
                image.src = image.getAttribute('data-src');
        
                image.classList.remove('lazy-load');
                // wheelzoom(image, imageBoxSettings); // Apply wheelzoom after loading
                imageObserver.unobserve(image);
            }
        });
    }, {
        rootMargin: '10px'
    });

    lazyImages.forEach(function(image) {
        image.onerror = "this.src='" + image.getAttribute('data-src') + "';"
        imageObserver.observe(image);
    });
};

var gIdx;

ImageBox.prototype.buildTreeNode = function(config, level, nodeList, parent) {

    var self = this;

    var selectorGroup = document.createElement('div');
    selectorGroup.className = "selector-group";
    if (level == 0)
    {
        selectorGroup.className += " selector-top";
    }
    if (level == 1)
    {
        selectorGroup.className += " selector-other";
    }

    parent.appendChild(selectorGroup);
    row = document.createElement('div');
    row.className = "row";
    column1 = document.createElement('div');
    column1.className = "column";
    column2 = document.createElement('div');
    column2.className = "column";
    column3 = document.createElement('div');
    column3.className = "column";

    row.appendChild(column1);
    row.appendChild(column2);
    row.appendChild(column3);
    selectorGroup.appendChild(row);
    column1.className += " selector-title-other";
    column2.className += " selector-title-other";
    column3.className += " selector-title-other";

    var insets = [];

    config.shift();
    configIFIndex = 8;
    for (var i = 0; i < config.length; i++) {
        // Create tab
        var selector = document.createElement('div');
        selector.className = "selector selector-primary";
        // selector.className += (i == 0) ? " active" : "";

        selector.addEventListener("click", function(l, idx, event) {
            this.showContent(l, idx);
            gIdx = idx;
            // console.log('wtf, ', idx, gIdx, l);
        }.bind(this, level, i));

        // Add to tabs

        // Create content
        var contentNode = {};
        contentNode.children = [];
        contentNode.selector = selector;
        var content;
        if (typeof(config[i].elements) !== 'undefined') {
            selectorGroup.appendChild(selector);

            content = document.createElement('div');
            this.buildTreeNode(config[i].elements, level+1, contentNode.children, content);

            config[i].title = config[i].title.slice(0, -2)
            selector.appendChild(document.createTextNode(config[i].title));
            imageDiv = null;
        } else {
            content = document.createElement('img');
            content.className = "image-display pixelated";
            content.setAttribute('data-src', config[i].image);
            content.className += " lazy-load";
            content.slot = "first";

            content2 = document.createElement('img');
            content2.className = "image-display pixelated";
            content2.setAttribute('data-src', config[configIFIndex].image);
            content2.className += " lazy-load";
            content2.slot = "second";

            sliderContainer = document.createElement('div')
            sliderContainer.className = "slider-container";

            imageCompare = document.createElement('img-comparison-slider');
            imageCompare.className = "slider-example-focus";
            imageCompare.appendChild(content);
            imageCompare.appendChild(content2);

            imageDiv = document.createElement('div');
            imageDiv.className = "d-flex justify-content-center";
            sliderContainer.appendChild(imageCompare);
            imageDiv.appendChild(sliderContainer);

            wheelzoom2(content, content2, imageBoxSettings);
            var key = '';
            if (i < 9)
                key = i+1 + ": ";
            else if (i == 9)
                key = "0: ";
            else if (i == 10)
                key = "Q: ";
            else if (i == 11)
                key = "W: ";
            else if (i == 12)
                key = "E: ";

            content = imageCompare

            // selector.appendChild(document.createTextNode(key+config[i].title));
            var nn = config[i].title;

            if (nn === "IF")
            {
                nn = "Ours";
            }
            if (nn == "isik")
            {
                nn = "Isik";
            }
            if (nn == "noisy")
            {
                nn = "Noisy";
            }
            if (nn == "oidn")
            {
                nn = "OIDN";
            }
            if (nn == "albedo")
            {
                nn = "Albedo";
            }
            if (nn == "depth")
            {
                nn = "Depth";
            }
            if (nn == "normals")
            {
                nn = "Normals";
            }

            var n = nn;
            var textNode = document.createTextNode(n);
            selector.appendChild(textNode);

            if (i < 3)
            {
                column1.appendChild(selector);
            }
            else if (i < 5)
            {
                column2.appendChild(selector);
            }
            else
            {
                column3.appendChild(selector);
            }

            switch(nn) {
                case "Ours":
                    selector.classList.add("ours");
                    break;
                case "OIDN":
                    selector.classList.add("oidn");
                    break;
                case "AFGSA":
                    selector.classList.add("afgsa");
                    break;
                case "Isik":
                    selector.classList.add("isik");
                    break;
            }

            this.selection.length = Math.max(this.selection.length, level+1);

        }
        content.style.display = 'none';
        if (imageDiv !== null)
        {
            parent.appendChild(imageDiv);
        }
        else
        {
            parent.appendChild(content);
        }
        contentNode.content = content;
        nodeList.push(contentNode);
    }

    if (insets.length > 0) {
        var insetGroup = document.createElement('table');
        insetGroup.className = "insets";
        insetGroup.width = imageBoxSettings.width;
        var tr = document.createElement('tr');
        tr.className = "insets";
        insetGroup.appendChild(tr);

        for (var i = 0; i < insets.length; ++i) {
            var auxDiv = document.createElement('td');
            auxDiv.className = "insets";
            auxDiv.style.width = (imageBoxSettings.width / insets.length) + "px";
            auxDiv.appendChild(document.createTextNode(insets[i].name));
            auxDiv.appendChild(insets[i]);
            tr.appendChild(auxDiv);
        }
        parent.appendChild(insetGroup);
    }
}

ImageBox.prototype.showContent = function(level, idx) {
    var bgWidth = 0;
    var bgHeight = 0;
    var bgPosX = 0;
    var bgPosY = 0;
    var bgOffsetX = 0;
    var bgOffsetY = 0;
    var l = 0;
    var node = {};
    node.children = this.tree;
    while (node.children.length > 0 && node.children.length > this.selection[l]) {
        node = node.children[this.selection[l]];
        node.selector.classList.remove('active');
        node.selector.classList.add('selector-primary');
        node.content.style.display = 'none';
        if (l == this.selection.length-1) {
            bgWidth = node.content.bgWidth;
            bgHeight = node.content.bgHeight;
            bgPosX = node.content.bgPosX;
            bgPosY = node.content.bgPosY;
            bgOffsetX = node.content.bgOffsetX;
            bgOffsetY = node.content.bgOffsetY;
        }
        l += 1;
    }

    this.selection[level] = Math.max(0, idx);

    l = 0;
    node = {};
    node.children = this.tree;
    while (node.children.length > 0) {
        if (this.selection[l] >= node.children.length)
            this.selection[l] = node.children.length - 1;
        node = node.children[this.selection[l]];
        node.selector.classList.add('active'); // Add active class for the selected item
        node.selector.classList.remove('selector-primary'); // Optionally remove the primary class if it conflicts
        node.content.style.display = 'block';
        if (l == this.selection.length-1) {
            // Apply previously hidden background styles if needed
        }
        l += 1;
    }
}



ImageBox.prototype.keyPressHandler = function(event) {
    if (parseInt(event.charCode) == "0".charCodeAt(0)) {
        var idx = 9;
        this.showContent(this.selection.length-1, idx);
    }
    else if (parseInt(event.charCode) == "q".charCodeAt(0) || parseInt(event.charCode) == "Q".charCodeAt(0)) {
        var idx = 10;
        this.showContent(this.selection.length-1, idx);
    }
    else if (parseInt(event.charCode) == "w".charCodeAt(0) || parseInt(event.charCode) == "W".charCodeAt(0)) {
        var idx = 11;
        this.showContent(this.selection.length-1, idx);
    }
    else if (parseInt(event.charCode) == "e".charCodeAt(0) || parseInt(event.charCode) == "E".charCodeAt(0)) {
        var idx = 12;
        this.showContent(this.selection.length-1, idx);
    }
    else {
        var idx = parseInt(event.charCode) - "1".charCodeAt(0);
        this.showContent(this.selection.length-1, idx);
    }
}

ImageBox.prototype.mouseMoveHandler = function(event, image, insets) {
    var rect = image.getBoundingClientRect();
    var xCoord = ((event.clientX - rect.left) - image.bgOffsetX - image.bgPosX) / (image.bgWidth  / image.imWidth);
    var yCoord = ((event.clientY - rect.top)  - image.bgOffsetY - image.bgPosY) / (image.bgHeight / image.imHeight);

    var scale = 2;
    for (var i = 0; i < insets.length; ++i) {
        insets[i].style.backgroundSize = (image.imWidth * scale) + "px " + (image.imHeight*scale) + "px";
        insets[i].style.backgroundPosition = (insets[i].width/2  - xCoord*scale) + "px "
                                           + (insets[i].height/2 - yCoord*scale) + "px";
    }
}
