import { expectType } from 'tsd';
import { LiteralUnion } from '../src/LiteralUnion';

type Case1 = LiteralUnion<'dog' | 'cat', string>;
// You **will** get auto-completion for `dog` and `cat` literals.
const happyStandardCase: Case1 = '';
expectType<Case1>(happyStandardCase);
