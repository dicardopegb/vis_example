import { groupBy } from "lodash";

export default ({
  pivotValKey = "name",
  subRowsKey = "children",
  aggregate,
  computeLevel,
  prune = false
}) => {
  const groupRecursively = (data, keys, i = 0, path = "root", count = 0) => {
    // This is the last level, just return the rows
    if (i === keys.length) {
      return data;
    }
    // Group the rows together for this level
    let groupedRows = Object.entries(groupBy(data, keys[i]))
      .reduce(({ rows, c }, [key, value], ind) => (
        {
          rows: [...rows, {
            [pivotValKey]: key,
            [subRowsKey]: value,
            path: `${path}.${key}`,
            ...(computeLevel && computeLevel({ index: c, key, value }))
          }],
          c: c + 1
        }
      ), { c: count, rows: [] }
    );

    // Recurse into the subRows
    groupedRows = groupedRows.rows.map((rowGroup, j) => {
      const subRows = groupRecursively(
        rowGroup[subRowsKey],
        keys,
        i + 1,
        `${path}.${rowGroup[pivotValKey]}`,
        groupedRows.c + j + i
      );
      return {
        ...rowGroup,
        [subRowsKey]: prune ? subRows.filter(sr => sr.total) : subRows,
        ...(aggregate && aggregate(subRows))
      }
    });
    return groupedRows;
  };
  return groupRecursively;
}
