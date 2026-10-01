var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { n++; if (!(Math.abs(a - b) <= (tol || 0))) { bad++; console.log('FAIL', m, a, b); } }
function bt(m, a, t) { return E.boiling(m, a, t || 'standard').total; }
// NCHFP Example A (peaches, boiling water): hot pints 20/25/30, hot quarts 25/30/35, raw pints 25/30/35, raw quarts 30/35/40 at 0-1000 / 1001-3000 / 3001-6000 ft
[[20, 25, 30], [25, 30, 35], [25, 30, 35], [30, 35, 40]].forEach(function (r, i) {
  eq(bt(r[0], 500), r[0], 'sea ' + i); eq(bt(r[0], 1001), r[1], 'band2 low ' + i); eq(bt(r[0], 2500), r[1], 'band2 ' + i); eq(bt(r[0], 3000), r[1], 'band2 top ' + i); eq(bt(r[0], 3001), r[2], 'band3 low ' + i); eq(bt(r[0], 6000), r[2], 'band3 top ' + i);
});
// NCHFP worked example: hot-pack quarts at 2,500 ft is 30 minutes
eq(bt(25, 2500), 30, 'NCHFP example A');
// under 20 minutes: add 5 for 1,001-6,000
[5, 10, 15, 19].forEach(function (m) { eq(bt(m, 1000), m, 'u20 1000'); eq(bt(m, 1001), m + 5, 'u20 1001'); eq(bt(m, 6000), m + 5, 'u20 6000'); });
eq(bt(20, 1500) - 20, 5, '20 min counts as 20 or longer'); eq(bt(19, 4000) - 19, 5, '19 min under');
// jellied: 1 minute per 1,000 ft above 1,000
eq(bt(10, 1000, 'jelly'), 10, 'jelly 1000'); eq(bt(10, 1500, 'jelly'), 11, 'jelly 1500'); eq(bt(10, 2000, 'jelly'), 11, 'jelly 2000'); eq(bt(10, 2001, 'jelly'), 12, 'jelly 2001'); eq(bt(10, 5000, 'jelly'), 14, 'jelly 5000'); eq(bt(10, 8000, 'jelly'), 17, 'jelly 8000');
// out of range
eq(E.boiling(25, 6001, 'standard').ok ? 1 : 0, 0, 'above 6000 standard not covered'); eq(E.boiling(25, 12000, 'standard').ok ? 1 : 0, 0, '12000'); eq(E.boiling(25, 6001, 'jelly').ok ? 1 : 0, 1, 'jelly any');
// pressure canner table (UK FCS3-591 Table 3): weighted 10/15/15/15, dial 11/11/12/13
[[0, 10, 11], [1000, 10, 11], [1001, 15, 11], [2000, 15, 11], [2001, 15, 12], [4000, 15, 12], [4001, 15, 13], [6000, 15, 13]].forEach(function (r) {
  eq(E.pressure(90, r[0], 'weighted').psi, r[1], 'weighted ' + r[0]); eq(E.pressure(90, r[0], 'dial').psi, r[2], 'dial ' + r[0]);
});
eq(E.pressure(90, 5000, 'dial').total, 90, 'time unchanged'); eq(E.pressure(40, 5000, 'weighted').total, 40, 'time unchanged 2'); eq(E.pressure(90, 6001, 'dial').ok ? 1 : 0, 0, 'pressure above 6000');
// NCHFP weighted/dial example uses recipe-specific lower pressures, so is not covered by Table 3; sanity: dial never decreases with altitude
for (var a = 0; a <= 6000; a += 250) eq(E.pressure(60, a + 250 > 6000 ? 6000 : a + 250, 'dial').psi >= E.pressure(60, a, 'dial').psi ? 1 : 0, 1, 'dial monotone ' + a);
for (var a = 0; a <= 6000; a += 250) eq(bt(30, a + 250 > 6000 ? 6000 : a + 250) >= bt(30, a) ? 1 : 0, 1, 'boil monotone ' + a);
// units and boiling point
eq(E.toFt(1000, 'ft'), 1000, 'ft'); eq(E.toFt(1000, 'm'), 3280.84, 'm', 0.01); eq(E.toFt(0, 'm'), 0, 'zero m');
eq(E.boilF(0), 212, 'boil sea'); eq(E.boilF(5000), 202, 'boil 5000'); eq(E.fToC(212), 100, 'c'); eq(E.fToC(202), 94.44, 'c202', 0.01);
E.__x = 0; ['0 to 1,000 ft', '1,001 to 2,000 ft', '2,001 to 3,000 ft', '3,001 to 4,000 ft', '4,001 to 6,000 ft', 'above 6,000 ft'].forEach(function (l, i) { eq(E.bandLabel([1000, 2000, 3000, 4000, 6000, 6001][i]) === l ? 1 : 0, 1, 'label ' + i); });
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
