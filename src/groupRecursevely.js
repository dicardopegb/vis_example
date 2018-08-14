import { groupBy } from "lodash";

export default ({ pivotValKey = "name", subRowsKey = "children", aggregate, computeLevel }) => {
  const groupRecursively = (data, keys, i = 0) => {
    // This is the last level, just return the rows
    if (i === keys.length) {
      return data;
    }

    // Group the rows together for this level
    let groupedRows = Object.entries(groupBy(data, keys[i])).map(([key, value]) => ({
      [pivotValKey]: key,
      [subRowsKey]: value,
      ...(computeLevel && computeLevel({ index: i, key }))
    }));
    // Recurse into the subRows
    groupedRows = groupedRows.map(rowGroup => {
      const subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1)
      return {
        ...rowGroup,
        [subRowsKey]: subRows,
        ...(aggregate && aggregate(subRows))
      }
    })
    console.log(groupedRows);
    return groupedRows;
  };
  return groupRecursively;
}
