import Transaction from './Transaction';
import TransactionType from './TransactionType';

export default (t1: Transaction, t2: Transaction) => {
  const t1a = parseFloat(t1.amount);
  const t2a = parseFloat(t2.amount);
  return Math.abs(t1a) === Math.abs(t2a);
}

