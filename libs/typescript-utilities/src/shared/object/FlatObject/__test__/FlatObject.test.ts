import { expectNotAssignable, expectType } from 'tsd';
import { FlatObject } from '../src/FlatObject';
interface NestedUser {
  id: number;
  details: {
    name: string;
    age: number;
    address: {
      city: string;
      zip: number;
    };
  };
}

type Case1 = FlatObject<NestedUser>;
// Result type:
// {
//     id: number;
//     "name": string;
//     "age": number;
//     "city": string;
//     "zip": number;
// }
// Result type:
// {
//     id: number;
//     name: string;
//     age: number;
// }
const happyStandardCase: Case1 = {
  age: 23,
  id: 1,
  name: 'Lê Mạnh Tưởng',
  city: 'HN',
  zip: 0,
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
