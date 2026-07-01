import { type DropdownOptionObject } from './components/fields/DropdownField'

export function stringArrSearch(input: string, option: DropdownOptionObject) {
  return option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export function kvArrSearch(input: string, option: { children: any }) {
  return (
    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

export function isKeyValueArray(
  options: string[] | DropdownOptionObject[]
): options is DropdownOptionObject[] {
  if (!options.length) return false
  return typeof options[0] === 'object'
}
