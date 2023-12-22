import { AnyRecord } from 'typescript-utilities';
import { PlayOptions } from 'utilities';

/**
 * Extends PlayOptions with an additional 'args' property.
 */
export type PlayOptionsWithArgs<Args extends AnyRecord | void = void> = Args extends AnyRecord
  ? PlayOptions & { args: Args }
  : PlayOptions;
