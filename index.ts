/// <reference path="./typings/tsd.d.ts" />

import {readFileSync} from 'fs';

const Table = require('cli-table');
import * as chalk from 'chalk';
import * as moment from 'moment';

import Transaction from './Transaction';
import DebitResult from './DebitResult';
import makeDebitResults from './make-debit-results';
import matchDebits from './match-debits';
import findConflicts from './find-conflicts';
import applyCredits from './apply-credits';

const csvFileName = 'transhist.csv';

// Read raw transactions
const transactions : Transaction[] = readFileSync(csvFileName)
  .toString()
  .split('\n')
  .map(row => row.split(','))
  .map(parts => ({
    date: moment(parts[0], 'DD/MM/YY').toDate(),
    amount: parts[1],
    payee: parts[2],
    particulars: parts[3],
    code: parts[4],
    reference: parts[5],
    type: parts[6]
  }));

console.log('Counting transactions,', transactions.length);

// Debit results pipeline
const debitResults : DebitResult[] = [
    matchDebits,
    findConflicts,
    applyCredits
  ].reduce((result, fn) => fn(result), makeDebitResults(transactions));

const display = new Table({
  head: [
    'Amount',
    'Date',
    'Payee',
    'Paid',
    'Amount',
    'Conflict'
  ]
});

debitResults.forEach(match => {
  const {
    debit,
    credits,
    conflict
  } = match;

  let paid;
  if (credits.length === 1) {
    paid = chalk.green('✓');
  } else if (credits.length) {
    paid = chalk.yellow.bold('?');
  } else {
    paid = chalk.red('✘');
  }

  if (debit) {
    display.push([
      `$ ${debit.amount}`,
      moment(debit.date).format('DD-MM-YY'),
      debit.payee,
      paid,
      credits.length ? `$ ${credits[0].amount}` : '',
      (conflict || '').substring(0, 5)
    ]);
  } else {
    display.push([
      '',
      '',
      '',
      paid,
      `$ ${credits[0].amount}`,
      ''
    ])
  }
})

console.log(display.toString());
