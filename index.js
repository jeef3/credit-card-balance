#!/usr/bin/env babel-node

import fs from 'fs';

import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table';
import moment from 'moment';

import matchDebits from './match-debits';
import findConflicts from './find-conflicts';
import applyCredits from './apply-credits';

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

// Results pipeline
const results = [
    matchDebits,
    findConflicts,
    applyCredits
  ].reduce((result, fn) => fn(result), transactions);

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

results.forEach(match => {
  const {
    debit,
    matches,
    conflict,
    credit
  } = match;

  let paid;
  if (credit) {
    paid = chalk.green('✓');
  } else if (matches.length) {
    paid = chalk.yellow.bold('?');
  } else {
    paid = chalk.red('✘');
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
      paid,
      `$ ${credit.amount}`,
      ''
    ])
  }
})

console.log(display.toString());
