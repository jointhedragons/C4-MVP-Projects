const escReg = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

module.exports = escReg;