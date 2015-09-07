function doesMatch(t1, t2) {
  return Math.abs(t1) === Math.abs(t2);
}

function getMatches(transaction, collection) {
  return collection.filter(i => doesMatch(i, transaction));
}

function hasMatches(transaction, collection) {
  return getMatches(transaction, collection).length >= 1;
}

function getMatchesDate(match) {
  return match.debit ?
    match.debit.date :
    match.matches[0].date;
}

export default function matchDebits(transactions) {
  const credits = transactions.filter(t => t.amount > 0);
  const debits = transactions.filter(t => t.amount < 0);

  const danglingCredits = credits
    .filter(credit => !hasMatches(credit, debits))
    .map(credit => ({
      debit: null,
      matches: [credit]
    }));

  const matchedDebits = debits
    .map(debit => ({
      debit,
      matches: getMatches(debit, credits)
    }));

  return []
    .concat(matchedDebits)
    .concat(danglingCredits)
    .sort((m1, m2) => getMatchesDate(m1) > getMatchesDate(m2));
}
