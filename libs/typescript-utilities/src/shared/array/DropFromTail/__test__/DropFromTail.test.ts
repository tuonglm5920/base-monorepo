import { expectNotAssignable, expectType } from 'tsd';
import { DropFromTail } from '../src/DropFromTail';

type Case1 = DropFromTail<[1, 2, 3, 4, 5], 3>;
// Result: [1, 2]
const happyStandardCase: Case1 = [1, 2];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
