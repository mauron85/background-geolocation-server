// Read about motivation and how to prepare data for this script
// https://www.genymotion.com/blog/simulate-gps-movements/

var file = process.argv[2];
if (!file) {
  console.error('You need to provide CSV file as input parameter');
  process.exit(1);
}

var spawn = require('child_process').spawn;
var genyShell = spawn('genyshell');
var mockProvider = require('./mockProvider');

process.on('SIGINT', function() {
  genyShell.kill();
  process.exit(1);
});

mockProvider.logStdOut(genyShell.stdout);
console.log();

genyShell.stdin.setEncoding('utf-8');
genyShell.stdin.write('gps setstatus enabled\n');

mockProvider(file)
  .onLine(function(line) {
    var data = line.split(',');
    // adjust accordingly to your CSV structure
    var lat = roundTo(Number(data[1]), 4);
    var lon = roundTo(Number(data[2]), 4);   

    var command = [
      'gps setlatitude ' + String(lat).replace('.', '.'),
      'gps setlongitude ' + String(lon).replace('.', '.')
    ].join('\n');
    genyShell.stdin.write(command + '\n');

    return [lat, lon];
  })
  .onEnd(function() {
    // All lines are read, file is closed now.
    genyShell.stdin.end();
    genyShell.kill();
    process.exit(0);
  });

function roundTo(number, digits) {
  var exp = Math.pow(10, digits);
  return Math.round(number * exp) / exp;
}
