import { expectNotAssignable, expectType } from 'tsd';
import { KeyOf } from '../src/KeyOf';
interface Book {
  title: string;
  author: string;
  publishedYear: number;
}
type Case1 = KeyOf<Book>;
// Result type: "title" | "author" | "publishedYear"
const happyStandardCase: Case1 = 'author';
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
};
expectNotAssignable<Case1>(happyErrorCase);
