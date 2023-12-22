export type Easing = (t: number) => number;

export interface Easings {
  /**
   * Linear easing; maintains a constant speed throughout the animation.
   * @link https://joshcollinsworth.com/demos/easing
   */
  linear: Easing;

  /**
   * Standard easing; starts slow, accelerates in the middle, and slows down at the end.
   * @link https://joshcollinsworth.com/demos/easing
   */
  ease: Easing;

  /**
   * Starts slow and accelerates towards the end. Good for movements where you want to emphasize the conclusion.
   * @link https://easings.net/#easeInQuad
   */
  easeInQuad: Easing;

  /**
   * Begins quickly and decelerates towards the end.
   * @link https://easings.net/#easeOutQuad
   */
  easeOutQuad: Easing;

  /**
   * Combines ease-in and ease-out effects for a smooth start and finish.
   * @link https://easings.net/#easeInOutQuad
   */
  easeInOutQuad: Easing;

  /**
   * Similar to easeInQuad, but with a more pronounced acceleration.
   * @link https://easings.net/#easeInCubic
   */
  easeInCubic: Easing;

  /**
   * Similar to easeOutQuad, but with a more pronounced deceleration.
   * @link https://easings.net/#easeOutCubic
   */
  easeOutCubic: Easing;

  /**
   * A combination of ease-in and ease-out with a cubic function for a more dramatic effect.
   * @link https://easings.net/#easeInOutCubic
   */
  easeInOutCubic: Easing;

  /**
   * Starts even slower than easeInCubic and accelerates more dramatically.
   * @link https://easings.net/#easeInQuart
   */
  easeInQuart: Easing;

  /**
   * Decelerates more dramatically than easeOutCubic.
   * @link https://easings.net/#easeOutQuart
   */
  easeOutQuart: Easing;

  /**
   * A more dramatic version of easeInOutCubic.
   * @link https://easings.net/#easeInOutQuart
   */
  easeInOutQuart: Easing;

  /**
   * Starts very slow and ends very fast, more extreme than easeInQuart.
   * @link https://easings.net/#easeInQuint
   */
  easeInQuint: Easing;

  /**
   * Begins very fast and ends very slow, more extreme than easeOutQuart.
   * @link https://easings.net/#easeOutQuint
   */
  easeOutQuint: Easing;

  /**
   * A very dramatic effect with a very slow start and end, and a very fast middle.
   * @link https://easings.net/#easeInOutQuint
   */
  easeInOutQuint: Easing;

  /**
   * Mimics the motion of an object bouncing at the end of the animation.
   * @link https://easings.net/#easeOutBounce
   */
  easeOutBounce: Easing;

  /**
   * Starts with a "bouncing" effect and then continues normally.
   * @link https://easings.net/#easeInBounce
   */
  easeInBounce: Easing;

  /**
   * Starts quickly and then "snaps" back at the end.
   * @link https://easings.net/#easeOutBack
   */
  easeOutBack: Easing;

  /**
   * "Snaps" the object back in the beginning and then continues the animation.
   * @link https://easings.net/#easeInBack
   */
  easeInBack: Easing;

  /**
   * Combines the "snap" effect in both the start and end of the animation.
   * @link https://easings.net/#easeInOut
   */
  easeInOut: Easing;

  /**
   * Produces an elastic, "stretchy" effect at the beginning.
   * @link https://easings.net/#easeInElastic
   */
  easeInElastic: Easing;

  /**
   * Produces an elastic effect at the end of the animation.
   * @link https://easings.net/#easeOutElastic
   */
  easeOutElastic: Easing;

  /**
   * Dynamic easing curve simulating physical motion, not subject to fixed duration.
   */
  spring: Easing;

  /**
   * Describes a process where a quantity decreases at a rate proportional to its current value, commonly used in animations to simulate decaying motion. */
  decay: Easing;

  /**
   * Defines a custom cubic Bézier curve easing, specified by four control points.
   * @link https://css-tricks.com/advanced-css-animation-using-cubic-bezier/
   */
  bezier: (x1: number, y1: number, x2: number, y2: number) => Easing;

  //#region Dynamic.js

