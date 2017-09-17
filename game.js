(function () {
'use strict';

function html([first, ...strings], ...values) {
    // Weave the literal strings and the interpolations.
    // We don't have to explicitly handle array-typed values
    // because concat will spread them flat for us.
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )

    // Filter out interpolations which are null or undefined.  null is
    // loosely-equal only to undefined and itself.
    .filter(value => value != null)
    .join("");
}

function createStore(reducer) {
    let state = reducer();
    const roots = new Map();
    const prevs = new Map();

    function render() {
        for (const [root, component] of roots) {
            const output = component();

            // Poor man's Virtual DOM implementation :)  Compare the new output
            // with the last output for this root.  Don't trust the current
            // value of root.innerHTML as it may have been changed by other
            // scripts or extensions.
            if (output !== prevs.get(root)) {
                prevs.set(root, output);
                root.innerHTML = output;

                // Dispatch an event on the root to give developers a chance to
                // do some housekeeping after the whole DOM is replaced under
                // the root. You can re-focus elements in the listener to this
                // event. See example03.
                const event = new CustomEvent("render", { detail: state });
                root.dispatchEvent(event);
            }
        }
    }

    return {
        attach(component, root) {
            roots.set(root, component);
            render();
        },
        connect(component) {
            // Return a decorated component function.
            return (...args) => component(state, ...args);
        },
        dispatch(action, ...args) {
            state = reducer(state, action, args);
            render();
        },
    };
}

const TRANSITION_START = 100;
const TRANSITION_CHANGE_SCENE = 101;
const TRANSITION_END = 102;

// These are 0-based to make routing in App easier.
const SCENE_TITLE = 0;
const SCENE_INTRO = 1;
const SCENE_FIND = 2;
const SCENE_PLAY = 3;
const SCENE_SCORE = 4;
const SCENE_LEVELS = 5;
const SCENE_NOPASS = 6;

const INIT = 10;
const SAVE_SNAPSHOT = 11;
const WARN_IDLE = 12;
const VALIDATE_SNAPSHOT = 13;
const LOCK_POINTER = 14;
const TOGGLE_CLICKABLE = 15;

function merge(...objs) {
  return Object.assign({}, ...objs);
}

const init = {
  current_scene: SCENE_TITLE,
  // An array of the next scene's name and optional args.
  next: [SCENE_TITLE],
};

function navigation(state = init, action, args) {
  switch (action) {
    case TRANSITION_START: {
      return merge(state, { next: args  });
    }
    case TRANSITION_END: {
      return merge(state, { next: [null]});
    }
    case TRANSITION_CHANGE_SCENE: {
      const { next: [next_scene] } = state;
      return merge(state, { current_scene: next_scene });
    }
    default: {
      return state;
    }
  }
}

function hex_to_rgb(hex) {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map(
      el => el + el
    ).join('');
  }

  return hex.match(/.{1,2}/g).map(
    el => parseFloat((parseInt(el, 16) / 255).toFixed(2))
  );
}

function rgb_to_hex(vec) {
  return vec.reduce((sum, value) => {
    let val = (~~(value * 255)).toString(16);

    if (val.length === 1) {
      val = '0' + val;
    }

    return sum + val;
  }, '#');
}


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hsl_to_rgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * Credit: https://gist.github.com/mjackson/5311256
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;


/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */


/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */


/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new ARRAY_TYPE(3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */


/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */


/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */


/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */


/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */


/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */


/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */


/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */


/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */


/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */


/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */


/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */


/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */


/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */


/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */


/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */


/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */


/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Alias for {@link vec3.subtract}
 * @function
 */


/**
 * Alias for {@link vec3.multiply}
 * @function
 */


/**
 * Alias for {@link vec3.divide}
 * @function
 */


/**
 * Alias for {@link vec3.distance}
 * @function
 */


/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */


/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */


/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();

const V = Float32Array;

const zero = V.of(0, 0, 0);
const unit = V.of(1, 1, 1);
const left = V.of(1, 0, 0);
const up = V.of(0, 1, 0);
const forward = V.of(0, 0, 1);

const of = (...vals) => V.of(...vals);

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * 4x4 Matrix
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create$1() {
  let out = new ARRAY_TYPE(16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */


/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */


/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */



/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */


/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */


/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */


/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply$1(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */


/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/


/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */


/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */


/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */


/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */


/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */


/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON) {
    return mat4.identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */


/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */


/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */


/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */


/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */


/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */


/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Alias for {@link mat4.multiply}
 * @function
 */


/**
 * Alias for {@link mat4.subtract}
 * @function
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create$3() {
  let out = new ARRAY_TYPE(9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */


/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */


/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */


/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */


/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */


/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */


/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */


/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */


/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */


/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/


/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */


/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */


/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */


/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/


/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/


/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/


/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */


/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */


/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */


/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */


/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */




/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */


/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */


/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


/**
 * Alias for {@link mat3.multiply}
 * @function
 */


/**
 * Alias for {@link mat3.subtract}
 * @function
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create$4() {
  let out = new ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */


/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */


/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */


/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */


/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */


/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */


/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */


/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */


/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */


/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */


/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */


/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */


/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */


/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */


/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */


/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize$2(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */


/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */


/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */


/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */


/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */


/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Alias for {@link vec4.subtract}
 * @function
 */


/**
 * Alias for {@link vec4.multiply}
 * @function
 */


/**
 * Alias for {@link vec4.divide}
 * @function
 */


/**
 * Alias for {@link vec4.distance}
 * @function
 */


/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */


/**
 * Alias for {@link vec4.length}
 * @function
 */


/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */


/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach$1 = (function() {
  let vec = create$4();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create$2() {
  let out = new ARRAY_TYPE(4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */


/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */


/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply$2(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */


/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */


/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > 0.000001 ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */


/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */


/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */


/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */


/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */


/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */


/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */


/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */


/**
 * Alias for {@link quat.multiply}
 * @function
 */


/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */


/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */


/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */


/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */


/**
 * Alias for {@link quat.length}
 * @function
 */


/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */


/**
 * Alias for {@link quat.squaredLength}
 * @function
 */


/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize$1 = normalize$2;

/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = create();
  let xUnitVec3 = fromValues(1,0,0);
  let yUnitVec3 = fromValues(0,1,0);

  return function(out, a, b) {
    let dot$$1 = dot(a, b);
    if (dot$$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001)
        cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$$1;
      return normalize$1(out, out);
    }
  };
})();

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create$2();
  let temp2 = create$2();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = create$3();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize$1(out, fromMat3(out, matr));
  };
})();

// XXX gl-matrix has a bug in quat.setAxes:
// https://github.com/toji/gl-matrix/issues/234
// The following implementation changes the order of axes to match our
// interpretation.
function set_axes(out, left, up, forward) {
  const matrix = Float32Array.of(...left, ...up, ...forward);
  return normalize$1(out, fromMat3(out, matrix));
}

function to_radian(a) {
  return a * Math.PI / 180;
}

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

function create_float_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  return buffer;
}

function create_index_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_shader_object(shader_type, source) {
  const shader = gl.createShader(shader_type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
}

function create_program_object(vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }

  return program;
}

const default_options$1 = {
  components: [],
  skip: false,
};

class Entity {
  constructor(options = {}) {
    Object.assign(this, default_options$1, options);

    this.entities = new Set();
    this.components = new Map();

    this.add_components(options.components);
  }

  add_component(component) {
    component.entity = this;
    component.mount();
    this.components.set(component.constructor, component);
  }

  add_components(components = []) {
    components.forEach((component) => this.add_component(component));
  }

  get_component(component) {
    return this.components.get(component);
  }

  get_components(...components) {
    return components.map(component => this.get_component(component));
  }

  add(entity) {
    entity.parent = this;
    this.entities.add(entity);
  }

  update(tick_delta) {
    if (this.skip) {
      return;
    }

    const update_each = updatable => updatable.update(tick_delta);
    this.components.forEach(update_each);
    this.entities.forEach(update_each);
  }

  render(tick_delta) {
    if (this.skip) {
      return;
    }

    const render_each = renderable => renderable.render(tick_delta);
    this.components.forEach(render_each);
    this.entities.forEach(render_each);
  }
}

const default_options$3 = {
  entity: null
};

class Component {
  constructor(options) {
    Object.assign(this,  default_options$3, options);
  }

  /*
   * Called in Entity.add_component.
   *
   * Use this to intialize the component instance. this.entity is available
   * here.
   */
  mount() {
  }

  set(values) {
    Object.assign(this, values);
  }

  /*
   * Called on each tick.
   */
  update() {
  }

  /*
   * Called on each animation frame.
   */
  render() {
  }
}

const default_options$2 = {
  _scale: unit.slice(),
  _rotation: create$2(),

  scale: unit.slice(),
  position: zero.slice(),
  rotation: create$2()
};

class Transform extends Component {
  constructor(options) {
    super(Object.assign({
      matrix: create$1(),
      world_matrix: create$1(),
      world_to_self: create$1()
    },  default_options$2, options));
  }

  get up() {
    const out = this.matrix.slice(4, 7);
    return normalize(out, out);
  }

  get forward() {
    const out = this.matrix.slice(8, 11);
    return normalize(out, out);
  }

  set position(vec) {
    fromRotationTranslationScale(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return this.matrix.slice(12, 15);
  }

  set scale(vec) {
    this._scale = vec;
    fromRotationTranslationScale(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    fromRotationTranslationScale(this.matrix, quaternion, this.position, this.scale);
  }

  get rotation() {
    return this._rotation;
  }

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world_matrix and
    // the current entity's world_to_self to go from target's space to the
    // current entity space.
    const forward$$1 = zero.slice();
    subtract(forward$$1, target_position, this.position);
    normalize(forward$$1, forward$$1);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise. For any (x, y, z), the rotated
    // vector is (z, y, -x).
    const left$$1 = of(forward$$1[2], 0, -forward$$1[0]);
    normalize(left$$1, left$$1);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    const up$$1 = zero.slice();
    cross(up$$1, forward$$1, left$$1);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    const rotation = create$2();
    set_axes(rotation, left$$1, up$$1, forward$$1);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    const rotation = create$2();
    setAxisAngle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    multiply$2(rotation, this.rotation, rotation);
    this.rotation = rotation;
  }

  rotate_rl(rad) {
    this.rotate_along(up, rad);
  }

  rotate_ud(rad) {
    this.rotate_along(left, rad);
  }

  // XXX Add a relative_to attribute for interpreting the translation in spaces
  // other than the local space (relative to the parent).
  translate(vec) {
    const movement = zero.slice();
    add(movement, this.position, vec);
    this.position = movement;
  }

  get_view_matrix(out) {
    const look_at_vect = [];
    add(look_at_vect, this.position, this.forward);
    lookAt(out, this.position, look_at_vect, this.up);
    return out;
  }

  update() {
    if (this.entity.parent) {
      multiply$1(
        this.world_matrix,
        this.entity.parent.get_component(Transform).world_matrix,
        this.matrix
      );
    } else {
      this.world_matrix = this.matrix.slice();
    }

    invert(this.world_to_self, this.world_matrix);
  }
}

const default_options$4 = {
  material: null,
  vertices: [],
  indices: [],
  normals: [],
  color: 'fff',
  color_opacity: 1
};

class Render extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options$4, options);

    this.create_buffers();
  }

  set color(hex) {
    this._color = hex || 'fff';
    this.color_vec = [...hex_to_rgb(this._color), this.color_opacity];
  }

  get color() {
    return this._color;
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals)
    };
  }

  render() {
    this.material.render(this.entity);
  }
}

