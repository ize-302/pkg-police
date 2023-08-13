#! /usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require("yargs");
const figlet = require('figlet');
const { callTheCops, getFiles } = require('./pkg-police-script')

const usage = chalk.keyword('violet')("\nUsage: pkg-police -p <path> \n"
  + boxen(chalk.green("\n" + "lists out packages that are being used and those that aren't" + "\n"), { padding: 1, borderColor: 'green', dimBorder: true }) + "\n");
const options = yargs
  .usage(usage)
  .option("p", { alias: "path", describe: "Path to file(optional), defaults to root", type: "string", demandOption: false })
  .help(true)
  .argv;

const argv = require('yargs/yargs')(process.argv.slice(1)).argv;
if (argv.path == null && argv.p == null) {
  console.log(
    chalk.yellow(
      figlet.textSync('pkg-police', { horizontalLayout: 'default' })
    )
  );
}
const path = argv.p || argv.path;

callTheCops(getFiles())