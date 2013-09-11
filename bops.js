
var bops = module.exports = {
  from: from,
  to: to,
  is: is,
  subarray: subarray,
  join: join,
  copy: copy,
  create: create,
};

var proto = Buffer.prototype;
var call = Function.prototype.call;
for (var key in proto) {
  if (!(/^(?:write|read)/).test(key)) continue;
  bops[key] = call.bind(proto[key]);
}

function from(source, encoding) {
  return new Buffer(source, encoding);
}

function to(source, encoding) {
  return source.toString(encoding);
}

function is(buffer) {
  return Buffer.isBuffer(buffer);
}

function subarray(source, from, to) {
  return arguments.length === 2 ?
    source.slice(from) :
    source.slice(from, to);
}

function join(targets, hint) {
  return hint !== undefined ?
    Buffer.concat(targets, hint) :
    Buffer.concat(targets);
}

function copy(source, target, targetStart, sourceStart, sourceEnd) {
  return source.copy(target, targetStart, sourceStart, sourceEnd);
}

function create(size) {
  return new Buffer(size);
}
