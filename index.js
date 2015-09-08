#!/usr/bin/env babel-node

import fs from 'fs';

import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table';
import moment from 'moment';

import matchDebits from './match-debits';
import findConflicts from './find-conflicts';

const argv = minimist(process.argv.slice(2));
const csvFileName = argv._[0];

// Read raw transactions
const transactions = fs
  .readFileSync(csvFileName)
  .toString()
  .split('\n')
  .map(row => {
    const parts = row.split(',');
    return {
      date: moment(parts[0], 'DD/MM/YY'),
      amount: parts[1],
      payee: parts[2],
      particulars: parts[3],
      code: parts[4],
      reference: parts[5],
      type: parts[6]
    };
  });


// Raw
// const conflictsMatched = transactions
//   .reduce(matchDebits, [])
//   .reduce(findConflicts, []);

const matchedDebits = matchDebits(transactions);

// Auto-pass
const conflictsMatched = findConflicts(matchedDebits);

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

conflictsMatched.forEach(match => {
  const { debit, matches, conflict } = match;

  let paid;
  if (matches.length === 0) {
    paid = chalk.red('✘');
  } else if (matches.length === 1) {
    paid = chalk.green('✓');
  } else {
    paid = chalk.yellow.bold('?');
  }

  if (debit) {
    display.push([
      `$ ${debit.amount}`,
      debit.date.format('DD-MM-YY'),
      debit.payee,
      paid,
      matches.length ? `$ ${matches[0].amount}` : '',
      conflict || ''
    ]);
  } else {
    display.push([
      '',
      '',
      '',
      chalk.red('✘'),
      matches.length ? `$ ${matches[0].amount}` : '',
      conflict || ''
    ])
  }
})

console.log(display.toString());
