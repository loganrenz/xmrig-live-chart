const express = require('express');
const http = require('http')
const ws = require('ws');
const cors = require('cors');

const app = express();

var whitelist = ['http://bonito.local:8081','http://localhost:3000', 'http://localhost:8081', 'http://bonito.local:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions));


const server = http.createServer(app);
const sockets = [];

const cache_size = 86400;
const hash_rates = [];

const wsServer = new ws.Server({server});
wsServer.on('connection', socket => {
  sockets.push(socket)

  console.log(`New browser connected! Sending all hash rates: ${hash_rates.length}`)
  socket.send(JSON.stringify(hash_rates));

  socket.on('close', () => {
    let i = sockets.indexOf(socket)
    delete sockets[i]
  })
});

let fs = require('fs'),
  bite_size = 256,
  readbytes = 0,
  file;

function readsome() {
  var stats = fs.fstatSync(file); // yes sometimes async does not make sense!
  if (stats.size < readbytes + 1) {
    setTimeout(readsome, 86400);
  } else {
    fs.read(file, new Buffer(bite_size), 0, bite_size, readbytes, processsome);
  }
}

function processsome(err, bytecount, buff) {
  const buffer = buff.toString('utf-8', 0, bytecount)
  const matches = buffer.match(/\[(.*)\].*\/15m ([0-9]{0,10})\./)
  if (matches) {
    try {
      const newHashRate = {
        timestamp: matches[1],
        hash_rate: matches[2]
      }
      if(hash_rates.length > cache_size){
        hash_rates.shift()
      }
      hash_rates.push(newHashRate)      
      sockets.forEach(socket => {
        console.log(`Hash rates size: ${hash_rates.length}`)
        socket.send(JSON.stringify(
          newHashRate
        ))
      })
      console.log(`Send message ${matches[1] + "\t" + matches[2]}`);
    } catch (e) {
      console.log(e)
    }

  }
  readbytes += bytecount;
  process.nextTick(readsome);
}

fs.open('/Users/narduk/xmrig/logs/xmrig-app.log', 'r', function (err, fd) {
  file = fd;
  readsome();
});


server.listen(3001, () => {
  console.log(`Server started on port ${server.address().port}`)
})

