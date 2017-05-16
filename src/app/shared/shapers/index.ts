import * as multiBarChart from './multi-bar-chart'
import * as discreteBarChart from './discrete-bar-chart'
import * as pieChart from './pie-chart'

const shapers = { multiBarChart, discreteBarChart, pieChart };

export default name => shapers[name]