// When using arrow keys for rotation simulate the mouse delta of this value.
const KEY_ROTATION_DELTA = 3;

const default_options$5 = {
  keyboard_controlled: false,
  mouse_controlled: false,

  move_speed: 3.5,
  rotate_speed: .5,

  dir_desc: {
    87: 'f',
    65: 'l',
    68: 'r',
    83: 'b',
    69: 'u',
    81: 'd',
    38: 'pu',
    40: 'pd',
    39: 'yr',
    37: 'yl'
  }
};

class Move extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options$5, options);
  }

  handle_keys(tick_length, {f = 0, b = 0, l = 0, r = 0, u = 0, d = 0, pu = 0, pd = 0, yl = 0, yr = 0}) {
    const entity_transform = this.entity.get_component(Transform);
    const dist = tick_length / 1000 * this.move_speed;

    // The desired XZ direction vector in self space. This is what the user
    // wanted to do: walk forward/backward and left/right.
    const direction = of(l - r, 0, f - b);

    // Transform the input from self to local space.  If the user wanted to go
    // "left" in the entity's self space what does it mean in the local space?
    transformMat4(direction, direction, entity_transform.matrix);
    // Direction is now a point in the entity's local space. Subtract the
    // position to go back to a movement vector.
    subtract(direction, direction, entity_transform.position);

    // Up and down movement always happens relative to the local space
    // regardless of the current pitch of the entity.  This can be understood
    // as projecting the direction vector to the XZ plane first (Y = 0) and
    // then adding the Y input.
    direction[1] = (u - d);

    // Scale direction by this tick's distance.
    normalize(direction, direction);
    scale(direction, direction, dist);

    entity_transform.translate(direction);

    // Simulate mouse deltas for rotation.
    const mouse_delta = {
      x: yl * KEY_ROTATION_DELTA - yr * KEY_ROTATION_DELTA,
      y: pu * KEY_ROTATION_DELTA - pd * KEY_ROTATION_DELTA,
    };

    this.handle_mouse(tick_length, mouse_delta);
  }

  handle_mouse(tick_length, {x, y}) {
    const entity_transform = this.entity.get_component(Transform);
    // Check if there's any input to handle.
    if (x === 0 && y === 0) {
      return;
    }

    const time_delta = tick_length / 1000;
    const azimuth = this.rotate_speed * time_delta * x;
    const polar = this.rotate_speed * time_delta * y;

    // Polar (with the zenith being the Y axis) to Cartesian, but polar is
    // counted from Z to Y rather than from Y to Z, so we swap cos(polar) for
    // sin(polar) and vice versa.
    const forward$$1 = of(
      Math.cos(polar) * Math.sin(azimuth),
      Math.sin(polar),
      Math.cos(polar) * Math.cos(azimuth)
    );
    normalize(forward$$1, forward$$1);
    // Transform forward to the object's local coordinate space (relative to
    // the parent).
    transformMat4(forward$$1, forward$$1, entity_transform.matrix);
    entity_transform.look_at(forward$$1);
  }

  update(tick_length) {
    if (this.keyboard_controlled && this.entity.game) {
      const current_dirs = {};

      for (const [key_code, dir] of Object.entries(this.dir_desc)) {
        current_dirs[dir] = this.entity.game.get_key(key_code);
      }

      this.handle_keys(tick_length, current_dirs);
    }

    if (this.mouse_controlled && this.entity.game) {
      this.handle_mouse(tick_length, this.entity.game.mouse_delta);
    }
  }
}

const default_options$6 = {
  buffers: [],
  current_frame: 0,
  next_frame: 1,
  current_tick: 0,
  frame_time: 16
};

class Morph extends Component {
  constructor(options) {
    super(options);
    Object.assign(this,  default_options$6, options);

    if (this.frames && this.frames.length) {
      this.create_buffers();
    }
  }

  create_buffers() {
    this.number_of_frames = this.frames.length;
    this.entity.get_component(Render).buffers = this.frames.map(frame => ({
      vertices: create_float_buffer(frame.vertices),
      indices: create_index_buffer(frame.indices),
      qty: frame.indices.length,
      normals: create_float_buffer(frame.normals)
    }));
  }

  get_next_frame() {
    let current_frame = this.current_frame;
    current_frame++;
    return current_frame % this.number_of_frames;
  }

  update() {
    this.current_tick++;

    // frame_delta is an interpolation amount between current and
    // next frame vertices
    this.frame_delta = 1 - (this.current_tick % this.frame_time)/this.frame_time;

    if (!(this.current_tick % this.frame_time)) {
      this.current_frame = this.next_frame;
      this.next_frame = this.get_next_frame();
    }
  }
}

