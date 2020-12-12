export enum SpecialInputTypes {
  SEPARATOR = 'SEPARATOR',
  BUTTON = 'BUTTON',
  MONITOR = 'MONITOR',
}

export type Folders = Record<string, FolderSettings>

export type FolderSettings = {
  collapsed?: boolean
}

export type ValueInputWithSettings<V extends unknown, Settings = {}> = {
  value: V
} & Settings

export type ValueInput<V, Settings = {}> = V | ValueInputWithSettings<V, Settings>

export type DataInput = {
  type: string
  value: unknown
  settings?: object
  count?: number
}

export type ButtonInput = {
  type: SpecialInputTypes
  name: string
  onClick: () => any
}

export type SeparatorInput = {
  type: SpecialInputTypes
}

export type SpecialInputs = ButtonInput | SeparatorInput

export type Data = {
  [key: string]: DataInput | (SpecialInputs & { count?: number })
}

export type Tree = {
  [key: string]: JSX.Element | Tree
}

export type V8N = { test: (o: any) => boolean }

export type TwixInputProps<V, InternalSettings = {}> = {
  label: string
  displayValue: any
  value: V
  onChange: React.Dispatch<any>
  onUpdate: (value: any) => void
  settings: InternalSettings
}

export type Plugin<Value, InternalValue, Settings, InternalSettings> = {
  schema: (value: any, settings?: Settings) => boolean
  component: React.ComponentType<TwixInputProps<InternalValue, InternalSettings>>
  format?: (value: any, settings: InternalSettings) => any
  validate?: (value: any, settings: InternalSettings) => boolean
  sanitize?: (value: any, settings: InternalSettings) => InternalValue
  normalize?: (input: ValueInputWithSettings<Value, Settings>) => { value: InternalValue; settings: InternalSettings }
}

// utils
type Id<T> = { [K in keyof T]: T[K] }
type Merge<T, U> = Id<T & U>
type Head<T> = T extends [infer U, ...any[]] ? U : never
type Tail<T> = T extends [any, ...infer U] ? U : never

// types
type PluginDefinition<Schema, Output> = { schema: Schema; output: Output }

type Folder<Entries extends any[]> = { folder: Entries }
declare function folder<Entries extends any[]>(name: string, ...entries: Entries): Folder<Entries>
declare function folder<Entries extends any[]>(...entries: Entries): Folder<Entries>
// function folder(a: any, ...args: any[]) {
//   return { folder: typeof a === 'string' ? args : [a, ...args] }
// }

type SpecialInput = { type: SpecialInputTypes }
const button = (name: string, onClick: () => {}) => ({ type: SpecialInputTypes.BUTTON, name, onClick })
const separator = () => ({ type: SpecialInputTypes.SEPARATOR })
const monitor = () => ({ type: SpecialInputTypes.MONITOR })

type ParseInput<Input, Plugins> = Head<Plugins> extends PluginDefinition<infer Schema, infer Output>
  ? Input extends Schema
    ? Output
    : ParseInput<Input, Tail<Plugins>>
  : never

/**
 * Parse a single entry:
 * - folder -> merge content
 * - special input -> skip
 * - object -> object
 */
type ParseEntry<T> = T extends Folder<infer Entries> ? MergeEntries<Entries> : T extends SpecialInput ? {} : T

type MergeEntries<Arr, Acc = {}> = Arr extends [infer Hd, ...infer Tl]
  ? MergeEntries<Tl, Merge<Acc, ParseEntry<Hd>>>
  : Acc

type TwixType<Entries, Plugins> = MergeEntries<Entries> extends infer Merged
  ? { [K in keyof Merged]: ParseInput<Merged[K], Plugins> }
  : never

// mock types
type NumberPlugin = PluginDefinition<number | { value: number; min?: number; max?: number }, 'numeric input'>
type BooleanPlugin = PluginDefinition<boolean, 'boolean input'>
type Point2DPlugin = PluginDefinition<{ x: number; y: number }, 'point 2d input'>
type Point3DPlugin = PluginDefinition<{ x: number; y: number; z: number }, 'point 3d input'>
type ColorHexPlugin = PluginDefinition<string, 'color hex input'>
type ColorRGBAPlugin = PluginDefinition<{ r: number; g: number; b: number; a?: number }, 'color rgba input'>

type AvailablePlugins = [NumberPlugin, BooleanPlugin, Point3DPlugin, Point2DPlugin, ColorHexPlugin, ColorRGBAPlugin]

declare function _useTwix<T extends any[]>(name: string, ...entries: T): TwixType<T, AvailablePlugins>
declare function _useTwix<T extends any[]>(...entries: T): TwixType<T, AvailablePlugins>

const { point2, ...rest } = _useTwix(
  'Control',
  { a: 4 },
  button('button', () => 'hello button'),
  folder(
    'folder 1',
    { colorRgb: { r: 1, g: 2, b: 3 } },
    { colorRgba: { r: 1, g: 2, b: 3, a: 3 } },
    separator(),
    folder(
      folder({ numWithoutSettings: 1, unknownType: { a: 3 } }),
      { colorHex: '#000', numWithSettings: { value: 4, min: 1 } },
      monitor(),
      folder({ point1: { x: 1, y: 2 }, point2: { x: 1, y: 2, z: 2 } }, { booleanValue: false })
    )
  )
)
