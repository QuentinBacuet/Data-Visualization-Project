'use strict';

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
  return x;
};

helpers.LinearInterpolator2D = (p1, p2) => {
    return (t) => {
      let one_minus_t = 1 - t;
      let x = p1.x * one_minus_t + p2.x * t;
      let y = p1.y * one_minus_t + p2.y * t;
      return [x, y];
    };
}
