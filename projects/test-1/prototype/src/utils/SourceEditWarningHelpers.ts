export type SourceInfo = {
  SourceSystemId?: string | number
  SourceSystemName?: string
}

export type SourceEditableRow = {
  SourceInfo?: SourceInfo | null
  [key: string]: any
}

type EditableSource = { Value: string }

type IsEditableSourceFn = (row: SourceEditableRow) => boolean

type RequiresWarningArgs = {
  updatedData: SourceEditableRow | SourceEditableRow[]
  allowedFields: Set<string>
  isEditableSource: IsEditableSourceFn
  setSourceSystemName?: (name: string) => void
}

export function requiresSourceEditWarning({
  updatedData,
  allowedFields,
  isEditableSource,
  setSourceSystemName,
}: RequiresWarningArgs): boolean {
  const rows = Array.isArray(updatedData) ? updatedData : [updatedData]

  let foundSourceSystemName = ''
  const needsWarning = rows.some((row) => {
    // If it's an editable source, no warning needed
    if (isEditableSource(row)) return false

    // Check if any restricted fields were modified
    const modifiedFields = Object.keys(row).filter((key) => row[key] !== undefined && !allowedFields.has(key))

    if (modifiedFields.length > 0) {
      foundSourceSystemName = row?.SourceInfo?.SourceSystemName || 'Unknown'
      return true
    }

    return false
  })

  if (needsWarning) {
    setSourceSystemName?.(foundSourceSystemName)
  }

  return needsWarning
}

export function createIsEditableSource(editableSources?: EditableSource[]): IsEditableSourceFn {
  return (row: SourceEditableRow) => {
    const sourceSystemId = row?.SourceInfo?.SourceSystemId

    // No source = editable
    if (sourceSystemId == null) return true

    return editableSources?.some((item) => item.Value === sourceSystemId.toString()) ?? false
  }
}
