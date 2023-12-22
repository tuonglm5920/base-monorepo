import { expectNotAssignable, expectType } from 'tsd';
import { FindDuplicateElementInArray } from '../src/FindDuplicateElementInArray';

type Case1 = FindDuplicateElementInArray<['Lorem', 'ipsum', 'dolor', 4, 'Lorem']>;
// Result: ["Encountered value with duplicates:", "Lorem"]
const happyStandardCase: Case1 = ['Encountered value with duplicates:', 'Lorem'];
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