const default_options = {
  canvas,
  width: 800,
  height: 600,
  dom: document.body,
  fps: 60,
  running: true,
  fov: 60,
  near: 0.35,
  far: 85,
  clear_color: '#FFFFFF',
  light_position: zero.slice(),
  light_intensity: 0.6
};

const EVENTS = ["keydown", "keyup", "mousemove"];

class Game {
  constructor(options) {
    Object.assign(this, default_options, options);

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.dom.appendChild(canvas);

    this.reset();

    this.camera = new Entity({
      components: [
        new Transform(),
        new Move()
      ]
    });

    this.camera.game = this;

    this.projMatrix = create$1();
    this.viewMatrix = create$1();

    perspective(
      this.projMatrix,
      to_radian(this.fov),
      this.width / this.height,
      this.near,
      this.far
    );

    this.tick_delta = 1000 / this.fps;

    for (const event_name of EVENTS) {
      const handler_name = "on" + event_name;
      this[handler_name] = this[handler_name].bind(this);
      window.addEventListener(event_name, this[handler_name]);
    }

    if (this.running) {
      this.start();
    }

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  }

  get clear_color() {
    return this._clear_color;
  }

  set clear_color(hex) {
    this._clear_color = hex;
    const color_vec = hex_to_rgb(hex);

    gl.clearColor(
      color_vec[0],
      color_vec[1],
      color_vec[2],
      1
    );
  }

  stop() {
    this.running = false;
  }

  start() {
    this.running = true;
    this.last_tick = performance.now();
    window.requestAnimationFrame(frame_time => this.frame(frame_time));
  }

  reset() {
    this.entities = new Set();
    this.listeners = new Map();
    this.keys = {};
    this.mouse_delta = {x: 0, y: 0};
  }

  destroy() {
    for (const event_name of EVENTS) {
      window.removeEventListener(event_name, this[event_name]);
    }
  }

  emit(event_name, ...args) {
    if (this.listeners.has(event_name)) {
      for (const handler of this.listeners.get(event_name)) {
        handler(...args);
      }
    }
  }

  on(event_name, handler) {
    if (!this.listeners.has(event_name)) {
      this.listeners.set(event_name, new Set());
    }

    this.listeners.get(event_name).add(handler);
  }

  off(event_name, handler) {
    if (this.listeners.has(event_name)) {
      this.listeners.get(event_name).delete(handler);
    }
  }

  onkeydown(e) {
    this.keys[e.keyCode] = 1;
  }

  onkeyup(e) {
    this.keys[e.keyCode] = 0;
  }

  get_key(key_code) {
    // Make sure we return 0 for undefined, i.e. keys we haven't seen
    // pressed at all.
    return this.keys[key_code] || 0;
  }

  onmousemove(e) {
    // Accumulate the deltas for each mousemove event that that fired between
    // any two ticks. Our +X is left, +Y is up while the browser's +X is to the
    // right, +Y is down. Inverse the values by subtracting rather than adding.
    this.mouse_delta.x -= e.movementX;
    this.mouse_delta.y -= e.movementY;
  }

  frame(frame_time) {
    if (this.running) {
      window.requestAnimationFrame(frame_time => this.frame(frame_time));
    }

    if (frame_time > this.last_tick + this.tick_delta) {
      const accumulated_delta = frame_time - this.last_tick;
      const ticks_qty = Math.floor(accumulated_delta / this.tick_delta);
      this.perform_ticks(ticks_qty);
      this.render();
    }
  }

  perform_ticks(ticks_qty) {
    // Mouse delta is measured since the last time this.tick was run.  If there
    // is more than one tick to perform we need to scale the delta down to
    // maintain consistent movement.
    this.mouse_delta.x /= ticks_qty;
    this.mouse_delta.y /= ticks_qty;

    for (let i = 0; i < ticks_qty; i++) {
      this.last_tick = this.last_tick + this.tick_delta;
      this.update();
    }

    // Reset the mouse delta.
    this.mouse_delta.x = 0;
    this.mouse_delta.y = 0;
  }

  update() {
    this.emit('tick', this.last_tick);
    this.entities.forEach(entity => entity.update(this.tick_delta));
    this.camera.update(this.tick_delta);
    this.camera.get_component(Transform).get_view_matrix(this.viewMatrix);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(entity => entity.render());
    this.emit('afterrender');
  }

  add(entity) {
    entity.game = this;
    this.entities.add(entity);
  }

  remove(entity) {
    this.entities.delete(entity);
  }
}

class Tween {
  constructor(options) {
    this.to = options.to;
    this.time = options.time || 1000;
    this.game = options.game;
    this.object = options.object;
    this.property = options.property;
    this.cb = options.cb;
  }

  do_step(tick) {
    this.current_step = Math.min(
      1,
      ((tick - this.first_tick) / this.tick_delta) * this.step
    );
    this.action();
  }

  action() {}

  pre_start() {
    this.tick_delta = this.game.tick_delta;
    this.first_tick = this.game.last_tick;
    this.number_of_ticks = Math.ceil(this.time / this.tick_delta);
    this.step = 1 / this.number_of_ticks;
  }

  start() {
    this.pre_start();
    return new Promise((resolve) => {
      const bound = (tick) => {
        if (this.current_step === 1) {
          this.game.off('tick', bound);
          resolve();
        } else {
          this.do_step(tick, resolve);
        }
      };
      this.game.on('tick', bound);
    });
  }
}

class Material {
  constructor() {
    this.uniforms = {};
    this.attribs = {};
  }

  setup_program() {
    this.program = create_program_object(
      create_shader_object(
        gl.VERTEX_SHADER,
        this.get_shader_code(
          this.vertex_shader.variables,
          this.vertex_shader.body
        )
      ),
      create_shader_object(gl.FRAGMENT_SHADER,
        this.get_shader_code(
          this.fragment_shader.variables,
          this.fragment_shader.body
        ))
    );

    if (this.program.error) {
      console.log(this.program.error); return;
    }
  }

  get_uniforms_and_attrs(uniforms, attrs) {
    uniforms.forEach(uniform => {
      this.uniforms[uniform] = gl.getUniformLocation(this.program, uniform);
    });

    attrs.forEach(attr => {
      this.attribs[attr] = gl.getAttribLocation(this.program, attr);
    });
  }

  get_shader_code(variables, body) {
    return `
      precision mediump float;
      ${variables}

      void main()
      {
        ${body}
      }
    `;
  }

  // apply_shader(entity, game) {
  //
  // }

  render(entity) {
    let ent = entity;
    let game = ent.game;

    while(ent.parent && !game) {
      ent = ent.parent;
      game = ent.game;
    }

    const [entity_transform, entity_render] = entity.get_components(Transform, Render);

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniforms.p, gl.FALSE, game.projMatrix);
    gl.uniformMatrix4fv(this.uniforms.v, gl.FALSE, game.viewMatrix);
    // console.log(entity_transform.world_matrix, entity_render.color_vec);
    gl.uniformMatrix4fv(
      this.uniforms.w,
      gl.FALSE,
      entity_transform.world_matrix
    );

    gl.uniform4fv(
      this.uniforms.c,
      entity_render.color_vec
    );

    this.apply_shader(entity, game);
  }
}

const vertices = [
  0.5, 0.5, 0.5,
  0.5, 0.5, -0.5,
  0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
  -0.5, 0.5, -0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5
];

const indices = [
  0, 2, 1,
  2, 3, 1,
  4, 6, 5,
  6, 7, 5,
  8, 10, 9,
  10, 11, 9,
  12, 14, 13,
  14, 15, 13,
  16, 18, 17,
  18, 19, 17,
  20, 22, 21,
  22, 23, 21
];

const normals = [
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1
];

class Box extends Entity {
  constructor(options = {}) {
    options.components = [
      new Transform(),
      new Render({
        vertices,
        indices,
        normals,
        material: options.material
      })
    ];

    super(options);
  }
}

const vertices$1 = [
  -1,  0,  1,
   1,  0,  1,
   1, 0,  -1,
  -1, 0,  -1
];

const indices$1 = [
   0,  1,  3,
   3,  1,  2
];

const normals$1 = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0
];

class Plane extends Entity {
  constructor(options = {}) {
    options.components = [
      new Transform(),
      new Render({
        vertices: vertices$1,
        indices: indices$1,
        normals: normals$1,
        material: options.material
      })
    ];

    super(options);
  }
}

