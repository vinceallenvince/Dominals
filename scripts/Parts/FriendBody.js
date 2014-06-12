function FriendBody(opt_options) {
  var options = opt_options || {};
  exports.Item.call(this, options);
}
exports.System.extend(FriendBody, exports.Item);

FriendBody.prototype._init = function(opt_options) {
  var options = opt_options || {};
  this.name = options.name || 'FriendBody';
  this.colorMode = options.colorMode || 'rgb';
  this.beforeStep = options.beforeStep || function() {};
};

/**
 * Applies forces to item.
 */
FriendBody.prototype.step = function() {
  this.beforeStep.call(this);
  this.location = this.parent.location;
};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @function map
 * @memberof FriendBody
 * @param {Object} obj An item.
 */
FriendBody.prototype.draw = function() {
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
 * @memberof FriendBody
 * @param {Object} props A map of object properties.
 * @returns {string} A string representing cssText.
 */
FriendBody.prototype.getCSSText = function(props) {
  return exports.System._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' +
      props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' +
      props.opacity + '; z-index: ' +
      props.zIndex + ';';
};

exports.FriendBody = FriendBody;
