import Transaction from './Transaction';
import DebitResult from './DebitResult';

export default (transactions : Transaction[]) : DebitResult[] => {
  return transactions.map(t => ({
    debit: t,
    credits: []
  }));
}
