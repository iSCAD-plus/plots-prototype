import R from 'ramda';
import S from 'sanctuary';

const isMultiSeries = S.pipe([R.head, R.has('seriesKey')]);

const values = R.ifElse(
  S.pipe([R.head, R.has('seriesKey')]),
  S.pipe([R.groupBy(R.prop('seriesKey')), log, R.toPairs]),
  R.map(S.pipe([R.props([x, y]), R.zipObj(['x', 'y']), R.values])),
)(data.decisionQuery);
