// Read about motivation and how to prepare data for this script
// https://www.genymotion.com/blog/simulate-gps-movements/

var MAX_TABLE_ROWS = 5;
var MAX_SHELL_LINES = 5;
var DEFAULT_SPEED_IN_KM_PER_HOUR = 60;

var LineByLineReader = require('line-by-line');
require('draftlog').into(console);

function logStdOut(stdout) {
  console.log('============================================================');
  console.log('Shell output:');
  console.log('============================================================');

  var logger = new Logger(MAX_SHELL_LINES);

  emitLines(stdout);
  stdout.on('line', function(data) {
    logger.log(data);
  });
}

function locationLogger() {
  var tableHeaders = [
    'Row Nr. ',
    ' Latitude ',
    ' Longitude. ',
    ' Distance[m] ',
    ' Speed[km/h] '
  ];
  console.log('============================================================');
  console.log(tableHeaders.join('|'));
  console.log('============================================================');

  var logger = new Logger(MAX_TABLE_ROWS);
  logger.tableHeaders = tableHeaders;
  return logger;
}

function mockProvider(file) {
  var onError = function() {};
  var onLine = function() {};
  var onEnd = function() {};
  var logger = locationLogger();
  var lr = new LineByLineReader(file);
  var previousPoint;
  var row = 0;

  lr.on('error', function(err) {
    // 'err' contains error object
    onError(err);
  });

  lr.on('line', function(line) {
    // pause emitting of lines...
    lr.pause();

    var data = onLine(line);
    var lat = data[0];
    var lon = data[1];
    var speed =
      !isNaN(+data[3]) && !isNaN(parseFloat(data[3]))
        ? +data[3]
        : DEFAULT_SPEED_IN_KM_PER_HOUR;

    var distance = 0;
    if (previousPoint) {
      distance = getDistanceFromLatLonInKm(
        previousPoint[0],
        previousPoint[1],
        lat,
        lon
      );
    }

    var sleepInMillis = Math.round(distance / speed * 3600 * 1000);
    var tableRow = [
      ++row,
      lat,
      lon,
      Math.round(distance * 1000), // in meters
      speed
    ];
    // add padding according table header
    tableRow = tableRow.map(function(val, i) {
      return padding_left(String(val), ' ', logger.tableHeaders[i].length - 1);
    });
    logger.log(tableRow.join(' |'));

    previousPoint = [lat, lon];
    setTimeout(function() {
      // ...and continue emitting lines.
      lr.resume();
    }, sleepInMillis);
  });

  lr.on('end', function() {
    onEnd();
  });

  var events = {
    onLine: function(func) {
      onLine = func;
      return events;
    },
    onError: function(func) {
      onError = func;
      return events;
    },
    onEnd: function(func) {
      onEnd = func;
      return events;
    }
  };

  return events;
}

// https://stackoverflow.com/a/27943/3896616
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * By TooTallNate, originally posted at https://gist.github.com/1785026
 * A quick little thingy that takes a Stream instance and makes
 * it emit 'line' events when a newline is encountered.
 *
 *   Usage:
 *   ‾‾‾‾‾
 *  emitLines(process.stdin)
 *  process.stdin.resume()
 *  process.stdin.setEncoding('utf8')
 *  process.stdin.on('line', function (line) {
 *    console.log(line event:', line)
 *  })
 *
 */
function emitLines(stream) {
  var backlog = '';
  stream.on('data', function(data) {
    backlog += data;
    var n = backlog.indexOf('\n');
    // got a \n? emit one or more 'line' events
    while (~n) {
      stream.emit('line', backlog.substring(0, n));
      backlog = backlog.substring(n + 1);
      n = backlog.indexOf('\n');
    }
  });
  stream.on('end', function() {
    if (backlog) {
      stream.emit('line', backlog);
    }
  });
}

// left padding s with c to a total of n chars
function padding_left(s, c, n) {
  if (!s || !c || s.length >= n) {
    return s;
  }
  var max = (n - s.length) / c.length;
  for (var i = 0; i < max; i++) {
    s = c + s;
  }
  return s;
}

function Logger(maxLines) {
  var drafts = new Array(maxLines);
  for (var i = 0; i < maxLines; i++) {
    drafts[i] = console.draft();
  }
  this.drafts = drafts;
  this.buffer = [];
}

Logger.prototype.log = function(text) {
  var self = this;
  this.buffer.push(text);
  if (this.buffer.length > this.drafts.length) {
    this.buffer.shift();
  }
  this.buffer.forEach(function(bufferText, i) {
    self.drafts[i](bufferText);
  });
};

module.exports = mockProvider;
module.exports.logStdOut = logStdOut;
