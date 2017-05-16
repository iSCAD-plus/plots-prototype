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
const groupByProp = R.flip(R.useWith(R.groupBy, [R.prop, R.identity]));

exports.shapeMultiSeries = (values, seriesKey, axisInfo) => {
  const getXs = R.compose(
    R.sort((a,b) => (a-b)),
    R.uniq,
    R.map(R.path([axisInfo.x]))
  );

  const xs = getXs(values);

  const groups = groupByProp(values, axisInfo.seriesKey);

  const fillInMissing = (groupValues, groupKey) => {
    const isNumeric = R.all(Number.isInteger)(xs);

    var missingKeys = [];
    if (isNumeric) {
      const min = R.reduce(R.min, Infinity, xs);
      const max = R.reduce(R.max, -Infinity, xs);
      missingKeys = R.difference(R.range(min, max+1), getXs(groupValues));
    } else {
      missingKeys = R.difference(xs, getXs(groupValues));
    }

    const createEmpty = (x) => R.merge({
      [axisInfo.seriesKey]: groupKey,
      [axisInfo.x]: x,
      [axisInfo.y]: 0,
      series: 0,
    })(x);

    return R.sortBy(R.prop(axisInfo.x), R.concat(groupValues, R.map(createEmpty)(missingKeys)));
  }

  return R.compose(
    R.map(R.compose(
      R.zipObj(['key', 'values']),
      R.over(R.lensIndex(1), addSeriesKeyForNvd3),
    )),
    R.toPairs
  )(R.mapObjIndexed(fillInMissing, groups));
}

exports.shapeMultiSeries2 = R.compose(
  log,
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
