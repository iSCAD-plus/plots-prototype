import R from 'ramda';
import S from 'sanctuary';

// debug use only
const log = R.tap(console.log);

const shapeMultiSeries = R.compose(
  R.map(
    R.compose(
      R.zipObj(['key', 'values']),
      R.over(R.lensIndex(1), R.map(R.omit('seriesKey'))),
    ),
  ),
  R.toPairs,
  R.groupBy(R.prop('seriesKey')),
);

const shapeSingleSeries = R.compose(
  R.merge({key: 'series1'}),
  R.objOf('values'),
);

const isMultiSeries = R.compose(
  S.isJust,
  S.chain(S.get(S.is(String), 'seriesKey')),
  S.head,
);

export const getBarChartValues = R.ifElse(
  isMultiSeries,
  shapeMultiSeries,
  shapeSingleSeries,
);