  /**
   * Generates an easing curve that replicates the behavior of a spring-based motion,
   * inspired by the dynamics library but cloned for use within this context.
   * This easing curve is designed to mimic physical motion, particularly the behavior
   * of a spring undergoing motion, and is not constrained by a fixed duration.
   *
   * @param options - An object containing optional parameters to customize the spring effect:
   *   - frequency: Adjusts the frequency or oscillations of the spring motion. Default is 300
   *   - friction: Represents the amount of friction applied to the spring's movement. Default is 200
   *   - anticipationSize: Determines the size of the initial anticipation before the spring motion. Default is 0
   *   - anticipationStrength: Sets the strength of the initial anticipation. Default is 0
   *
   * @link http://dynamicsjs.com/
   */
  springButCloneFromDynamicJs: (options: {
    frequency?: number;
    friction?: number;
    anticipationSize?: number;
    anticipationStrength?: number;
  }) => Easing;

  /**
   * Defines an easing effect emulating the motion of an object bouncing at the conclusion of an animation.
   * The 'bounce' function generates an easing curve that simulates a natural bounce-like motion,
   * commonly used to create realistic animations for transitions or movements in user interfaces.
   *
   * @param options - An optional parameter allowing customization of the bounce effect:
   *   - frequency: Adjusts the frequency or the number of bounces. Higher values result in more bounces. Default is 300
   *   - friction: Represents the amount of friction applied to the bouncing motion. Default is 200
   *
   *
   * @link http://dynamicsjs.com
   */
  bounce: (options: { frequency?: number; friction?: number }) => Easing;

  /**
   * Generates an easing curve simulating the effect of gravitational motion,
   * allowing the emulation of gravity-based animations.
   *
   * @param options - An object containing optional parameters to customize the gravity effect:
   *   - bounciness: Adjusts the intensity of the bounce when the object reaches its lowest point. Default is 400
   *   - elasticity: Represents the elasticity or 'springiness' of the gravitational effect. Default is 200
   *
   * @link http://dynamicsjs.com/
   */
  gravity: (options: { bounciness?: number; elasticity?: number; forceWithGravity?: boolean }) => Easing;
  //#endregion
}

/**
 * Collection of easing functions for animations.
 * TODO: Write demo visualize easing function
 */