const t = 0.5 + Math.sqrt(5) / 2;
const vertices$2 = [
  -1, t,  0,
  1, t,  0,
  -1, -t,  0,
  1, -t,  0,
  0, -1, t,
  0, 1, t,
  0, -1, -t,
  0, 1, -t,
  t,  0, -1,
  t,  0, 1,
  -t,  0, -1,
  -t,  0, 1
];

const normals$2 = [
  -1, t,  0,
  1, t,  0,
  -1, -t,  0,
  1, -t,  0,
  0, -1, t,
  0, 1, t,
  0, -1, -t,
  0, 1, -t,
  t,  0, -1,
  t,  0, 1,
  -t,  0, -1,
  -t,  0, 1
];

const indices$2 = [
  0, 11, 5,
  0, 5, 1,
  0, 1, 7,
  0, 7, 10,
  0, 10, 11,
  1, 5, 9,
  5, 11, 4,
  11, 10, 2,
  10, 7, 6,
  7, 1, 8,
  3, 9, 4,
  3, 4, 2,
  3, 2, 6,
  3, 6, 8,
  3, 8, 9,
  4, 9, 5,
  2, 4, 11,
  6, 2, 10,
  8, 6, 7,
  9, 8, 1
];

class Sphere extends Entity {
  constructor(options = {}) {
    options.components = [
      new Transform(),
      new Render({
        vertices: vertices$2,
        indices: indices$2,
        normals: normals$2,
        material: options.material
      })
    ];

    super(options);
  }
  // TODO: https://github.com/hughsk/icosphere/blob/master/index.js
}

class BasicMaterial extends Material {
  constructor() {
    super();

    this.vertex_shader = {
      variables: `uniform mat4 p;
        uniform mat4 v;
        uniform mat4 w;
        uniform float frame_delta;
        uniform float do_morph;
        attribute vec3 P_current;
        attribute vec3 P_next;`,

      body: `if (do_morph == 1.0) {
        float next_frame_delta = 1.0 - frame_delta;
        gl_Position = p * v * vec4((w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz, 1.0);
      } else {
        gl_Position = p * v * vec4((w * vec4(P_current, 1.0)).xyz, 1.0);
      }`
    };

    this.fragment_shader = {
      variables: 'uniform vec4 c;',
      body: 'gl_FragColor = c;'
    };

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'c', 'frame_delta', 'do_morph'],
      ['P_current', 'P_next']
    );
  }

  apply_shader(entity) {
    const [render, morph] = entity.get_components(Render, Morph);
    let buffers = render.buffers;

    if (morph) {

      buffers = render.buffers[morph.current_frame];

      // next frame
      gl.bindBuffer(gl.ARRAY_BUFFER, render.buffers[morph.next_frame].vertices);
      gl.vertexAttribPointer(
        this.attribs.P_next,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.P_next);

      gl.uniform1f(this.uniforms.do_morph, 1);
      gl.uniform1f(this.uniforms.frame_delta, morph.frame_delta);

    } else {

      gl.uniform1f(this.uniforms.do_morph, 0);

    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.qty, gl.UNSIGNED_SHORT, 0);
  }
}

const basic = new BasicMaterial();

class PhongMaterial extends Material {
  constructor() {
    super();

    this.vertex_shader = {
      variables: `  uniform mat4 p;
        uniform mat4 v;
        uniform mat4 w;
        uniform float frame_delta;
        uniform float do_morph;
        attribute vec3 P_current;
        attribute vec3 P_next;
        attribute vec3 N_current;
        attribute vec3 N_next;
        varying vec3 fp;
        varying vec3 fn;`,

      body: `if (do_morph == 1.0) {
        float next_frame_delta = 1.0 - frame_delta;
        fp = (w * vec4(P_next * next_frame_delta + P_current * frame_delta, 1.0)).xyz;
        fn = (w * vec4(N_next * next_frame_delta + N_current * frame_delta, 0.0)).xyz;
      } else {
        fp = (w * vec4(P_current, 1.0)).xyz;
        fn = (w * vec4(N_current, 0.0)).xyz;
      }
      gl_Position = p * v * vec4(fp, 1.0);`
    };

    this.fragment_shader = {
      variables: `uniform vec3 lp;
        uniform vec4 c;
        uniform vec2 li;
        varying vec3 fp;
        varying vec3 fn;`,

      body: `gl_FragColor = vec4(c.rgb * li.x + li.y * max(dot(fn, normalize(lp - fp)), 0.0), c.a);`
    };

    this.setup_program();
    this.get_uniforms_and_attrs(
      ['p', 'v', 'w', 'lp', 'li', 'c', 'do_morph', 'frame_delta'],
      ['P_current', 'P_next', 'N_current', 'N_next']
    );
  }

  apply_shader(entity, game) {
    const [render, morph] = entity.get_components(Render, Morph);
    let buffers = render.buffers;

    if (morph) {

      buffers = render.buffers[morph.current_frame];

      // next frame
      gl.bindBuffer(gl.ARRAY_BUFFER, render.buffers[morph.next_frame].vertices);
      gl.vertexAttribPointer(
        this.attribs.P_next,
        3, gl.FLOAT, gl.FALSE,
        0, 0
      );
      gl.enableVertexAttribArray(this.attribs.P_next);

      gl.uniform1f(this.uniforms.do_morph, 1);
      gl.uniform1f(this.uniforms.frame_delta, morph.frame_delta);

    } else {

      gl.uniform1f(this.uniforms.do_morph, 0);

    }

    // current frame
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(
      this.attribs.P_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );

    gl.enableVertexAttribArray(this.attribs.P_current);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      this.attribs.N_current,
      3, gl.FLOAT, gl.FALSE,
      0, 0
    );
    gl.enableVertexAttribArray(this.attribs.N_current);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.qty, gl.UNSIGNED_SHORT, 0);

    gl.uniform3fv(this.uniforms.lp, game.light_position);
    gl.uniform2fv(this.uniforms.li, [game.light_intensity, 1 - game.light_intensity]);
  }
}

const phong = new PhongMaterial();

const base_seed = 19870306 * 6647088;

let seed = base_seed;

function set_seed(new_seed) {
  seed = new_seed;
}

const rand = function() {
  seed = seed * 16807 % 2147483647;
  return (seed - 1) / 2147483646;
};

function integer(min = 0, max = 1) {
  return Math.floor(rand() * (max - min + 1) + min);
}

function float(min = 0, max = 1) {
  return rand() * (max - min) + min;
}

function element_of(arr) {
  return arr[integer(0, arr.length - 1)];
}

/*
 * Random position inside of a circle.
 */
function position([x, z], max_radius, y = 1.5) {
  const angle = float(0, Math.PI * 2);
  const radius = float(0, max_radius);
  return of(
    x + radius * Math.cos(angle),
    y,
    z + radius * Math.sin(angle)
  );
}

function look_at_target(matrix) {
  const azimuth = float(-Math.PI/10, Math.PI/10);
  const polar = float(0, Math.PI / 10);

  const target = of(
    Math.cos(polar) * Math.sin(azimuth),
    Math.sin(polar),
    Math.cos(polar) * Math.cos(azimuth)
  );
  normalize(target, target);
  return transformMat4(target, target, matrix);
}

const element = (i, color, type) => {
  let elements = [];
  const sign_x = Math.cos(i * Math.PI);
  const sign_z = Math.cos(i * Math.PI);
  const x = 75 + 100 * Math.sin(i * Math.PI / 6);

  switch (type) {
    case 0:
    case 1:
      // building
      let buildings = integer(0, 2);

      while (buildings--) {
        const scale_y = integer(5, 80);
        const scale_x = integer(5, 80);
        const element = new Box();

        element.get_component(Render).set({
          material: basic,
          color,
        });
        element.get_component(Transform).set({
          position: [(sign_x * x) + scale_x, scale_y/2, sign_z * 20 * i],
          scale: [scale_x, scale_y, integer(5, 80)]
        });

        elements.push(element);
      }
      break;
    case 2:
      // tree
      const crown = new Sphere();
      const trunk = new Box();

      const trunk_scale_y = integer(12, 17);
      trunk.get_component(Transform).set({
        position: [sign_x * x, trunk_scale_y/2, sign_z * 20 * i],
        scale: [1, trunk_scale_y, 1]
      });
      trunk.get_component(Render).set({
        material: basic,
        color,
      });
      elements.push(trunk);

      const crown_scale = integer(2, 7);
      crown.get_component(Transform).set({
        position: [sign_x * x, trunk_scale_y, sign_z * 20 * i],
        scale: [crown_scale, crown_scale, crown_scale]
      });
      crown.get_component(Render).set({
        material: basic,
        color,
      });
      elements.push(crown);
      break;
    case 3:
      const spawner = new Box();
      spawner.get_component(Render).set({
        color: '#000000',
        material: basic
      });
      spawner.get_component(Transform).set({
        position: [0, 1, 0]
      });
      elements.push(spawner);
      break;
  }

  return elements;
};

