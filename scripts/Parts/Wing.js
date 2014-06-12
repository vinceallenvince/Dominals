function Wing(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(Wing, exports.Item);

Wing.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'Wing';
  this.colorMode = options.colorMode || 'rgb';
  this._offsetCache = options._offsetCache || new exports.Vector();
    this.parentOffsetDistance = options.parentOffsetDistance || 0;
  this.parentOffsetAngle = options.parentOffsetAngle || 0;
};

/**
 * Applies forces to item.
 */
Wing.prototype.step = function() {

  if (this.parentOffsetDistance) {

    var r = this.parentOffsetDistance; // use angle to calculate x, y
    var theta = Signal.degreesToRadians(this.parent.angle + this.parentOffsetAngle);
    this._offsetCache.x = r * Math.cos(theta);
    this._offsetCache.y = r * Math.sin(theta);

    this.location.x = this.parent.location.x;
    this.location.y = this.parent.location.y;
    this.location.add(this._offsetCache); // position the child
    this.angle = this.parent.angle;
  } else {
    this.location = this.parent.location;
    this.angle = this.parent.angle;
  }
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof Wing
 * @param {Object} obj An item.
 */
Wing.prototype.draw = function() {
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
 * @memberof Wing
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
Wing.prototype.getCSSText = function(props) {
  return exports.System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' +
      props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' +
      props.opacity + '; z-index: ' +
      props.zIndex + ';';
};

exports.Wing = Wing;

