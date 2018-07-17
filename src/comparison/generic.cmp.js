module.exports = (propertyName = '') => (a, b) => {
  let propertyA = a;
  let propertyB = b;

  if (propertyName !== '') {
    propertyA = a[propertyName];
    propertyB = b[propertyName];
  }

  if (propertyA < propertyB) return 1;
  if (propertyA > propertyB) return -1;
  return 0;
};
