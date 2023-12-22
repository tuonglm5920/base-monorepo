import { expectNotAssignable, expectType } from 'tsd';
import { DeepRequired } from '../src/DeepRequired';

interface PartialUserProfile {
  id?: number;
  details?: {
    name?: string;
    age?: number;
  };
}
type Case1 = DeepRequired<PartialUserProfile>;
// Result type:
// {
//     id: number;
//     details: {
//         name: string;
//         age: number;
//     };
// }
const happyStandardCase: Case1 = {
  details: { age: 23, name: 'Lê Mạnh Tưởng' },
  id: 1,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
