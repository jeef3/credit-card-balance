#!/usr/bin/env babel-node

import fs from 'fs';

import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table';

import matchDebits from './match-debits';

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
      date: parts[0],
      amount: parseInt(parts[1] * 100, 10),
      payee: parts[2],
      particulars: parts[3],
      code: parts[4],
      reference: parts[5],
      type: parts[6]
    };
  });


// Prepare matches
const matchedDebits = matchDebits(transactions);

const display = new Table({
  head: [
    'Amount',
    'Date',
    'Payee',
    'Paid',
    'Amount'
  ]
});

matchedDebits.forEach(match => {
  const { debit, matches } = match;

  console.log(match);

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
      '$ ' + Math.abs(debit.amount / 100).toFixed(2),
      debit.date,
      debit.payee,
      paid,
      matches.length ? matches[0].amount : ''
    ]);
  } else {
    display.push([
      '',
      '',
      '',
      chalk.red('✘'),
      matches.length ? matches[0].amount : ''
    ])
  }
})
console.log(display.toString());
