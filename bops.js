
var proto = Buffer.prototype;
var call = Function.prototype.call;

var bops = module.exports = {
  from: Buffer,
  to: call.bind(proto.toString),
  is: Buffer.isBuffer,
  subarray: call.bind(proto.slice),
  join: Buffer.concat,
  copy: call.bind(proto.copy),
  create: Buffer,
};

for (var key in proto) {
  if (!(/^(?:write|read)/).test(key)) continue;
  bops[key] = call.bind(proto[key]);
}

