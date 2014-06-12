function Pilot(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(Pilot, exports.Item);

Pilot.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'Pilot';
  this.colorMode = options.colorMode || 'rgb';
  this.borderColor = options.borderColor || [];
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowColor = options.boxShadowColor || [];
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.motorSpeed = options.motorSpeed || 0;
  this.beforeStep = options.beforeStep || function() {};
};

/**
 * Converts degrees to radians.
 *
 * @function degreesToRadians
 * @memberof Pilot
 * @param {number} degrees The degrees value to be converted.
 * @returns {number} A number in radians.
 */
Pilot.degreesToRadians = function(degrees) {
  if (typeof degrees !== 'undefined') {
    return 2 * Math.PI * (degrees/360);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Pilot.degreesToRadians is missing degrees param.');
    }
    return false;
  }
};

/**
 * Converts radians to degrees.
 *
 * @function radiansToDegrees
 * @memberof Pilot
 * @param {number} radians The radians value to be converted.
 * @returns {number} A number in degrees.
 */
Pilot.radiansToDegrees = function(radians) {
  if (typeof radians !== 'undefined') {
    return radians * (180/Math.PI);
  } else {
    if (typeof console !== 'undefined') {
      console.log('Error: Pilot.radiansToDegrees is missing radians param.');
    }
    return false;
  }
};

/**
 * Applies forces to item.
 */
Pilot.prototype.step = function() {

  this.beforeStep.call(this);

  // acceleration
  this.applyForce(exports.System.gravity);
  this.applyForce(exports.System.wind);
  if (this.seekTarget) {
    this.applyForce(this._seek(this.seekTarget));
  }

  // velocity
  this.velocity.add(this.acceleration);

  if (!this.velocity.mag()) {
    this.velocity.x = 1; // angle = 0;
    this.velocity.y = 0;
    this.velocity.normalize();
    this.velocity.rotate(Pilot.degreesToRadians(this.angle));
    this.velocity.mult(this.motorSpeed);
  }

  if (this.velocity.mag() > 0.1) {
    this.angle = Pilot.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
  }

  this.velocity.limit(this.maxSpeed, this.minSpeed);

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
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 * @private
 */
Pilot.prototype._seek = function(target) {

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
 * @memberof Pilot
 * @param {Object} obj An item.
 */
Pilot.prototype.draw = function() {
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
 * @memberof Pilot
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
Pilot.prototype.getCSSText = function(props) {
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

exports.Pilot = Pilot;