// XXX Add these functions to cervus/math.

function dot$3(a, b) {
  return a.reduce((acc, cur, idx) => acc + cur * b[idx], 0);
}

function magnitude(a) {
  return Math.sqrt(dot$3(a, a));
}

function distance$2(a, b) {
  const dist = zero.slice();
  subtract(dist, a, b);
  return magnitude(dist);
}

class DummyLookAt extends Transform {
  update() {
    this.position = this.entity.get_component(Transform).position;
    this.look_at(this.target.position);
  }
}

/*
 * Descending quarter circle for x in [0, 1].
 */
function smooth(x) {
  return Math.sqrt(Math.pow(1 - x, 2));
}

function position_score(target, current, world_size) {
  const dist = distance$2(target, current);
  const max_distance = Math.sqrt(world_size * world_size) / 2;
  return Math.max(0, 1 - dist / max_distance);
}

function rotation_score(target, current) {
  return Math.abs(dot$3(target, current));
}

/*
 * Calculate the hint in range [0, 1].
 *
 * This takes into account the fact that the user might be looking _at_ the
 * target, too.  The hint is only used to scale the luminance of the world.
 */
function get_hint(target, camera, world_size) {
  const transform = camera.get_component(Transform);
  const dummy = camera.get_component(DummyLookAt);

  const p = position_score(target.position, transform.position, world_size);
  const current = rotation_score(target.rotation, transform.rotation);
  const to_target = rotation_score(transform.rotation, dummy.rotation);

  // Weigh the current rotation on an ascending quarter circle and the
  // to_target rotation on a descending one.  The sum of the weights is
  // always 1.  This essentially translates to:  the closer to the target the
  // user is, the more the alignment with the target's rotation counts, and the
  // less the fact that they're looking _at_ the target does.
  const r = current * (1 - smooth(p)) + to_target * smooth(p);

  // Halve the average so that the hint in not too obvious.
  return (p + r) / 2 / 2;
}

/*
 * Calculate the final score for the level in range [0, 1].
 */
function get_score(target, camera, world_size) {
  const transform = camera.get_component(Transform);

  const p = position_score(target.position, transform.position, world_size);
  const r = rotation_score(target.rotation, transform.rotation);

  // See https://slack-files.com/T137YH5CK-F70S69J0J-51a91c0eaa
  // The division normalizes the result in the [0, 1] range.
  return (p * Math.sin(r) + r * Math.sin(p)) / (2 * Math.sin(1));
}

const bird_model_vertices = [
  [0, 1, 0.0432336, 0, 2.66717, -0.0897549, -0.311383, 2.19602, 0.234146, -0.63757, 1.36243, 0.125756, -2.39534, 2.44478, -0.378434, -1.73172, -1.46682, -0.378434, -0.891271, -1.67049, 0.125756, -2.88463, -2.81215, 0.125755, 0, -3.5, 0.108391, 0, -1.67049, -0.39161, -1.59801, -4.78739, 0.125755, 0, -5.27165, 0.234146, -2.39534, 2.44478, -0.126923, -3.45125, 2.35058, -3.40775, -1.73172, -1.46682, -0.126923, -3.10363, 0.637105, -3.60768, 0, 1, 0.40839, 0, -1.67049, 0.464128, 0, -2.87961, 0.359902, 0, 2.16981, 0.60839, 0, 1, 0.0432336, 0, 2.66717, -0.0897549, 0.311383, 2.19602, 0.234146, 0.63757, 1.36243, 0.125756, 2.39534, 2.44478, -0.378434, 1.73172, -1.46682, -0.378434, 0.891271, -1.67049, 0.125756, 2.88463, -2.81215, 0.125755, 0, -3.5, 0.108391, 0, -1.67049, -0.39161, 1.59801, -4.78739, 0.125755, 0, -5.27165, 0.234146, 2.39534, 2.44478, -0.126923, 3.45125, 2.35058, -3.40775, 1.73172, -1.46682, -0.126923, 3.10363, 0.637105, -3.60768, 0, 1, 0.40839, 0, -1.67049, 0.464128, 0, -2.87961, 0.359902, 0, 2.16981, 0.60839],
  // [0, 1, -0.0651568, 0, 2.66717, -0.198145, -0.311383, 2.19602, 0.125756, -0.63757, 1.36243, 0.125756, -2.73117, 2.7172, 0.268059, -1.87832, -1.46682, 0.268059, -0.891271, -1.67049, 0.125756, -2.88463, -2.81215, 0.125755, 0, -3.5, 1.19209e-7, 0, -1.67049, -0.5, -1.59801, -4.78739, 0.125755, 0, -5.27165, 0.125755, -2.73117, 2.7172, 0.51957, -6.61669, 2.97823, -0.513461, -1.87832, -1.46682, 0.51957, -6.56954, 1.24407, -0.513461, 0, 1, 0.3, 0, -1.67049, 0.355737, 0, -2.87961, 0.251511, 0, 2.16981, 0.5, 0, 1, -0.0651568, 0, 2.66717, -0.198145, 0.311383, 2.19602, 0.125756, 0.63757, 1.36243, 0.125756, 2.73117, 2.7172, 0.268059, 1.87832, -1.46682, 0.268059, 0.891271, -1.67049, 0.125756, 2.88463, -2.81215, 0.125755, 0, -3.5, 1.19209e-7, 0, -1.67049, -0.5, 1.59801, -4.78739, 0.125755, 0, -5.27165, 0.125755, 2.73117, 2.7172, 0.51957, 6.61669, 2.97823, -0.513461, 1.87832, -1.46682, 0.51957, 6.56954, 1.24407, -0.513461, 0, 1, 0.3, 0, -1.67049, 0.355737, 0, -2.87961, 0.251511, 0, 2.16981, 0.5],
  [0, 1, -0.18593, 0, 2.66717, -0.318919, -0.311383, 2.19602, 0.00498234, -0.63757, 1.36243, 0.125756, -2.13574, 2.71753, 0.924384, -1.27253, -1.44252, 0.497551, -0.891271, -1.67049, 0.125756, -2.88463, -2.81215, 0.125755, 0, -3.5, -0.120773, 0, -1.67049, -0.620773, -1.59801, -4.78739, 0.125755, 0, -5.27165, 0.00498211, -2.13066, 2.69291, 1.17464, -5.74559, 1.12196, 4.29641, -1.26745, -1.46715, 0.747802, -5.69843, -0.612202, 4.29641, 0, 1, 0.179227, 0, -1.67049, 0.234964, 0, -2.87961, 0.130738, 0, 2.16981, 0.379227, 0, 1, -0.18593, 0, 2.66717, -0.318919, 0.311383, 2.19602, 0.00498234, 0.63757, 1.36243, 0.125756, 2.13574, 2.71753, 0.924384, 1.27253, -1.44252, 0.497551, 0.891271, -1.67049, 0.125756, 2.88463, -2.81215, 0.125755, 0, -3.5, -0.120773, 0, -1.67049, -0.620773, 1.59801, -4.78739, 0.125755, 0, -5.27165, 0.00498211, 2.13066, 2.69291, 1.17464, 5.74559, 1.12196, 4.29641, 1.26745, -1.46715, 0.747802, 5.69843, -0.612202, 4.29641, 0, 1, 0.179227, 0, -1.67049, 0.234964, 0, -2.87961, 0.130738, 0, 2.16981, 0.379227]
];

