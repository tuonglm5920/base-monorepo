import { expectNotAssignable, expectType } from 'tsd';
import { ExtractRouteParams } from '../src/ExtractRouteParams';

type Case1 = ExtractRouteParams<'/posts/:postId/:commentId/:test/:test2/:test3'>;
// Results in:
// {
//   postId: string;
//   commentId: string;
//   test: string;
//   test2: string;
//   test3: string;
// }
const happyStandardCase: Case1 = {
  commentId: '',
  postId: '',
  test: '',
  test2: '',
  test3: '',
};
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
