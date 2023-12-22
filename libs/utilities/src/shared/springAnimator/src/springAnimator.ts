import { LiteralUnion } from 'typescript-utilities';

/**
 * Represents an item used for spring-like animations.
 * @param {object} options - The options object.
 * @param {number} options.initialValue - The initial value of the property.
 * @param {number} options.acceleration - The rate of change for the property's acceleration.
 * @param {number} options.friction - The amount of damping applied to the property's animation.
 */
export class SpringAnimatorInstance {
  /** The current value of the animated property. */
  public current: number;
  /** The target value towards which the animation is moving. */
  public target: number;
  /** Controls the rate of change for the animation's acceleration. */
  private _acceleration: number;
  /** Manages the amount of damping applied to the animation. */
  private _friction: number;
  /** The speed of the animation at a given moment. */
  public velocity: number;

  constructor({
    acceleration,
    friction,
    initialValue,
  }: {
    initialValue: number;
    acceleration: number;
    friction: number;
  }) {
    this.current = initialValue;
    this.target = initialValue;
    this._acceleration = acceleration;
    this._friction = friction;
    this.velocity = 0;
  }

  /**
   * Updates the animated property's current value based on its target value, acceleration, and friction.
   * @returns The remaining distance between the current and target values after the update.
   */
  public update(): number {
    const distance = this.target - this.current;
    const attraction = distance * this._acceleration;

    this._applyForce(attraction);

    this.velocity *= this._friction;
    this.current += this.velocity;

    return distance;
  }

  /**
   * Applies force to the animation's velocity.
   * @param force The force value to be applied to the velocity.
   */
  private _applyForce(force: number): void {
    this.velocity += force;
  }
}

export interface Options {
  /**
   * Controls the amount of friction applied to the animation.
   * Higher values lead to quicker damping of motion.
   * Recommended value 0-1. Default value is 0.3.
   */
  friction: number;
  /**
   * Determines the rate at which the animation accelerates towards its target value.
   * Higher values result in faster acceleration.
   * Recommended value 0-1. Default value is 0.04.
   */
  acceleration: number;
  /**
   * Sets the initial value of current and target variables in animated instances.
   */
  initialValue: number;
  /** Array of names (strings). SpringAnimator creates animated instance for each name. Defaults to single x value in array. */
  names: string[];
  /** Function testing whether the animation has finished. Function gets and animated instance as an argument. When `shouldContinueAnimation` function returns false for all animated instances, SpringAnimator stops the animation and sets values to target values. */
  shouldContinueAnimation: (instance: SpringAnimatorInstance) => boolean;
}

export type Handler = (instances: Record<string, SpringAnimatorInstance>) => void;

/** Provides a lightweight animation utility for creating spring-like effects and animating properties. */
export class SpringAnimator {
  /** Contains instances of SpringAnimatorInstance associated with their respective names. */
  public instances: Record<string, SpringAnimatorInstance>;
  /** Handles different types of event handlers for animation control. */
  private _handlers: Record<LiteralUnion<'set' | 'start' | 'tick' | 'end', string>, Handler[]>;
  /** Stores the options used to configure the SpringAnimator. */
  private _options: Options;
  /** Stores the ID returned by requestAnimationFrame for animation tracking. */
  private _rafId: number | null;

  constructor(options: Partial<Options>) {
    this._handlers = {
      set: [],
      start: [],
      tick: [],
      end: [],
    };

    this._options = {
      friction: options.acceleration ?? 0.7,
      acceleration: options.acceleration ?? 0.04,
      initialValue: options.initialValue ?? 0,
      names: options.names ?? ['x'],
      shouldContinueAnimation:
        options.shouldContinueAnimation ??
        ((instance): boolean => {
          return Math.abs(instance.current - instance.target) > 0.1;
        }),
    };

    if (options && options.friction) {
      this._options.friction = 1 - options.friction;
    }

    this.instances = {};
    this._options.names.forEach(name => {
      this.instances[name] = new SpringAnimatorInstance({
        acceleration: this._options.acceleration,
        initialValue: this._options.initialValue,
        friction: this._options.friction,
      });
    });

    this._rafId = null;
  }