const bird_model_indices = [2, 1, 0, 6, 3, 0, 6, 0, 9, 2, 0, 3, 2, 1, 0, 6, 3, 0, 6, 0, 9, 2, 0, 3, 19, 1, 2, 19, 1, 2, 2, 16, 19, 2, 16, 19, 2, 3, 16, 2, 3, 16, 16, 3, 6, 16, 6, 17, 16, 3, 6, 16, 6, 17, 7, 18, 17, 7, 17, 6, 7, 18, 17, 7, 17, 6, 10, 11, 18, 10, 18, 7, 10, 11, 18, 10, 18, 7, 8, 11, 10, 8, 10, 7, 8, 11, 10, 8, 10, 7, 9, 8, 7, 9, 8, 7, 9, 7, 6, 9, 7, 6, 6, 5, 4, 6, 4, 3, 14, 5, 6, 12, 14, 6, 12, 6, 3, 6, 5, 4, 6, 4, 3, 14, 5, 6, 12, 14, 6, 12, 6, 3, 4, 12, 3, 4, 12, 3, 5, 13, 4, 13, 12, 4, 5, 13, 4, 13, 12, 4, 15, 14, 12, 15, 12, 13, 15, 14, 12, 15, 12, 13, 14, 15, 5, 14, 15, 5, 5, 15, 13, 5, 15, 13, 20, 21, 22, 29, 20, 23, 23, 20, 22, 20, 21, 22, 29, 20, 23, 23, 20, 22, 22, 21, 39, 22, 21, 39, 36, 23, 22, 39, 36, 22, 36, 23, 22, 39, 36, 22, 37, 23, 36, 37, 23, 36, 26, 37, 38, 37, 26, 23, 26, 37, 38, 37, 26, 23, 23, 25, 26, 26, 27, 28, 26, 28, 29, 26, 38, 27, 29, 23, 26, 26, 25, 34, 23, 26, 34, 23, 25, 26, 26, 27, 28, 26, 28, 29, 26, 38, 27, 29, 23, 26, 26, 25, 34, 23, 26, 34, 27, 38, 30, 27, 30, 28, 27, 38, 30, 27, 30, 28, 38, 31, 30, 38, 31, 30, 30, 31, 28, 30, 31, 28, 33, 32, 34, 33, 34, 35, 23, 34, 32, 25, 35, 34, 33, 32, 34, 33, 34, 35, 23, 34, 32, 25, 35, 34, 24, 33, 35, 24, 32, 33, 24, 33, 35, 24, 32, 33, 23, 32, 24, 23, 32, 24, 23, 24, 25, 23, 24, 25, 24, 35, 25, 24, 35, 25];

class VecTween extends Tween {
  action() {
    const _from = [];
    lerp(_from, this.from, this.to, this.current_step);
    this.object[this.property] = _from;
  }

  pre_start() {
    super.pre_start();
    this.from = this.object[this.property].slice();
  }
}

// Audio doesn't use the seeded RNG from ./random because we don't know how
// much time the user is playing and how many notes will play.

function integer$1(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function element_of$1(arr) {
  return arr[integer$1(0, arr.length - 1)];
}

const context = new AudioContext();

// https://en.wikipedia.org/wiki/Piano_key_frequencies
const notes = [
  // The "A" harmonic minor scale.
  220,       // A3
  246.942,   // B
  261.626,   // C
  293.665,   // D
  329.628,   // E
  349.228,   // F
  //391.995, // G
  415.305,   // G#
  440        // A4

  // The "A" minor pentatonic scale.
  // 440,       // A4
  // 523.251,   // C
  // 587.33,    // D
  // 659.255,   // E
  // 783.991,   // G

];

function impulse(duration, decay) {
  const length = context.sampleRate	* duration;
  const impulse = context.createBuffer(2, length, context.sampleRate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }

  return impulse;

}

// Soften the high tones.
const biquad_filter = context.createBiquadFilter();
biquad_filter.type = "lowpass";
biquad_filter.frequency.value = 100;
biquad_filter.Q.value = 10;

const reverb = context.createConvolver();
reverb.buffer = impulse(10, 10);

biquad_filter.connect(reverb);
reverb.connect(context.destination);

function play_note(freq) {
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = freq;

  const envelope = context.createGain();
  envelope.gain.setTargetAtTime(1, context.currentTime, .1);
  envelope.gain.setTargetAtTime(0, context.currentTime + 1, .1);

  oscillator.connect(envelope);
  envelope.connect(biquad_filter);

  oscillator.start();
  oscillator.stop(context.currentTime + 10);
}

function play_music() {
  const note = element_of$1(notes);
  play_note(note);
  setTimeout(play_music, 2000 + integer$1(0, 10000));
}

function fm_synth(audio_context, carrier, modulator, mod_gain) {
  this.modulator_gain = audio_context.createGain();
  this.modulator_gain.gain.value = mod_gain || 300;

  modulator.connect(this.modulator_gain);
  this.modulator_gain.connect(carrier.frequency);

  this.connect = audio_node => {
    carrier.disconnect();
    carrier.connect(audio_node);
  };

  this.disconnect = audio_node => {
    carrier.disconnect(audio_node);
  };
}

function am_synth(audio_context, node1, node2) {

  var am_gain = audio_context.createGain();
  am_gain.gain.value = 1;

  node1.connect(am_gain);
  node2.connect(am_gain.gain);

  this.connect = function(audio_node) {
    am_gain.disconnect();
    am_gain.connect(audio_node);
  };
}

function param_ead(audio_context, param, attack_time, decay_time, min, max) {

  /* 0.001 - 60dB Drop
  e(-n) = 0.001; - Decay Rate of setTargetAtTime.
  n = 6.90776;
  */
  var t60multiplier = 6.90776;

  this.attack_time = attack_time || 0.9;
  this.decay_time = decay_time || 0.9;

  this.min = min || 0;
  this.max = max || 50;

  this.trigger = time => {
    var start_time = time || audio_context.currentTime;
    param.cancelScheduledValues(start_time);
    param.setValueAtTime(this.min, start_time);
    param.setTargetAtTime(this.max, start_time, this.attack_time/t60multiplier);
    param.setTargetAtTime(this.min, start_time + this.attack_time+(1.0/44100.0), this.decay_time/t60multiplier);
  };
}

const bird_sound_params = {
  "ifrq": 0.0204082,
  "atk": 0.367347,
  "dcy": 0.183673,
  "fmod1": 0.0612245,
  "atkf1": 0,
  "dcyf1": 1,
  "fmod2": 0.285714,
  "atkf2": 0.22449,
  "dcyf2": 0.489796,
  "amod1": 0.367347,
  "atka1": 0.387755,
  "dcya1": 0.734694,
  "amod2": 0.204082,
  "atka2": 0.428571,
  "dcya2": 0.142857
};

function bird_sound(position, time) {
  const freq_multiplier = 7000;
  const freq_offset = 300;
  const max_attack_decay_time = 0.9; //seconds
  const env_freq_multiplier = 3000;

  const panner = context.createPanner();
  panner.panningModel = "equalpower";
  panner.distanceModel = "exponential";
  panner.refDistance = 0.3;
  panner.setPosition(...position);

  const carrier_osc = context.createOscillator();
  const mod_osc = context.createOscillator();
  const am_osc = context.createOscillator();

  const mod_osc_gain = context.createGain();
  const am_osc_gain = context.createGain();

  const main_gain = context.createGain();

  mod_osc.connect(mod_osc_gain);
  am_osc.connect(am_osc_gain);

  const fm = new fm_synth(context, carrier_osc, mod_osc_gain);
  const am = new am_synth(context, fm, am_osc_gain);

  const main_env = new param_ead(context, main_gain.gain);
  const fm_freq_env = new param_ead(context, mod_osc.frequency);
  const am_freq_env = new param_ead(context, am_osc.frequency);
  const fm_gain_env = new param_ead(context,  mod_osc_gain.gain);
  const am_gain_env = new param_ead(context, am_osc_gain.gain);

  am.connect(main_gain);
  main_gain.connect(panner);
  panner.connect(context.destination);

  fm.modulator_gain.gain.value = freq_offset + freq_multiplier * bird_sound_params.ifrq;
  carrier_osc.frequency.value = freq_offset + freq_multiplier * bird_sound_params.ifrq;

  main_env.attack_time = max_attack_decay_time * bird_sound_params.atk;
  main_env.decay_time = max_attack_decay_time * bird_sound_params.dcy;

  fm_freq_env.max = env_freq_multiplier * bird_sound_params.fmod1;
  fm_freq_env.attack_time = max_attack_decay_time * bird_sound_params.atkf1;
  fm_freq_env.decay_time = max_attack_decay_time * bird_sound_params.dcyf1;

  am_freq_env.max = env_freq_multiplier * bird_sound_params.fmod2;
  am_freq_env.attack_time = max_attack_decay_time * bird_sound_params.atkf2;
  am_freq_env.decay_time = max_attack_decay_time * bird_sound_params.dcyf2;

  fm_gain_env.max = bird_sound_params.amod1;
  fm_gain_env.attack_time = max_attack_decay_time * bird_sound_params.atka1;
  fm_gain_env.decay_time = max_attack_decay_time * bird_sound_params.dcya1;

  am_gain_env.max = -bird_sound_params.amod2;
  am_gain_env.attack_time = max_attack_decay_time * bird_sound_params.atka2;
  am_gain_env.decay_time = max_attack_decay_time * bird_sound_params.dcya2;

  main_gain.gain.value = 0;
  carrier_osc.start(0);
  mod_osc.start(0);
  am_osc.start(0);

  main_env.trigger(time);
  fm_freq_env.trigger(time);
  am_freq_env.trigger(time);
  fm_gain_env.trigger(time);
  am_gain_env.trigger(time);
}

function play_bird_sound(position) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      bird_sound(position, context.currentTime + Math.random()*0.4);
    }, bird_sound_params.atk * 1000 * 1.2 * i);
  }
}

