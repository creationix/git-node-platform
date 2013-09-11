var crypto = require('crypto');

module.exports = function (buffer) {
  if (buffer === undefined) return create();
  var shasum = create();
  shasum.update(buffer);
  return shasum.digest();
}

// A streaming interface for when nothing is passed in.
function create() {
  var sha1sum = crypto.createHash('sha1');
  return { update: update, digest: digest };

  function update(data) {
    sha1sum.update(data);
  }

  function digest() {
    return sha1sum.digest('hex');
  }
}
