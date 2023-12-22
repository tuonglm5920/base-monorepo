import { expectNotAssignable, expectType } from 'tsd';
import { DeepNullable } from '../src/DeepNullable';

interface UserProfile {
  id: number;
  details: {
    name: string;
    age: number;
  };
}
type Case1 = DeepNullable<UserProfile>;
// Result type:
// {
//     id?: number | null;
//     details?: {
//         name?: string | null;
//         age?: number | null;
//     } | null;
// }

const happyStandardCase: Case1 = {
  details: { age: null, name: null },
  id: null,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
