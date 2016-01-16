import Transaction from './Transaction';
import DebitResult from './DebitResult';

export default (
  results : DebitResult[],
  transactions : Transaction[]
) : DebitResult[] => {

  return results.map(result => {
      // Check conflicts
      if (result.conflict) {
        const conflicts = results.filter(r => r.conflict === result.conflict);

        if (conflicts.length === result.conflict.length) {
          return Object.assign({}, result, { resolved: true });
        }
      }

      if (result.credits.length === 1) {
        return Object.assign({}, result, { resolved: true });
      }
  });
}
