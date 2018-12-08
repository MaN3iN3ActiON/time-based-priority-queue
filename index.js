const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');
//read in arguments from command line

const [file = 'input.csv', startTime = 0] = [...process.argv.slice(2)];
console.log(file, startTime);

//process csv file
//create min hash with key as time(ms) and for same start times use priority
const parser = parse({
	delimiter: ',',
	quote: '"',
	ltrim: true,
	rtrim: true,
	trim: true,
	skip_empty_lines: true,
	relax_column_count: true,
	columns: true
});

const data = [];
fs.createReadStream(path.join(__dirname, file))
	.pipe(parser)
	.on('data', csvrow => {
		data.push(csvrow);
	})
	.on('end', () => {
		console.log(data);
	});

