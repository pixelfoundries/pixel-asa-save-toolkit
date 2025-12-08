/**
 * Interface for transferring data from {@link UnrealActorTransform} class to other classes.
 *
 * @group Unreal Engine Types
 * @category Primitive Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IUnrealActorTransform {
  uuid: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  scale: number;
}

/**
 * Interface for transferring data from {@link UnrealUnknown} class to other classes.
 *
 * @group Unreal Engine Types
 * @category Ark ASA Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IUnrealUnknown {
  value1: number;
  value2: number;
  name: string;
}

/**
 * Interface for transferring data from {@link UnrealName} class to other classes.
 *
 * @group Unreal Engine Types
 * @category Primitive Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IUnrealName {
  id: number;
  name: string;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IUnrealProperty {
  name: IUnrealName;
  type: IUnrealName;
  length: number;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to boolean values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IBooleanProperty extends IUnrealProperty {
  booleanValue: boolean;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to binary byte array values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IByteArrayProperty extends IUnrealProperty {
  byteArrayValue: Uint8Array;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to all Int value except Int64 due to storage issues in JS.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IIntProperty extends IUnrealProperty {
  intValue: number;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to Int64 values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IInt64Property extends IUnrealProperty {
  int64Value: bigint;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to object values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IObjectProperty extends IUnrealProperty {
  objectValue: IUnrealProperty[];
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to float and double values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface INumberProperty extends IUnrealProperty {
  numberValue: number;
}

/**
 * Interface for transferring data from {@link UnrealProperty} class to other classes. Specific to string values.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IStringProperty extends IUnrealProperty {
  stringValue: string;
}

/**
 * Interface for transferring data from {@link SaveComponent} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface ISaveComponent {
  name: IUnrealName;
  type: IUnrealName;
  actorTransform: IUnrealActorTransform;
  componentArray: ISaveComponent[];
  propertyArray: IUnrealProperty[];
}

/**
 * Interface for transferring data from {@link ArrayComponent} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IArrayComponent extends ISaveComponent {
  length: number;
  entryCount: number;
  arrayOfStruct: boolean;
}

/**
 * Interface for transferring data from {@link SaveObjectComponent} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface ISaveObjectComponent extends ISaveComponent {
  table: string;
  key: string;
  uuid: string;
  objectType: string;
  objectNameArray: string[];
}

/**
 * Interface for transferring data from {@link StructComponent} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IStructComponent extends ISaveComponent {
  length: number;
  blueprint: IUnrealName;
}

/**
 * Interface for transferring data from {@link AsaSaveFile} class to other classes.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export interface IAsaSaveFile {
  version: number;
  nameTableOffset: number;
  nameTableCount: number;
  nameTableArray: IUnrealName[];
  gameTime: number;
  mapGridCount: number;
  mapGridArray: string[];
  unknownTableCount: number;
  unknownTableArray: IUnrealUnknown[];
  actorTransformArray: IUnrealActorTransform[];
  actorTransformDeltaArray: IUnrealActorTransform[];
  saveObjectArray: ISaveObjectComponent[];
}
