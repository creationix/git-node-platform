var fs = require('fs');
var pathJoin = require('path').join;
var pathResolve = require('path').resolve;

module.exports = chroot;
chroot.read = read;
chroot.read = read;
chroot.write = write;
chroot.unlink = unlink;
chroot.readlink = readlink;
chroot.symlink = symlink;
chroot.readdir = readdir;
chroot.rmdir = rmdir;
chroot.mkdir = mkdir;
chroot.rename = rename;
chroot.mkdir = mkdir;

function chroot(root) {
  root = pathResolve(process.cwd(), root);
  var exports = wrap(chroot);
  exports.root = root;
  exports.stat = wrap(stat);
  exports.read = wrap(read);
  exports.write = wrap(write);
  exports.unlink = wrap(unlink);
  exports.readlink = wrap(readlink);
  exports.symlink = wrap(symlink);
  exports.readdir = wrap(readdir);
  exports.rmdir = wrap(rmdir);
  exports.mkdir = wrap(mkdir);
  exports.rename = wrap(rename, true);
  return exports;

  function wrap(fn, two) {
    return function () {
      arguments[0] = pathJoin(root, pathJoin("/", arguments[0]));
      if (two) arguments[1] = pathJoin(root, pathJoin("/", arguments[1]));
      return fn.apply(this, arguments);
    };
  }
}

// Given a path, return a continuable for the stat object.
function stat(path, callback) {
  if (!callback) return stat.bind(this, path);
  fs.lstat(path, function (err, stat) {
    if (err) return callback(err);
    var ctime = stat.ctime / 1000;
    var cseconds = Math.floor(ctime);
    var mtime = stat.mtime / 1000;
    var mseconds = Math.floor(mtime);
    var mode;
    if (stat.isSymbolicLink()) {
      mode = 0120000;
    }
    else if (stat.mode & 0111) {
      mode = 0100755;
    }
    else {
      mode = 0100644;
    }
    callback(null, {
      ctime: [cseconds, Math.floor((ctime - cseconds) * 1000000000)],
      mtime: [mseconds, Math.floor((mtime - mseconds) * 1000000000)],
      dev: stat.dev,
      ino: stat.ino,
      mode: mode,
      uid: stat.uid,
      gid: stat.gid,
      size: stat.size
    });
  });
}

function read(path, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = undefined;
  }
  if (!callback) return read.bind(this, path, encoding);
  fs.readFile(path, encoding, callback);
}

function write(path, value, mode, callback) {
  if (!callback) return write.bind(this, path, value, mode);
  fs.writeFile(path, value, {mode: mode}, callback);
}

function unlink(path, callback) {
  if (!callback) return unlink.bind(this, path);
  fs.unlink(path, callback);
}

function readlink(path, callback) {
  if (!callback) return readlink.bind(this, path);
  fs.readlink(path, callback);
}

function symlink(path, value, callback) {
  if (!callback) return symlink.bind(this, path, value);
  fs.symlink(value, path, callback);
}

function readdir(path, callback) {
  if (!callback) return readdir.bind(this, path);
  fs.readdir(path, callback);
}

function rmdir(path, callback) {
  if (!callback) return rmdir.bind(this, path);
  fs.rmdir(path, callback);
}

function mkdir(path, callback) {
  if (!callback) return mkdir.bind(this, path);
  fs.mkdir(path, callback);
}

function rename(source, target, callback) {
  if (!callback) return rename.bind(this, source, target);
  fs.rename(source, target, callback);
}
