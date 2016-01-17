import Transaction from './Transaction';
import DebitResult from './DebitResult';
import makeDebitResults from './make-debit-results';
import matchCreditsToDebits from './match-credits-to-debits';
import findConflicts from './find-conflicts';
// import resolveCredits from './resolve-credits';

// Debit results pipeline
const pipeline: ((d:DebitResult[], t:Transaction[]) => DebitResult[])[] = [
  makeDebitResults,
  matchCreditsToDebits,
  findConflicts,
  // resolveCredits
];

export default (transactions: Transaction[]) : DebitResult[] => {
  return pipeline.reduce((r, fn) => fn(r, transactions), []);
}
