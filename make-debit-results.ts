import Transaction from './Transaction';
import TransactionType from './TransactionType';
import DebitResult from './DebitResult';

export default (
  results : DebitResult[],
  transactions : Transaction[]
) : DebitResult[] => {
  console.log('making debit results', results);
  return transactions
    .filter(t => t.type === TransactionType.Debit)
    .map(t => ({
      debit: t,
      credits: []
    }));
}
