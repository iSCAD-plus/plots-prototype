// This file is written in non-babel syntax so TS compiler can
// consume it without needing babel to be included in the
// build pipeline

const R = require('ramda');
const S = require('sanctuary');

// debug use only, nice when you need to see what is happening
// at a certain point in a composed list of functions
const log = R.tap(console.log);

// This is to get around a bug where datapoint objects
// are sealed somewhere and nvd3 expects them later
// to be extensible, in order to dodge we add a
// dummy value to the property up front
const addSeriesKeyForNvd3 = R.map(R.merge({ series: 0 }));
const groupByProp = (xs, prop) => R.groupBy(R.prop(prop), xs);

exports.shapeMultiSeries = R.compose(
  R.map(R.compose(
    R.zipObj(['key', 'values']),
    R.over(R.lensIndex(1), addSeriesKeyForNvd3),
  )),
  R.toPairs,
  groupByProp,
);

exports.shapeSingleSeries = R.compose(
  R.of,
  R.merge({ key: 'series0' }),
  R.objOf('values'),
  addSeriesKeyForNvd3,
);
