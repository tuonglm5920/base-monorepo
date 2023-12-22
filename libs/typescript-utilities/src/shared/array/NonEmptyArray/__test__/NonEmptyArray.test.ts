import { expectNotAssignable, expectType } from 'tsd';
import { NonEmptyArray } from '../src/NonEmptyArray';

type Case1 = NonEmptyArray<number>;
// Result: [1, 2, 3, 4]
const happyStandardCase: Case1 = [1, 2, 3, 4];
expectType<Case1>(happyStandardCase);

const happyErrorCase: any[] = [];
expectNotAssignable<Case1>(happyErrorCase);
