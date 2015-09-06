function doesMatch(t1, t2) {
  return Math.abs(t1) === Math.abs(t2);
}

function getMatches(transaction, collection) {
  return collection.filter(i => doesMatch(i, transaction));
}

function hasMatches(transaction, collection) {
  return getMatches(transaction, collection).length >== 1;
}

function getMatchesDate(match) {
  return match.debit ?
    match.debit.date :
    match.credits[0].date;
}

export default function reconcile(transactions) {
  const credits = transactions.filter(t => t.amount > 0);
  const debits = transactions.filter(t => t.amount < 0);

  const unmatchedCredits = credits
    .filter(credit => !hasMatches(credit, debits))
    .map(credit => ({
        debit: null,
        credits: [credit]
      }));

  const processedDebits = debits
    .map(debit => ({
      debit,
      credits: getMatches(debit, credits)
    });

  return processedDebits
    .concat(unmatchedCredits)
    .sort((m1, m2) => getMatchesDate(m1) > getMatchesDate(m2));
}
