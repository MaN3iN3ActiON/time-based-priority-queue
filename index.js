const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
const PriorityQueue = require('./pq');
const dateFormat = require('dateformat');
const chalk = require('chalk');

const [file = 'input.csv', startTimeString = 0] = [...process.argv.slice(2)];
const startTime = dateFormat(startTimeString);
const stms = Date.parse(startTime);

const parser = parse({
	delimiter: ',',
	quote: '"',
	ltrim: true,
	rtrim: true,
	trim: true,
	skip_empty_lines: true,
	relax_column_count: true,
	columns: true,
	skip_lines_with_error:true
});

const data = new PriorityQueue();
fs.createReadStream(path.join(__dirname, file))
	.pipe(parser)
	.on('data', ({ event_name, time_to_expire, priority = 0 }) => {
		const formatedTime = dateFormat(time_to_expire);
		const ctms = Date.parse(formatedTime);
		if (ctms > stms) {
			data.push({ name: event_name, tte: formatedTime, priority });
		}
	})
	.on('end', () => {
		processTasks(data);
	});

const processTasks = data => {
	let top;
	let currMins = 0;
	while ((top = data.pop())) {
		const topms = Date.parse(top.tte);
		const diffMs = topms - stms;
		const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
		if (currMins !== diffMins) {
			currMins = diffMins;
			console.log(chalk.yellow.bold(`--After ${currMins} minutes--`));
		}
		console.log(
			chalk.magenta('Current'),
			chalk.bold('time'),
			chalk.red('['),
			chalk.magenta(`${top.tte}`),
			chalk.red(' ] , '),
			chalk.magenta('Event'),
			chalk.blue(`"${top.name}"`),
			chalk.red('Processed')
		);
	}
	console.log(chalk.red.bold('--Finished--'));
};