const tween_time = 4; // <- seconds
const bird_model = bird_model_vertices.map(v => ({
  vertices: v,
  indices: bird_model_indices
}));
function spawn_birds(position$$1, color, radius, qty, game) {
  play_bird_sound(position$$1);
  for (let i = 0; i < qty; i++) {
    setTimeout(() => {
      const target_position = position([position$$1[0], position$$1[2]], radius, 100);
      const bird = new Entity({
        components: [
          new Transform({
            position: position$$1,
            scale: [0.2, 0.2, 0.2]
          }),
          new Render({
            material: basic,
            color
          }),
          new Morph({
            frame_time: 16
          })
        ]
      });

      bird.get_component(Morph).frames = bird_model;
      bird.get_component(Transform).look_at(target_position);
      bird.get_component(Transform).rotate_ud(Math.PI/2);
      bird.get_component(Transform).rotate_rl(Math.PI);
      bird.get_component(Morph).create_buffers();
      game.add(bird);

      new VecTween({
        object: bird.get_component(Transform),
        property: 'position',
        to: target_position,
        time: tween_time * 1000,
        game: game
      }).start().then(() => {
        game.remove(bird);
      });
    }, i*15);
  }
}

const DEBUG = false;
const WORLD_SIZE = 1000;
const SATURATION = 0.7;
const LUMINANCE = 0.6;
const PLAYER_HEIGHT = 1.74;
const BIRD_TRIGGER_DISTANCE = 25;
const BIRD_FLOCK_SIZE = 25;

let props = [];
let birds_positions = [];

function hex(hue, lum) {
  const rgb = hsl_to_rgb(hue, SATURATION, lum);
  return rgb_to_hex(rgb);
}

function create_level(lvl_number) {
  set_seed(Math.pow(base_seed / lvl_number, 2));
  props = [];
  birds_positions = [];
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
    clear_color: "#eeeeee",
    far: WORLD_SIZE
  });

  game.camera.add_component(new Move({
    keyboard_controlled: false,
    mouse_controlled: false,
    move_speed: 25,
    rotate_speed: .5,
  }));

  const hue = float(0, 1);
  const color = hex(hue, LUMINANCE);

  const floor$$1 = new Plane();
  floor$$1.get_component(Transform).scale = [WORLD_SIZE, 1, WORLD_SIZE];
  floor$$1.get_component(Render).set({
    material: basic,
    color
  });

  game.add(floor$$1);

  for (let i = 0; i < Math.pow(lvl_number, 2) + 1; i++) {
    element(i, color, integer(0, 2)).forEach((el) => {
      props.push(el);
      game.add(el);
    });
  }

  game.camera.get_component(Transform).position = position([0, 0], WORLD_SIZE / 3);
  game.camera.get_component(Transform).look_at(
    element_of(props).get_component(Transform).position
  );
  game.camera.get_component(Transform).look_at(
    look_at_target(game.camera.get_component(Transform).matrix)
  );

  if (!DEBUG) {
    delete game.camera.get_component(Move).dir_desc['69'];
    delete game.camera.get_component(Move).dir_desc['81'];
  }

  // game.camera.get_component(Move).dir_desc['81'] = 'l';
  // game.camera.get_component(Move).dir_desc['90'] = 'f';

  const spawners = integer(2, 4);
  for (let i = 0; i < spawners; i++) {
    const birds_position = position([0, 0], WORLD_SIZE/3, -3);
    birds_positions.push(birds_position);

    if (DEBUG) {
      const bird_spawner = element(1, color, 3)[0];
      bird_spawner.get_component(Transform).set({
        position: birds_position
      });
      game.add(bird_spawner);
    }
  }


  game.on("afterrender", function take_snapshot() {
    game.off("afterrender", take_snapshot);
    const target = {
      snapshot: game.canvas.toDataURL(),
      position: game.camera.get_component(Transform).position,
      rotation: game.camera.get_component(Transform).rotation,
    };
    dispatch(SAVE_SNAPSHOT, target);
    game.stop();
  });

  return [game, hue];
}

function start_level(game, hue, target) {
  game.camera.get_component(Transform).set({
    position: [0, PLAYER_HEIGHT, 0],
    rotation: create$2()
  });

  game.camera.get_component(Move).keyboard_controlled = true;
  game.camera.get_component(Move).mouse_controlled = true;
  game.camera.add_component(new DummyLookAt({target}));

  for (const entity of game.entities) {
    entity.get_component(Render).color = "#000000";
  }

  game.start();

  game.on("tick", () => {
    for (let i = 0; i < birds_positions.length; i++) {
      if (distance(birds_positions[i], game.camera.get_component(Transform).position) < BIRD_TRIGGER_DISTANCE) {
        spawn_birds(
          birds_positions[i],
          hex(hue, LUMINANCE * get_hint(target, game.camera, WORLD_SIZE)),
          WORLD_SIZE/5,
          BIRD_FLOCK_SIZE,
          game
        );
        birds_positions.splice(i, 1);
        break;
      }
    }
  });

  game.on("afterrender", function () {
    const hint = get_hint(target, game.camera, WORLD_SIZE);
    // XXX Change color on the material instance?
    for (const entity of game.entities) {
      entity.get_component(Render).color = hex(hue, LUMINANCE * hint);
    }
  });
}

function end_level(game, target) {
  game.stop();
  const score = get_score(target, game.camera, WORLD_SIZE);
  return Math.floor(score * 100);
}

const MAX_IDLE = 5000;
let last_active = {};
let idle_check;

function reset_idle(event) {
  last_active[event.type] = performance.now();
}

function detect_idle() {
  clear_idle();
  for (const type of ["mousemove", "keydown"]) {
    if (last_active[type] + MAX_IDLE < performance.now()) {
      dispatch(WARN_IDLE, type);
      break;
    }
  }
}

function setup_idle() {
  window.addEventListener("mousemove", reset_idle);
  window.addEventListener("keydown", reset_idle);
  idle_check = setTimeout(detect_idle, 5000);

  const now = performance.now();
  last_active = {mousemove: now, keydown: now};
}

function clear_idle() {
  window.removeEventListener("mousemove", reset_idle);
  window.removeEventListener("keydown", reset_idle);
  clearTimeout(idle_check);
}

const init$1 = {
  level: null,
  hue: 0,
  target: null,
  results: [],
  clickable: true,
  idle_reason: null
};

