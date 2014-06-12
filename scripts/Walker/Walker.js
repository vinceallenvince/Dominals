function Walker(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(Walker, exports.Item);

Walker.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'Walker';
  this.colorMode = options.colorMode || 'rgb';
  this.checkWorldEdges = options.checkWorldEdges || false;
  this.perlinSpeed = typeof options.perlinSpeed === 'undefined' ? 0.005 : options.perlinSpeed;
  this.perlinTime = options.perlinTime || 0;
  this.perlinAccelLow = typeof options.perlinAccelLow === 'undefined' ? -0.075 : options.perlinAccelLow;
  this.perlinAccelHigh = typeof options.perlinAccelHigh === 'undefined' ? 0.075 : options.perlinAccelHigh;
  this.offsetX = typeof options.offsetX === 'undefined' ? Math.random() * 10000 : options.offsetX;
  this.offsetY = typeof options.offsetY === 'undefined' ? Math.random() * 10000 : options.offsetY;
};

/**
 * Re-maps a number from one range to another.
 *
 * @function map
 * @memberof Utils
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
Walker.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

/**
 * Applies forces to item.
 */
Walker.prototype.step = function() {

  this.perlinTime += this.perlinSpeed;

  this.acceleration.x =  Walker.map(SimplexNoise.noise(this.perlinTime + this.offsetX, 0, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);
  this.acceleration.y =  Walker.map(SimplexNoise.noise(0, this.perlinTime + this.offsetY, 0.1), -1, 1, this.perlinAccelLow, this.perlinAccelHigh);

  // velocity
  this.velocity.add(this.acceleration);

  // location
  this.location.add(this.velocity);
  if (this.checkWorldEdges) {
    this._checkWorldEdges();
  } else {
    this._wrapWorldEdges();
  }
  this.acceleration.mult(0);

};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof Walker
 * @param {Object} obj An item.
 */
Walker.prototype.draw = function() {
  var cssText = this.getCSSText({
    x: this.location.x - (this.width / 2),
    y: this.location.y - (this.height / 2),
    angle: this.angle,
    scale: this.scale || 1,
    width: this.width,
    height: this.height,
    color0: this.color[0],
    color1: this.color[1],
    color2: this.color[2],
    colorMode: this.colorMode,
    visibility: this.visibility,
    opacity: this.opacity,
    zIndex: this.zIndex
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof Walker
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
Walker.prototype.getCSSText = function(props) {
  return exports.System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' +
      props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' +
      props.opacity + '; z-index: ' +
      props.zIndex + ';';
};
