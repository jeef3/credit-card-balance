#!/usr/bin/env babel-node

import fs from 'fs';

import minimist from 'minimist';
import chalk from 'chalk';
import Table from 'cli-table';

import reconcile from 'reconcile';

const argv = minimist(process.argv.slice(2));
const csvFileName = argv._[0];

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

const reconciled = reconcile(transactions);

const display = new Table({
  head: [
    'Amount',
    'Date',
    'Payee',
    'Paid'
  ]
});

reconciled.forEach(match => {
  const { debit, matches } = match;

  let paid;
  if (matches.length === 0) {
    paid = chalk.red('✘');
  } else if (matches.length === 1) {
    paid = chalk.green('✓');
  } else {
    paid = chalk.yellow.bold('?');
  }

  display.push([
    '$ ' + Math.abs(debit.amount / 100).toFixed(2),
    debit.date,
    debit.payee,
    paid
  ]);
})
console.log(display.toString());
