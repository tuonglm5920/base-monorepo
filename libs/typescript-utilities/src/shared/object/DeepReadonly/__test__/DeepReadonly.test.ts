import { expectNotAssignable, expectType } from 'tsd';
import { DeepReadonly } from '../src/DeepReadonly';

interface MutableUserProfile {
  id: number;
  details: {
    name: string;
    age: number;
  };
}
type Case1 = DeepReadonly<MutableUserProfile>;
// Result type:
// {
//     readonly id: number;
//     readonly details: {
//         readonly name: string;
//         readonly age: number;
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
