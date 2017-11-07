/**
 * @param {int} val a value in Z
 * @return {int} the value restricted to [min, max]
 */
const helpers = {};
helpers.clamp = function(val, min, max) {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  } else {
    return val;
  }
};

/**
 * @param {int} x a raw x value in pixels
 * @return {int} the value adapted to timeline origin
 */
helpers.relative_x = function(x) {
  return x - margins.left;
};