  /**
   * Sets the value of an animated property.
   * @param {string} param.name - The name of the property.
   * @param {number | null} param.num - The value to set.
   */
  public set = ({ name, num }: { name: string; num: number | null }): void => {
    if (num == null) {
      console.warn('Define a value.');
      return;
    }
    if (this.instances[name] == null) {
      console.warn(`Instance "${name}" doesn't exist.`);
      return;
    }
    this.instances[name].current = num;
    this.instances[name].target = num;
    if (!this._rafId) {
      this._handlers['set'].forEach(handler => handler(this.instances));
      this._handlers['tick'].forEach(handler => handler(this.instances));
    }
  };

  /**
   * Animates the value of a property.
   * @param {string} param.name - The name of the property.
   * @param {number | null} param.num - The target value to animate towards.
   * @returns {number | void} - The animated value or void if no animation is initiated.
   */
  public animate = ({ name, num }: { name: string; num: number | null }): number | void => {
    if (num == null) {
      console.warn('Define a value.');
      return;
    }
    if (this.instances[name] == null) {
      console.warn(`Instance ${name} doesn't exist.`);
      return;
    }
    if (this.instances[name].target !== num) {
      this.instances[name].target = num;
      if (!this._rafId) {
        this._handlers['start'].forEach(handler => handler(this.instances));
        this._animateValues();
      }
      return num;
    }

    return;
  };

  /**
   * Animates values for all instances based on configured options and event handlers.
   * If animations are ongoing, continues the animation loop; otherwise, ends the animation cycle.
   */
  private _animateValues = (): void => {
    let done = true;

    Object.keys(this.instances).forEach(key => {
      this.instances[key].update();

      if (this._options.shouldContinueAnimation(this.instances[key])) {
        done = false;
      }
    });

    if (!done) {
      this._rafId = requestAnimationFrame(this._animateValues.bind(this));
      this._handlers['tick'].forEach(handler => handler(this.instances));
    } else {
      Object.keys(this.instances).forEach(key => {
        this.instances[key].current = this.instances[key].target;
        this.instances[key].velocity = 0;
      });

      this._handlers['tick'].forEach(handler => handler(this.instances));
      this._handlers['end'].forEach(handler => handler(this.instances));
      this._rafId = null;
    }
  };

  /**
   * Subscribes a handler function to a specified event.
   * @param {LiteralUnion<'set' | 'start' | 'tick' | 'end' , string>} param.event - The event to subscribe to.
   * @param {Function} param.handler - The handler function to be invoked.
   */
  public on = ({
    event,
    handler,
  }: {
    event: LiteralUnion<'set' | 'start' | 'tick' | 'end', string>;
    handler: Handler;
  }): void => {
    if (this._handlers[event]) {
      this._handlers[event].push(handler);
    } else {
      console.warn(`Unsupported event ${event}.`);
    }
  };

  /**
   * Unsubscribes a handler function from a specified event.
   * @param {LiteralUnion<'set' | 'start' | 'tick' | 'end' , string> | null} param.event - The event from which to unsubscribe handlers.
   * @param {Function} param.handler - The handler function to be removed.
   */
  public off = ({
    event,
    handler,
  }: {
    event: LiteralUnion<'set' | 'start' | 'tick' | 'end', string> | null;
    handler?: Function;
  }): void => {
    if (event != null) {
      if (handler != null) {
        if (this._handlers[event] && this._handlers[event].filter(savedHandler => savedHandler === handler).length) {
          const toRemove = this._handlers[event].filter(savedHandler => savedHandler === handler)[0];
          const index = this._handlers[event].indexOf(toRemove);
          if (index > -1) {
            this._handlers[event].splice(index, 1);
          }
        } else {
          console.warn(`Handler for event ${event} not found.`);
        }
      } else {
        this._handlers[event] = [];
      }
    } else {
      Object.keys(this._handlers).forEach(keys => {
        this._handlers[keys] = [];
      });
    }
  };
}
