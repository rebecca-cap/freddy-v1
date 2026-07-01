export const createSelectList = (keyList, selected) => {
  return Object.keys(keyList).map((key, index) => ({
    key,
    value: keyList[key],
    selected: selected ? selected === key : index === 0,
  }))
}
