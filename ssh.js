var Connection = require('ssh2');
var wrapStream = require('./ssh-stream.js').wrapStream;
var trace = require('./trace.js');

module.exports = function (opts, callback) {
  var config = {
    host: opts.hostname,
    port: opts.port,
  };
  var parts = opts.auth && opts.auth.split(":") || [];
  var username = config.username || parts[0];
  var password = config.password || parts[1];
  if (username) config.username = username;
  else config.username = process.env.USER || process.env.USERNAME;
  if (password) config.password = password;
  else if (opts.privateKey) config.privateKey = opts.privateKey;
  else {
    config.privateKey = require('fs').readFileSync(process.env.HOME + "/.ssh/id_rsa");
  }
  if (opts.pathname.substr(0, 2) === "/:") opts.pathname = opts.pathname.substr(2);

  var conn = new Connection();
  conn.on("ready", onReady);
  conn.on("error", onError);
  return conn.connect(config);

  function clear() {
    conn.removeListener("ready", onReady);
    conn.removeListener("error", onError);
  }

  function onError(err) {
    clear();
    return callback(err);
  }

  function onReady() {
    if (trace) trace("connect", null, config.username + "@" + config.host + ":" + config.port);
    clear();
    return callback(null, {
      exec: exec,
      close: closeSsh
    });
  }

  function exec(command, callback) {
    command += " " + opts.pathname;
    if (trace) trace("exec", null, command);
    return conn.exec(command, function (err, stream) {
      if (err) return callback(err);
      callback(null, wrapStream(stream));
    });
  }

  function closeSsh(callback) {
    return conn.end(callback);
  }

};
