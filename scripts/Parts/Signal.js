function Signal(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(Signal, exports.Item);

Signal.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'Signal';
  this.colorMode = options.colorMode || 'rgb';
  this.borderColor = [];
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector()
  this.boxShadowColor = options.boxShadowColor || [];
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this._offsetCache = options._offsetCache || new exports.Vector();
  this.parentOffsetDistance = options.parentOffsetDistance || 0;
  this.parentOffsetAngle = options.parentOffsetAngle || 0;
};

/**
 * Converts degrees to radians.
 *
 * @function degreesToRadians
 * @memberof Utils
 * @param {number} degrees The degrees value to be converted.
 * @returns {number} A number in radians.
 */
Signal.degreesToRadians = function(degrees) {
  if (typeof degrees !== 'undefined') {
    return 2 * Math.PI * (degrees/360);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Signal.degreesToRadians is missing degrees param.');
    }
    return false;
  }
};

/**
 * Applies forces to item.
 */
Signal.prototype.step = function() {

  if (this.parentOffsetDistance) {

    r = this.parentOffsetDistance; // use angle to calculate x, y
    theta = Signal.degreesToRadians(this.parent.angle + this.parentOffsetAngle);
    this._offsetCache.x = r * Math.cos(theta);
    this._offsetCache.y = r * Math.sin(theta);

    this.location.x = this.parent.location.x;
    this.location.y = this.parent.location.y;
    this.location.add(this._offsetCache); // position the child

    /*if (this.pointToParentDirection) {
      this.angle = Utils.radiansToDegrees(Math.atan2(this.parent.velocity.y, this.parent.velocity.x));
    }*/

  } else {
    this.location = this.parent.location;
  }

};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Signal.prototype._seek = function(target) {

  var world = this.world,
    desiredVelocity = exports.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width / 2) { // slow down to arrive at target
    var m = Utils.map(distanceToTarget, 0, world.width / 2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  desiredVelocity.sub(this.velocity);
  desiredVelocity.limit(this.maxSteeringForce);

  return desiredVelocity;
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof Signal
 * @param {Object} obj An item.
 */
Signal.prototype.draw = function() {
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
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor0: this.borderColor[0],
    borderColor1: this.borderColor[1],
    borderColor2: this.borderColor[2],
    borderRadius: this.borderRadius,
    boxShadowOffsetX: this.boxShadowOffset.x,
    boxShadowOffsetY: this.boxShadowOffset.y,
    boxShadowBlur: this.boxShadowBlur,
    boxShadowSpread: this.boxShadowSpread,
    boxShadowColor0: this.boxShadowColor[0],
    boxShadowColor1: this.boxShadowColor[1],
    boxShadowColor2: this.boxShadowColor[2],
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
 * @memberof Signal
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
Signal.prototype.getCSSText = function(props) {
  return exports.System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' +
      props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' +
      props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' +
      props.opacity + '; z-index: ' +
      props.zIndex + ';';
};

exports.Signal = Signal;
