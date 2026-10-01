(function (root) {
  'use strict';
  var FT_PER_M = 3.28084;
  function toFt(v, unit) { return unit === 'm' ? v * FT_PER_M : v; }
  // Boiling-water canner (University of Kentucky FCS3-591 Tables 1 and 2, same rules as NCHFP / USDA Complete Guide)
  // base = process minutes the recipe gives for 0-1,000 ft. type: 'standard' or 'jelly' (jams, jellies, preserves)
  function boiling(baseMin, altFt, type) {
    if (altFt <= 1000) return { ok: true, add: 0, total: baseMin, rule: 'As written (0 to 1,000 ft)' };
    if (type === 'jelly') {
      var a = Math.ceil((altFt - 1000) / 1000);
      return { ok: true, add: a, total: baseMin + a, rule: 'Jellied products: 1 minute per 1,000 ft above 1,000 ft (rounded up)' };
    }
    if (altFt > 6000) return { ok: false, reason: 'Above 6,000 ft the generic rule does not apply. Use the processing table that comes with your tested recipe.' };
    var add = baseMin < 20 ? 5 : (altFt <= 3000 ? 5 : 10);
    return { ok: true, add: add, total: baseMin + add, rule: baseMin < 20 ? 'Under 20 minutes: add 5 minutes (1,001 to 6,000 ft)' : (altFt <= 3000 ? '20 minutes or longer: add 5 minutes (1,001 to 3,000 ft)' : '20 minutes or longer: add 10 minutes (3,001 to 6,000 ft)') };
  }
  // Pressure canner (UK FCS3-591 Table 3): recipes written for 10 lb weighted / 11 lb dial at sea level. Times do not change.
  function pressure(baseMin, altFt, gauge) {
    var band;
    if (altFt <= 1000) band = 0; else if (altFt <= 2000) band = 1; else if (altFt <= 4000) band = 2; else if (altFt <= 6000) band = 3; else return { ok: false, reason: 'Above 6,000 ft is outside this table. Use the pressure your tested recipe or canner manual gives for your elevation.' };
    var w = [10, 15, 15, 15], d = [11, 11, 12, 13];
    return { ok: true, psi: gauge === 'dial' ? d[band] : w[band], total: baseMin, band: band, rule: 'Process time stays ' + baseMin + ' minutes; only the pressure changes' };
  }
  function bandLabel(altFt) { return altFt <= 1000 ? '0 to 1,000 ft' : altFt <= 2000 ? '1,001 to 2,000 ft' : altFt <= 3000 ? '2,001 to 3,000 ft' : altFt <= 4000 ? '3,001 to 4,000 ft' : altFt <= 6000 ? '4,001 to 6,000 ft' : 'above 6,000 ft'; }
  // Rough boiling point: about 1 F lower per 500 ft (approximation)
  function boilF(altFt) { return 212 - altFt / 500; }
  function fToC(f) { return (f - 32) * 5 / 9; }
  var api = { FT_PER_M: FT_PER_M, toFt: toFt, boiling: boiling, pressure: pressure, bandLabel: bandLabel, boilF: boilF, fToC: fToC };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Alt = api;
})(typeof window !== 'undefined' ? window : this);
