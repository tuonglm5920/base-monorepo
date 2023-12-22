import { expectNotAssignable, expectType } from 'tsd';
import { ToReadonlyKeys } from '../src/ToReadonlyKeys';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
}
type Case1 = ToReadonlyKeys<ProductDetails, 'price'>;
// Result type:
// {
//   id: number;
//   name: string;
//   readonly price: number;
// }
const happyStandardCase: Case1 = { id: 1, name: 'Lê Mạnh Tưởng', price: 3 };
expectType<Case1>(happyStandardCase);

const happyErrorCase = {
  name: 'Lê Mạnh Tưởng',
  id: 1,
};
expectNotAssignable<Case1>(happyErrorCase);
