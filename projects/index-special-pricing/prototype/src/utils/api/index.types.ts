export interface EntitySchemaResponse {
  Data: Data
  Query: any
  Validations: any[]
}

export interface Data {
  Schema: Schema
  DetailSchema?: Schema
}

export interface Schema {
  DetailViewName: string
  Display: string
  EntityView: EntityView
  EntityViewName: string
  Name: string
  PageComponents: PageComponent[]
  PageSetupDefaults: any[]
  PageSetupEntityActions: any[]
  PrimaryEntityRegisterEntityName: string
}

export interface EntityView {
  EntityViewColumns: EntityViewColumn[]
  PrimaryKeyField: string
}

export interface EntityViewColumn {
  ColumnName: string
  DataTypeDisplay?: string
  DataTypeMeaning?: string
  DisplayName: string
  EntityViewColumnId: number
  Format?: string
  IsVisible: boolean
  Order: number
}

export interface PageComponent {
  Display: string
  Name: string
  PageComponentFields: PageComponentField[]
  ViewName?: string
  IsPrimary?: boolean

  /**
   * ComponentData keys are unique per page component, and we can't really guarantee their shape
   * Record<string, any> really just means an object with any number of keys (that are strings) who's values are of type any.
   * This object will contains the fields default values along with any other metadata properties that drive field configurability
   * (like min, max for number inputs etc)
   *
   * One thing that we do know is that the value of the 'Name' key in `PageComponentField` will exist within `ComponentData`.
   * We'll use the values of the `Name` keys to do a lookup to find the default value when we map over the response.
   *
   * This value of the `Name` key is also what the BE is expecting when we send values back for filters.
   */
  ComponentData?: Record<string, any>
}

export interface Item {
  Disabled: boolean
  Selected: boolean
  Text: string
  Value?: string
}

export interface PageComponentField {
  DefaultValue?: string
  Name: string
}
