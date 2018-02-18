// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//var dragDrop = require('drag-drop');
var WebTorrent = require('webtorrent');
//var WebTorrent = require('webtorrent-hybrid');

var magnetURI = 'magnet:?xt=urn:btih:fe06cb11946b7397f213017615e3d2c232816a60&dn=gd3mechs.pck&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';

var client = new WebTorrent();

var update_clienttorrent = function(torrent){
  var $numPeers = document.querySelector('#numPeers');
  var $downloaded = document.querySelector('#downloaded');
  var $total = document.querySelector('#total');
  var $remaining = document.querySelector('#remaining');
  var $uploadSpeed = document.querySelector('#uploadSpeed');
  var $downloadSpeed = document.querySelector('#downloadSpeed');

  // Peers
  $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');
  // Progress
  var progress = document.querySelector('#progress');
  progress.innerHTML ="progress: "+ (torrent.progress * 100).toFixed(1) + '%';
  // downloaded
  $downloaded.innerHTML ="Downloaded:"+ prettyBytes(torrent.downloaded);
  // Remaining time
  var remaining;
  if (torrent.done) {
    remaining = 'Done.';
  } else {
    remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize();
    remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
  }
  $remaining.innerHTML = "Remaining:"+ remaining;
  //total
  $total.innerHTML ="Total:"+ prettyBytes(torrent.length);

  $downloadSpeed.innerHTML = "DownloadSpeed:"+ prettyBytes(torrent.downloadSpeed) + '/s';
  $uploadSpeed.innerHTML = "UploadSpeed:"+ prettyBytes(torrent.uploadSpeed) + '/s';
}

var updateclient = function(){
  var cdownloadSpeed = document.querySelector('#cdownloaded');
  var cuploadSpeed = document.querySelector('#cuploadSpeed');

  cdownloadSpeed.innerHTML = prettyBytes(client.downloadSpeed) + '/s';
  cuploadSpeed.innerHTML = prettyBytes(client.uploadSpeed) + '/s';

  //console.log(client.torrents.length);
  if(client.torrents.length > 0){
    //console.log(client.torrents[0]);
    update_clienttorrent(client.torrents[0]);
  }
  console.log("update client...");
};

var interval = setInterval(()=>{
  updateclient();
}, 1000);

client.on('error', function (err) {
  console.error('ERROR: ' + err.message);
})

client.on('torrent', function (torrent) {
  console.log("test torrent");
});

console.log("init.. client");
var port = 3000;
var config_opts = {
  path:"./gamedata"
}

window.onload=function(){
  document.querySelector('#torrentId').value = magnetURI;
}

//status
client.on('download', function (bytes) {
  console.log('just downloaded: ' + bytes);
  var downloadSpeed = document.querySelector('#downloadSpeed');
  downloadSpeed.innerHTML = (client.progress * 100).toFixed(1) + '%';
  console.log('total downloaded: ' + client.downloaded);
  var downloaded = document.querySelector('#downloaded');
  downloaded.innerHTML = "Downloaded:" + client.downloaded;
  console.log('download speed: ' + client.downloadSpeed);
  var downloadSpeed = document.querySelector('#progress');
  downloadSpeed.innerHTML = prettyBytes(client.downloadSpeed) + '/s'
  console.log('upload speed: ' + client.uploadSpeed);
  var downloadSpeed = document.querySelector('#uploadSpeed');
  downloadSpeed.innerHTML = prettyBytes(client.uploadSpeed) + '/s'
  console.log('progress: ' + (client.progress * 100).toFixed(1) + '%');
  var progress = document.querySelector('#progress');
  progress.innerHTML = (client.progress * 100).toFixed(1) + '%';
});

client.add(magnetURI, config_opts, function (torrent) {
  var server = torrent.createServer()
  server.listen(port) // start the server listening to a port
  //console.log(torrent);
  torrent.on('ready', function () {
    console.log("torrent ready!");
  });

  var $numPeers = document.querySelector('#numPeers');
  var $downloaded = document.querySelector('#downloaded');
  var $total = document.querySelector('#total');
  var $remaining = document.querySelector('#remaining');
  var $uploadSpeed = document.querySelector('#uploadSpeed');
  var $downloadSpeed = document.querySelector('#downloadSpeed');

  var updatetorrent = function(){
    // Peers
    $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers');
    // Progress
    var progress = document.querySelector('#progress');
    progress.innerHTML ="progress: "+ (torrent.progress * 100).toFixed(1) + '%';
    // downloaded
    $downloaded.innerHTML ="Downloaded:"+ prettyBytes(torrent.downloaded);
    // Remaining time
    var remaining;
    if (torrent.done) {
      remaining = 'Done.';
    } else {
      remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize();
      remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
    }
    $remaining.innerHTML = "Remaining:"+ remaining;
    //total
    $total.innerHTML ="Total:"+ prettyBytes(torrent.length);

    $downloadSpeed.innerHTML = "DownloadSpeed:"+ prettyBytes(torrent.downloadSpeed) + '/s';
    $uploadSpeed.innerHTML = "UploadSpeed:"+ prettyBytes(torrent.uploadSpeed) + '/s';
  }
  var interval = setInterval(()=>{
    updatetorrent();
  }, 5000);

  torrent.on('done', function(){
    console.log('torrent finished downloading');
    console.log('Progress: 100%');
    updatetorrent();
    clearInterval(interval)
    torrent.files.forEach(function(file){
       // do something with file
    })
  })

  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);
  torrent.files.forEach(function (file) {
	  console.log("file?")
    // Display the file by appending it to the DOM. Supports video, audio, images, and
    // more. Specify a container element (CSS selector or reference to DOM node).
    //file.appendTo('body')
  });
});

// When user drops files on the browser, create a new torrent and start seeding it!
/*
dragDrop('#dropTarget', function (files) {
  client.seed(files, function (torrent) {
  console.log('Client is seeding:', torrent.infoHash);
	console.log('Client is seeding:', torrent.magnetURI);
	console.log(torrent);
  });
});
*/

// Human readable bytes util
function prettyBytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}