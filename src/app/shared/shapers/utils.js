// This file is written in non-babel syntax so TS compiler can
// consume it without needing babel to be included in the
// build pipeline

const R = require('ramda');
const S = require('sanctuary');

// debug use only, nice when you need to see what is happening
// at a certain point in a composed list of functions
const log = R.tap(console.log);

const groupByProp = R.useWith(R.groupBy, [R.prop, R.identity]);

exports.shapeMultiSeries = R.compose(
  R.map(R.zipObj(['key', 'values'])),
  R.toPairs,
  R.flip(groupByProp),
);

exports.shapeSingleSeries = R.compose(
  R.of,
  R.merge({ key: 'series1' }),
  R.objOf('values'),
);
