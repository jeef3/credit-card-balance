import Transaction from './Transaction';
import DebitResult from './DebitResult';
import doesMatch from './does-match';

function nextGuid() {
  var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default (
  results : DebitResult[],
  transactions : Transaction[]
) : DebitResult[] => {

  return results.map((result) => {
    const conflicts = results.filter(r2 => doesMatch(result.debit, r2.debit));

    // No conflicts, skip it.
    if (!conflicts.length) { return result; }

    // See if any of the existing conflicts already have a conflict id.
    const existing = conflicts.find(c => !!c.conflict);

    // Use either the existing id, or create a new one
    const cid = existing ? existing.conflict : nextGuid();

    return Object.assign({}, result, { conflict: cid });
  });
}
