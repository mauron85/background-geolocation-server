// Read about motivation and how to prepare data for this script
// https://www.genymotion.com/blog/simulate-gps-movements/

var file = process.argv[2];
if (!file) {
  console.error('You need to provide CSV file as input parameter');
  process.exit(1);
}

var fs = require('fs');
var spawn = require('child_process').spawn;
var LineByLineReader = require('line-by-line');

var speed = 100 * 1000 / 3600; // 100km/hour in meter/second
var previousPoint;

var genyshell = spawn('genyshell');

process.on('SIGINT', function() {
  genyshell.kill();
});

genyshell.stdin.setEncoding('utf-8');
genyshell.stdin.write('gps setstatus enabled\n');

var lr = new LineByLineReader(file);
lr.on('error', function (err) {
	// 'err' contains error object
});

lr.on('line', function (line) {
	// pause emitting of lines...
	lr.pause();

  var data = line.split(',');
  // adjust accordingly to your CSV structure
  var lat = String(data[1]).replace('.', ',');
  var lon = String(data[2]).replace('.', ',');
  var command = [
    'gps setlatitude ' + lat,
    'gps setlongitude ' + lon
  ].join('\n');
  genyshell.stdin.write(command + '\n');
  console.log(command);

	setTimeout(function () {
    // ...and continue emitting lines.
    lr.resume();
	}, 3000);
});

lr.on('end', function () {
  // All lines are read, file is closed now.
  genyshell.stdin.end();
  genyshell.kill();
});
