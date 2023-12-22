import { expectNotAssignable, expectType } from 'tsd';
import { DropFromHead } from '../src/DropFromHead';

type Case1 = DropFromHead<[1, 2, 3, 4, 5], 1>;
// Result: [2, 3, 4, 5]
const happyStandardCase: Case1 = [2, 3, 4, 5];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
