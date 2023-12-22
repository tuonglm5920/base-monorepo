import { expectNotAssignable, expectType } from 'tsd';
import { GetReadonlyKeys } from '../src/GetReadonlyKeys';

interface UserInfo {
  readonly userID: number;
  readonly username: string;
  age: number;
  email: string;
}
type Case1 = GetReadonlyKeys<UserInfo>;
// Result type: "userID" | "username"

const happyStandardCase: Case1 = 'userID';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
