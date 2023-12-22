import { expectNotAssignable, expectType } from 'tsd';
import { DeepPartial } from '../src/DeepPartial';

interface UserProfile {
  id: number;
  details: {
    name: string;
    age: number;
  };
}
type Case1 = DeepPartial<UserProfile>;
// Result type:
// {
//     id?: number;
//     details?: {
//         name?: string;
//         age?: number;
//     };
// }

const happyStandardCase: Case1 = {};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
