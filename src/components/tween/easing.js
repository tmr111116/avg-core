/*!
 *
 * @file https://github.com/tweenjs/tween.js/blob/bfb739b8224e1e575307719872ea3c65fa7a9e6a/src/Tween.js
 *
 * The MIT License
 *
 * Copyright (c) 2010-2012 Tween.js authors.
 *
 * Easing equations Copyright (c) 2001 Robert Penner http://robertpenner.com/easing/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const Easing = {

  Linear: {

    None(k) {

      return k;

    }

  },

  Quadratic: {

    In(k) {

      return k * k;

    },

    Out(k) {

      return k * (2 - k);

    },

    InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k;
      }

      return - 0.5 * (--k * (k - 2) - 1);

    }

  },

  Cubic: {

    In(k) {

      return k * k * k;

    },

    Out(k) {

      return --k * k * k + 1;

    },

    InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k + 2);

    }

  },

  Quartic: {

    In(k) {

      return k * k * k * k;

    },

    Out(k) {

      return 1 - (--k * k * k * k);

    },

    InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k;
      }

      return - 0.5 * ((k -= 2) * k * k * k - 2);

    }

  },

  Quintic: {

    In(k) {

      return k * k * k * k * k;

    },

    Out(k) {

      return --k * k * k * k * k + 1;

    },

    InOut(k) {

      if ((k *= 2) < 1) {
        return 0.5 * k * k * k * k * k;
      }

      return 0.5 * ((k -= 2) * k * k * k * k + 2);

    }

  },

  Sinusoidal: {

    In(k) {

      return 1 - Math.cos(k * Math.PI / 2);

    },

    Out(k) {

      return Math.sin(k * Math.PI / 2);

    },

    InOut(k) {

      return 0.5 * (1 - Math.cos(Math.PI * k));

    }

  },

  Exponential: {

    In(k) {

      return k === 0 ? 0 : Math.pow(1024, k - 1);

    },

    Out(k) {

      return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

    },

    InOut(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      if ((k *= 2) < 1) {
        return 0.5 * Math.pow(1024, k - 1);
      }

      return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

    }

  },

  Circular: {

    In(k) {

      return 1 - Math.sqrt(1 - k * k);

    },

    Out(k) {

      return Math.sqrt(1 - (--k * k));

    },

    InOut(k) {

      if ((k *= 2) < 1) {
        return - 0.5 * (Math.sqrt(1 - k * k) - 1);
      }

      return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

    }

  },

  Elastic: {

    In(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

    },

    Out(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

    },

    InOut(k) {

      if (k === 0) {
        return 0;
      }

      if (k === 1) {
        return 1;
      }

      k *= 2;

      if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
      }

      return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

    }

  },

  Back: {

    In(k) {

      var s = 1.70158;

      return k * k * ((s + 1) * k - s);

    },

    Out(k) {

      var s = 1.70158;

      return --k * k * ((s + 1) * k + s) + 1;

    },

    InOut(k) {

      var s = 1.70158 * 1.525;

      if ((k *= 2) < 1) {
        return 0.5 * (k * k * ((s + 1) * k - s));
      }

      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

    }

  },

  Bounce: {

    In(k) {

      return 1 - Easing.Bounce.Out(1 - k);

    },

    Out(k) {

      if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
      } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
      } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
      } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
      }

    },

    InOut(k) {

      if (k < 0.5) {
        return Easing.Bounce.In(k * 2) * 0.5;
      }

      return Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

    }

  }

};

export default Easing;
