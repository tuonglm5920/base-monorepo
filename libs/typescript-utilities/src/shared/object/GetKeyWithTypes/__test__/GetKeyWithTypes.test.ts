import { expectNotAssignable, expectType } from 'tsd';
import { GetKeyWithTypes } from '../src/GetKeyWithTypes';

interface UserProfile {
  username: string;
  age: number;
  email: string;
  registeredOn: Date;
}

type Case1 = GetKeyWithTypes<UserProfile, string>;
// Result type: "username" | "email"
const happyStandardCase: Case1 = 'email';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
