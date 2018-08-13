import { groupBy } from "lodash";

const pivotValKey = 'name',
      pivotIDKey = '_pivotID',
      subRowsKey = 'children',
      aggregatedKey = '_aggregated',
      nestingLevelKey = '_nestingLevel',
      originalKey = '_original',
      indexKey = '_index',
      groupedByPivotKey = '_groupedByPivot';

const aggregate = (rows, columns) => {
  const aggregationValues = {}
  columns.forEach(column => {
    const values = rows.map(d => d[column.id])
    aggregationValues[column.id] = column.aggregate(values, rows)
  })
  return aggregationValues
};

const groupRecursively = (rows, keys, i = 0) => {
  // This is the last level, just return the rows
  if (i === keys.length) {
    return rows
  }
  // Group the rows together for this level
  let groupedRows = Object.entries(_.groupBy(rows, keys[i])).map(([key, value]) => ({
    [pivotValKey]: key,
    [subRowsKey]: value
  }));
  // Recurse into the subRows
  groupedRows = groupedRows.map(rowGroup => {
    const subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1)
    return {
      ...rowGroup,
      [subRowsKey]: subRows
      // ...aggregate(subRows, Object.keys(rows[0])),
    }
  })
  return groupedRows
};
