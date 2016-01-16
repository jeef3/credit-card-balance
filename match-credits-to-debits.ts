import DebitResult from './DebitResult';
import Transaction from './Transaction';
import TransactionType from './TransactionType';
import doesMatch from './does-match';

export default (
  results : DebitResult[],
  transactions : Transaction[]
) : DebitResult[] => {

  const credits = transactions.filter(t => t.type === TransactionType.Credit);

  return results.map(r => Object.assign({}, r, {
    credits: credits.filter(c => doesMatch(c, r.debit)),
  }));
}
