function WingTip(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(WingTip, exports.Item);

WingTip.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'WingTip';
  this.colorMode = options.colorMode || 'rgb';
  this.borderColor = options.borderColor || [0, 0, 0];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'solid';
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowColor = options.boxShadowColor || [0, 0, 0];
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this._offsetCache = options._offsetCache || new exports.Vector();
  this.parentOffsetDistance = options.parentOffsetDistance || 0;
  this.parentOffsetAngle = options.parentOffsetAngle || 0;
};

/**
 * Applies forces to item.
 */
WingTip.prototype.step = function() {
  if (this.parentOffsetDistance) {

    var r = this.parentOffsetDistance; // use angle to calculate x, y
    var theta = Signal.degreesToRadians(this.parent.angle + this.parentOffsetAngle);
    this._offsetCache.x = r * Math.cos(theta);
    this._offsetCache.y = r * Math.sin(theta);

    this.location.x = this.parent.location.x;
    this.location.y = this.parent.location.y;
    this.location.add(this._offsetCache); // position the child

  } else {
    this.location = this.parent.location;
  }
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof WingTip
 * @param {Object} obj An item.
 */
WingTip.prototype.draw = function() {
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
    zIndex: this.zIndex,
    borderRadius: this.borderRadius
  });
  this.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @function getCSSText
 * @memberof WingTip
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
WingTip.prototype.getCSSText = function(props) {
  return exports.System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' +
      props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; ' +
      props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' +
      props.opacity + '; z-index: ' +
      props.zIndex + ';' + ');';
};

exports.WingTip = WingTip;