function reducer$1(state = init$1, action, args) {
  switch (action) {
    case INIT: {
      play_music();
      const saved_results = localStorage.getItem("results");
      const results = saved_results
        ? saved_results.split(" ").map(x => parseInt(x))
        : [];
      return merge(state, { results });
    }
    case SCENE_FIND: {
      const [index] = args;
      const [level, hue] = create_level(index + 1);
      return merge(state, { index, level, hue, clickable: false });
    }
    case TOGGLE_CLICKABLE: {
      const { clickable } = state;
      return merge(state, { clickable: !clickable });
    }
    case SAVE_SNAPSHOT: {
      const [target] = args;
      return merge(state, { target });
    }
    case LOCK_POINTER: {
      const { level } = state;
      level.canvas.requestPointerLock();
      return state;
    }
    case SCENE_PLAY: {
      const { level, hue, target } = state;
      start_level(level, hue, target);
      level.canvas.addEventListener("click", oncanvasclick);
      setup_idle();
      return merge(state, { idle_reason: null });
    }
    case WARN_IDLE: {
      const [idle_reason] = args;
      return merge(state, { idle_reason });
    }
    case VALIDATE_SNAPSHOT: {
      const { level, index, target, results } = state;
      const score = end_level(level, target);
      const new_results = [
        ...results.slice(0, index),
        score,
        ...results.slice(index + 1)
      ];

      clear_idle();
      level.canvas.removeEventListener("click", oncanvasclick);
      document.exitPointerLock();
      localStorage.setItem("results", new_results.join(" "));
      return merge(state, { results: new_results });
    }
    case SCENE_LEVELS:
      return merge(state, { level: null });
    default:
      return Object.assign({}, init$1, state);
  }

  function oncanvasclick() {
    dispatch(VALIDATE_SNAPSHOT);
    goto(SCENE_SCORE);
  }
}

// import with_logger from "innerself/logger";
function chain(...reducers) {
  // return reducers.reduce(
  //   (acc, reducer) => (state, ...rest) => reducer(acc(state, ...rest), ...rest)
  //   state => state
  // );
  return function(state, action, args) {
    return reducers.reduce(
      (acc, reducer) => reducer(acc, action, args), state
    );
  }
}

const reducer = chain(navigation, reducer$1);
// const reducer = with_logger(chain(navigation_reducer, game_reducer));
const { attach, connect, dispatch } = createStore(reducer);
const goto = (...args) => dispatch(TRANSITION_START, ...args);

window.dispatch = dispatch;
window.goto = goto;
dispatch(INIT);

function Fadein(from_color, duration = 1) {
  return `<div class="ui"
    onanimationend="dispatch(${TRANSITION_END})"
    style="
      background-color: ${from_color};
      animation: fadein ${duration}s forwards reverse"></div>`;
}

function Fadeout(next, to_color, duration = 1) {
  return `<div class="ui"
    onanimationend="
      dispatch(${TRANSITION_CHANGE_SCENE});
      dispatch(${next.join(", ")})"
    style="
      background-color: ${to_color};
      animation: fadein ${duration}s forwards"></div>`;
}

function Scene({next}, {id, from, to, duration_in, duration_out}, ...children) {
  const [next_scene] = next;
  if (next_scene === null) {
    return children;
  }

  return html`
    ${children}
    ${next_scene === id
      ? Fadein(from, duration_in)
      : Fadeout(next, to, duration_out)}`;
}

var Scene$1 = connect(Scene);

function TitleScreen() {
  return Scene$1(
    {id: SCENE_TITLE, from: "#000", to: "#000"},
    html`
      <div class="ui action"
        onclick="goto(${SCENE_INTRO})">
        <div class="pad" style="margin: 1.3rem 0 1rem;">A moment lost in time.</div>
        <div style="font-size: 0.3rem; animation: fadein 1s 3s both">
          A story by <a href="https://piesku.com">piesku.com</a>.</div>
      </div>`
  );
}

function IntroScreen({results}) {
  const onclick = results.length
    ? `goto(${SCENE_LEVELS})`
    : `goto(${SCENE_FIND}, 0)`;

  return Scene$1(
    {id: SCENE_INTRO, from: "#000", to: "#000"},
    html`
      <div class="ui action" onclick="${onclick}">
        <div class="pad">
          Collect your memories before they fade away.
        </div>
      </div>`
  );
}

var IntroScreen$1 = connect(IntroScreen);

function FindScreenAnimating(hue) {
  return html`
    <div class="ui"
      onanimationend="dispatch(${TOGGLE_CLICKABLE})"
      style="
        background: hsl(${hue * 360}, 70%, 60%);
        animation: fadein 1s 1s forwards reverse;"></div>
    <div class="ui">
      <div class="pad">Find this moment.</div>
    </div>`;
}

function FindScreenClickable() {
  return html`
    <div class="ui action"
      onclick="dispatch(${LOCK_POINTER}); goto(${SCENE_PLAY})">
      <div class="pad">Find this moment.</div>
    </div>`;
}

function FindScreen({hue, clickable}) {
  return Scene$1(
    {id: SCENE_FIND, from: "#000", to: "#fff"},
    clickable ? FindScreenClickable() : FindScreenAnimating(hue)
  );
}

var FindScreen$1 = connect(FindScreen);

function PlayOverlay({idle_reason}) {
  const message = idle_reason === "keydown"
    ? "Walk with the WASD keys."
    : "Move the mouse.";

  return Scene$1(
    // Simulate a flash of light with a .1s fadeout to white here and a 1.9s
    // fadein in ScoreScreen.
    {id: SCENE_PLAY, from: "#fff", to: "#fff", duration_out: .1},
    html`<div class="ui"
      onclick="dispatch(${VALIDATE_SNAPSHOT}); goto(${SCENE_SCORE})">
        ${ idle_reason &&
          `<div style="opacity: 0; animation: fadein 2s 1s alternate 2;">${message}</div>`
        }</div>`
  );
}

var PlayOverlay$1 = connect(PlayOverlay);

function ScoreScreen({results, index, target}) {
  const score = results[index];
  const message = score < 15
    ? "Doesn't look like it."
    : score < 35
    ? "It was something else."
    : score < 50
    ? "It's not quite the same."
    : score < 75
    ? "Could it be?"
    : score < 85
    ? "It reminds you of something."
    : score < 95
    ? "That's it, almost there."
    : "Wonderful. You've found it.";

  return Scene$1(
    // Simulate a flash of light with a .1s fadeout to white in PlayOverlay and
    // a 1.9s fadein here.
    {id: SCENE_SCORE, from: "#fff", duration_in: 1.9, to: "#000"},
    html`
      <img class="ui"
        style="opacity: .5"
        src="${target.snapshot}">
      <div class="ui action"
        onclick="goto(${SCENE_LEVELS})">
        <div class="pad" style="margin: 1.5rem 0 1rem;">${message}</div>
        <div>${results[index]}</div>
      </div>`
  );
}

var ScoreScreen$1 = connect(ScoreScreen);

function LevelScore(score, idx) {
  return html`
     <div class="box action"
       onclick="goto(${SCENE_FIND}, ${idx})"
       style="color: rgba(255, 255, 255, 0.35);">
       ${score}</div>
  `;
}

function LevelSelect({results}) {
  const total = results.reduce((acc, cur) => acc + cur, 0);
  const average = Math.floor(total / results.length);
  // An inverted hyperbola with lim(x → ∞) = 1.
  const threshold = 100 * (1 - 2.5 / results.length);

  return Scene$1(
    {id: SCENE_LEVELS, from: "#000", to: "#000"},
    html`
      <div class="ui" style="background: #111">
        <div class="pad">
          ${results.map(LevelScore)}
          ${ average > threshold
            ? `<div class="box action"
                onclick="goto(${SCENE_FIND}, ${results.length})">next</div>`
            : `<div class="box action"
                onclick="goto(${SCENE_NOPASS})"
                title="Collect more accurate moments before advancing.">…?</div>`
           }
        </div>
      </div>`
  );
}

var LevelSelect$1 = connect(LevelSelect);

function NoPassage() {
  return Scene$1(
    {id: SCENE_NOPASS, from: "#000", to: "#000"},
    html`
      <div class="ui action" style="background: #111"
        onclick="goto(${SCENE_LEVELS})">
        <div class="pad">
          The path onward is never easy.
          Collect more accurate moments before venturing forth.
        </div>
      </div>`
  );
}

const scenes = [
  TitleScreen,
  IntroScreen$1,
  FindScreen$1,
  PlayOverlay$1,
  ScoreScreen$1,
  LevelSelect$1,
  NoPassage,
];

function App({current_scene}) {
  const component = scenes[current_scene];
  return component ? component() : "";
}

var App$1 = connect(App);

attach(App$1, document.querySelector("#root"));

}());
