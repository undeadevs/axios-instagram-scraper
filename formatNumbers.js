module.exports = function formatNumber(n, p, ts, dp) {
    var t = [];
    // Get arguments, set defaults
    if (typeof p  == 'undefined') p  = 2;
    if (typeof ts == 'undefined') ts = ',';
    if (typeof dp == 'undefined') dp = '.';
  
    // Get number and decimal part of n
    n = Number(n).toFixed(p).split('.');
  
    // Add thousands separator and decimal point (if requied):
    for (var iLen = n[0].length, i = iLen? iLen % 3 || 3 : 0, j = 0; i <= iLen; i+=3) {
      t.push(n[0].substring(j, i));
      j = i;
    }
    // Insert separators and return result
    return t.join(ts) + (n[1]? dp + n[1] : '');
  }