export const easings: Easings = {
  linear: t => t,
  ease: t => 0.5 * (1 - Math.cos(Math.PI * t)),
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    }
    if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    }
    if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    }
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInBounce: t => 1 - easings.easeOutBounce(1 - t),
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },
  easeInBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * t * t * t - c1 * t * t;
  },
  easeInOut: t => (t < 0.5 ? easings.easeInBack(t * 2) / 2 : easings.easeOutBack(t * 2 - 1) / 2 + 0.5),
  easeInElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  spring: t => 1 - Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6),
  decay: t => 1 - Math.exp(-t * 6),
  bezier: (x1, y1, x2, y2) => t => {
    const ax = 3 * x1 - 3 * x2 + 1;
    const bx = 3 * x2 - 6 * x1;
    const cx = 3 * x1;
    const ay = 3 * y1 - 3 * y2 + 1;
    const by = 3 * y2 - 6 * y1;
    const cy = 3 * y1;

    const sampleCurveX = (t: number): number => ((ax * t + bx) * t + cx) * t;

    const sampleCurveY = (t: number): number => ((ay * t + by) * t + cy) * t;

    const sampleCurveDerivativeX = (t: number): number => (3 * ax * t + 2 * bx) * t + cx;

    const solveCurveX = (x: number, epsilon: number): number => {
      let t0;
      let t1;
      let t2;
      let x2;
      let d2;
      let i;

      for (t2 = x, i = 0; i < 8; i++) {
        x2 = sampleCurveX(t2) - x;
        if (Math.abs(x2) < epsilon) {
          return t2;
        }
        d2 = sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-6) {
          break;
        }
        t2 -= x2 / d2;
      }

      t0 = 0;
      t1 = 1;
      t2 = x;

      if (t2 < t0) {
        return t0;
      }
      if (t2 > t1) {
        return t1;
      }

      while (t0 < t1) {
        x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < epsilon) {
          return t2;
        }
        if (x > x2) {
          t0 = t2;
        } else {
          t1 = t2;
        }
        t2 = (t1 - t0) * 0.5 + t0;
      }

      return t2;
    };

    return sampleCurveY(solveCurveX(t, 1 / 200));
  },

  // #region Dynamic.js
  springButCloneFromDynamicJs: ({
    anticipationSize = 0,
    anticipationStrength = 0,
    friction = 200,
    frequency = 300,
  }) => {
    const frequency_ = Math.max(1, frequency / 20);
    const friction_ = Math.pow(20, friction / 100);
    const s = anticipationSize / 1000;
    const A1: Easing = t => {
      const M = 0.8;
      const x0 = s / (1 - s);
      const x1 = 0;
      const b = (x0 - M * x1) / (x0 - x1);
      const a = (M - b) / x0;
      return (a * t * anticipationStrength) / 100 + b;
    };
    const A2: Easing = t => {
      return Math.pow(friction_ / 10, -t) * (1 - t);
    };
    return function (t) {
      let A, a, b, y0, yS;
      const frictionT = t / (1 - s) - s / (1 - s);
      if (t < s) {
        yS = s / (1 - s) - s / (1 - s);
        y0 = 0 / (1 - s) - s / (1 - s);
        b = Math.acos(1 / A1(yS));
        a = (Math.acos(1 / A1(y0)) - b) / (frequency_ * -s);
        A = A1;
      } else {
        A = A2;
        b = 0;
        a = 1;
      }
      const At = A(frictionT);
      const angle = frequency_ * (t - s) * a + b;
      return 1 - At * Math.cos(angle);
    };
  },
  bounce: ({ frequency = 300, friction = 200 }) => {
    const frequency_ = Math.max(1, (frequency || 0) / 20);
    const friction_ = Math.pow(20, (friction || 0) / 100);

    const A = (t: number): number => {
      return Math.pow(friction_ / 10, -t) * (1 - t);
    };

    return t => {
      const b = -3.14 / 2;
      const a = 1;
      const At = A(t);
      const angle = frequency_ * t * a + b;
      return At * Math.cos(angle);
    };
  },
  gravity: ({ bounciness = 400, elasticity = 200, forceWithGravity = false }) => {
    let L;

    const bounciness_ = Math.min(bounciness / 1250, 0.8);
    const elasticity_ = elasticity / 1000;
    const gravity = 100;
    const curves: Array<{ a: number; b: number; H: number }> = [];
    L = ((): number => {
      let curve;
      const b = Math.sqrt(2 / gravity);
      curve = {
        a: -b,
        b: b,
        H: 1,
      };
      if (forceWithGravity) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      while (curve.H > 0.001) {
        L = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L * bounciness_,
          H: curve.H * bounciness_ * bounciness_,
        };
      }
      return curve.b;
    })();
    const getPointInCurve = (a: number, b: number, H: number, t: number): number => {
      let c;
      L = b - a;
      const t2 = (2 / L) * t - 1 - (a * 2) / L;
      c = t2 * t2 * H - H + 1;
      if (forceWithGravity) {
        c = 1 - c;
      }
      return c;
    };
    ((): number[] => {
      let L2, curve;
      const b = Math.sqrt(2 / (gravity * L * L));
      curve = {
        a: -b,
        b: b,
        H: 1,
      };
      if (forceWithGravity) {
        curve.a = 0;
        curve.b = curve.b * 2;
      }
      curves.push(curve);
      L2 = L;
      const _results = [];
      while (curve.b < 1 && curve.H > 0.001) {
        L2 = curve.b - curve.a;
        curve = {
          a: curve.b,
          b: curve.b + L2 * bounciness_,
          H: curve.H * elasticity_,
        };
        _results.push(curves.push(curve));
      }
      return _results;
    })();
    return t => {
      let curve, i, v;
      i = 0;
      curve = curves[i];
      while (!(t >= curve.a && t <= curve.b)) {
        i += 1;
        curve = curves[i];
        if (!curve) {
          break;
        }
      }
      if (!curve) {
        v = forceWithGravity ? 0 : 1;
      } else {
        v = getPointInCurve(curve.a, curve.b, curve.H, t);
      }
      return v;
    };
  },
  // #endregion
};
