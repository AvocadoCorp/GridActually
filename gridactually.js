
/**
 * An animated grid of images that resizes to the viewport.
 *
 * @param {Object} options {
 *   allAtOnce: false (if true, show all images immediately on loading),
 *   debug: false (if true, log verbosely to the console),
 *   useFlip: true (if true, flip images during render)
 * }
 *
 * Requires jQuery.
 *
 * @constructor
 */
function GridActually(options) {
  this.IMAGE_SIZE = 200; // in pixels
  this.BOX_SIZE = 80; // in pixels
  this.IMAGE_WIDTH = 5400; // in pixels

  this.$img = $('.gridactually-image');
  this.$container = $('<div></div>').addClass('gridactually-container').insertAfter(this.$img);
  this.$el = $('<div></div>').addClass('gridactually').appendTo(this.$container);
  this.$overlay = $('<div></div>').addClass('gridactually-overlay').insertAfter(this.$container);

  /**
   * Number of images in the grid.
   * @type {Number}
   */
  this.imageTotal = Math.floor(this.IMAGE_WIDTH/this.IMAGE_SIZE);
  this.imageUrl = this.$img.attr('src');

  // Instance options
  this.allAtOnce = options ? options.allAtOnce : false;
  this.useFlip = options ? (options.useFlip === true || options.useFlip === undefined) : true;
  this.debug = options ? options.debug : false;

  // Only start drawing after the image loads.
  this.$img.one('load', $.proxy(this.draw, this)).each(function() {
    if (this.complete) $(this).load();
  });

  $(window).resize($.proxy(this.delayedDraw, this));

  if (this.debug) {
    console.log('Images', {
      url: this.imageUrl,
      total: this.imageTotal,
      totalWidth: this.IMAGE_WIDTH
    });
  }
}

GridActually.prototype.addAllBoxesAscending = function() {
  for (var i = 0; i < this.cells; i++) {
    this.addBoxToCell(i);
  }
};

/** @param {Number} cellNumber */
GridActually.prototype.addBoxToCell = function(cellNumber) {
  // Fill out the grid even if we don't have enough images.
  var imageNumber =  (cellNumber >= this.imageTotal)
    ? cellNumber - (Math.floor(cellNumber / this.imageTotal) * this.imageTotal)
    : cellNumber;

  this.makeBox(cellNumber, imageNumber);
};

/**
 * @param  {jQuery.Element} $boxEl
 * @param  {Number} cellNumber
 */
GridActually.prototype.appendBox = function($boxEl, cellNumber) {
  var $existingBox = this.$el.find('.box:nth-child(' + cellNumber + ')');

  if ($existingBox.length) {
    $existingBox.replaceWith($boxEl);
  } else {
    this.$el.append($boxEl);
  }

  var appendBoxFinal = $.proxy(this.appendBoxFinal, this, $boxEl);

  window.setTimeout(appendBoxFinal, this.allAtOnce ? 0 : 700);
};

/**
 * @param  {jQuery.Element} $boxEl
 */
GridActually.prototype.appendBoxFinal = function($boxEl) {
  this.unflipBox($boxEl);
  this.boxesDrawn++;
  if (this.boxesDrawn == this.cells) {
    this.triggerDrawComplete();
  }
};

/**
 * Use this to draw the grid in cases where you need to protect against
 * repeated draw calls in a short period of time. e.g. window.resize
 */
GridActually.prototype.delayedDraw = function() {
  if (this.drawTimeout) {
    window.clearInterval(this.drawTimeout);
  }

  this.$el.find('.box').hide();

  this.drawTimeout = window.setTimeout($.proxy(this.draw, this), 300);
};

GridActually.prototype.draw = function() {
  this.triggerDrawStart();
  this.boxesDrawn = 0;

  this.setDimensions();
  this.setOverlay();
  this.addAllBoxesAscending();
};

/**
 * @param {Number} cellNumber
 * @param {Number} imageNumber
 */
GridActually.prototype.makeBox = function(cellNumber, imageNumber) {
  if (this.debug) {
    console.log('Drawn!', {
      cellNumber: cellNumber,
      imageNumber: imageNumber
    });
  }

  var boxHtml = '<div class="box"><div class="images">' +
                '<div class="front"></div><div class="back"></div>' +
                '</div></div>';

  var $el = $(boxHtml);
  $el.find('.front').css({
    'background-image': 'url(' + this.imageUrl + ')',
    // Firefox can't set explicit axis values e.g. background-position-x
    'background-position': '-' + (this.BOX_SIZE * imageNumber) + 'px 0'
  });

  if (this.useFlip) {
    $el.addClass('flipped');
  }

  var sizeCss = {
    'width': this.BOX_SIZE + 'px',
    'height': this.BOX_SIZE + 'px'
  };

  $el.css(sizeCss).find('.front, .back').css(sizeCss);

  // Stagger appending, evenly.
  var animIntervalInMs = this.allAtOnce ? 0 : 5;
  window.setTimeout($.proxy(this.appendBox, this, $el, cellNumber),
                    cellNumber * animIntervalInMs);
};

GridActually.prototype.setDimensions = function() {
  this.columns = Math.ceil($(window).width()/this.BOX_SIZE);
  this.rows = Math.ceil($(window).height()/this.BOX_SIZE);
  this.cells = (this.columns * this.rows) + 1;

  this.$el.width(this.columns * this.BOX_SIZE)
          .height(this.rows * this.BOX_SIZE);

  if (this.debug) {
    console.log("DIMENSIONS", {
      columns: this.columns,
      rows: this.rows,
      cells: this.cells
    });
  }
};

GridActually.prototype.setOverlay = function() {
  this.$overlay.height(this.$el.height());
};

GridActually.prototype.triggerDrawComplete = function() {
  this.$el.trigger('GridActually:draw:complete');
};

GridActually.prototype.triggerDrawStart = function() {
  this.$el.trigger('GridActually:draw:start');
};

/** @param  {jQuery.Element} $boxEl */
GridActually.prototype.unflipBox = function($boxEl) {
  if (!this.useFlip) return;
  $boxEl.removeClass('flipped');
};

// Get things started.
$(document).ready(function() {
  new GridActually();
});

