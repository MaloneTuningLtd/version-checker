const semver = require('semver');

const coerceIfInvalid = v => {
  if (semver.valid(v)) {
    return v;
  }

  const coercedVersion = semver.coerce(v);
    
  return (semver.valid(coercedVersion))
    ? coercedVersion
    : null;
};

module.exports = (propertyName = '') => (a, b) => {
  let propertyA = a;
  let propertyB = b;

  if (propertyName !== '') {
    propertyA = a[propertyName];
    propertyB = b[propertyName];
  }

  propertyA = coerceIfInvalid(propertyA);
  propertyB = coerceIfInvalid(propertyB);

  return semver.rcompare(propertyA, propertyB);
};
