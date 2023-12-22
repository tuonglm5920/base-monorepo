import { expectNotAssignable, expectType } from 'tsd';
import { DeepMutable } from '../src/DeepMutable';

interface ImmutableUserProfile {
  readonly id: number;
  readonly details: {
    readonly name: string;
    readonly age: number;
  };
}
type Case1 = DeepMutable<ImmutableUserProfile>;
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
