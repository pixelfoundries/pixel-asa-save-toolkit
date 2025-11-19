import { validate as validateUuid } from 'uuid';
import { Buffer } from 'node:buffer';
import * as UnrealTypes from './unreal-types.js';
import { default as SaveWriter } from './save-writer.js';


/**
 * Enum for flags indicating options for {@link SaveComponent} class to indicate what values exist and what typ of component it is.
 *
 * @group Ark ASA Save Objects
 * @category Enums
 *
 * @readonly
 * @enum {number}
 *
 * @author dkasten
 * @since 1.0.0
 */
export enum SaveComponentFlags {
  NONE = 0,
  OBJECT = 1 << 0,
  ARRAY = 1 << 1,
  STRUCT = 1 << 2,
  UUID = 1 << 3,
  TRANSFORM = 1 << 4,
  BLUEPRINT = 1 << 5,
}


/**
 * Storage class for storing components that make up an object. These can be the root object, struct, or an array.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export class SaveComponent {
  protected flags: number; // Stores SaveComponentFlags
  protected id: number;
  protected uuid: string;
  protected name: UnrealTypes.UnrealName;
  protected type: UnrealTypes.UnrealName;
  protected blueprint: UnrealTypes.UnrealName | null;
  protected actorTransform: UnrealTypes.UnrealActorTransform | null;
  protected componentMap: Map<string, SaveComponent>;
  protected headerMap: Map<string, UnrealProperty>
  protected propertyMap: Map<string, UnrealProperty>;
  protected saveWriter: SaveWriter | null;

  /**
   * Constructor that initializes a save component.
   *
   * @param {SaveComponentFlags} flags - The flags describing the type of component and what optional values exist.
   * @param {number} id - The ID number for this component.
   * @param {string} uuid - String form of the UUID for this component which is how Unreal Engine identifies this component.
   * @param {UnrealTypes.UnrealName} name - Unreal Engine name for this component which corresponds to an entry in the Unreal Engine name table.
   * @param {UnrealTypes.UnrealName} type - Unreal Engine type for this component which corresponds to an entry in the Unreal Engine name table.
   * @param {UnrealTypes.UnrealName} blueprint - Unreal Engine blueprint for this component which corresponds to an entry in the Unreal Engine name table.
   * @param {UnrealTypes.UnrealActorTransform} actorTransform - Unreal Engine actor transform that indicates the location of the component in 3D space.
   * @param {SaveWriter} saveWriter - Save writer instance that will write the save file information to a new file in a specific format.
   *
   * @throws {TypeError} If UUID provided is not a valid UUID.
   * @throws {RangeError} If flags value failed validation due to exclusive flags being set or no component type flag being set.
   *
   * @author dkasten
   * @since 1.0.0
   */
  constructor (flags: number,
               id: number,
               uuid: string,
               name: UnrealTypes.UnrealName,
               type: UnrealTypes.UnrealName,
               blueprint: UnrealTypes.UnrealName | null = null,
               actorTransform: UnrealTypes.UnrealActorTransform | null = null,
               saveWriter: SaveWriter | null = null) {
    // Validate UUID
    if (!validateUuid(uuid)) {
      throw new TypeError('SaveComponent: UUID value is invalid');
    }

    // Validate flags
    if (SaveComponent.checkFlags(flags)) {
      this.flags = flags;
    } else {
      throw new RangeError('SaveComponent: Provided flags value is invalid');
    }

    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.type = type;
    this.saveWriter = saveWriter;
    this.blueprint = blueprint;
    this.actorTransform = actorTransform;
    this.componentMap = new Map<string, SaveComponent>();
    this.headerMap = new Map<string, UnrealProperty>();
    this.propertyMap = new Map<string, UnrealProperty>();
  }

  /**
   * Setter for save writer instance.
   *
   * @protected
   * @param {SaveWriter} writer - Save writer instance to use for writing save data back to a file
   *
   * @author dkasten
   * @since 1.0.0
   */
  protected setSaveWriter (writer: SaveWriter): void {
    this.saveWriter = writer;
  }

  protected writeProperty(propertyValue: UnrealProperty): Buffer {
    if (this.saveWriter) {
      return this.saveWriter.writeProperty(propertyValue);
    } else {
      throw new Error('SaveComponent: SaveWriter was not set before trying to write property');
    }
  }

  /**
   * Helper function to validate flags provide to the object either through constructor or setFlags.
   *
   * @private
   * @static
   * @param {SaveComponentFlags} flags - Flags value to verify as valid.
   * @returns {boolean} - Where the flags value passed validation or not.
   *
   * @author dkasten
   * @since 1.0.0
   */
  private static checkFlags(flags: number): boolean {
    let typeFlagFound = false;
    if ((flags & SaveComponentFlags.OBJECT) === SaveComponentFlags.OBJECT) {
      typeFlagFound = true;
      if (((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY) || ((flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT)) {
        return false;
      }
    } else if ((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY) {
      typeFlagFound = true;
      if (((flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT) || ((flags & SaveComponentFlags.OBJECT) === SaveComponentFlags.OBJECT)) {
        return false;
      }
    } else if ((flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT) {
      typeFlagFound = true;
      if (((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY) || ((flags & SaveComponentFlags.OBJECT) === SaveComponentFlags.OBJECT)) {
        return false;
      }
    }

    return typeFlagFound;
  }
}

/**
 * Enum for flags indicating value types for an individual Unreal property stored in the generic {@link UnrealProperty} class.
 *
 * @group Ark ASA Save Objects
 * @category Enums
 *
 * @readonly
 * @enum {number}
 *
 * @author dkasten
 * @since 1.0.0
 */
export enum UnrealPropertyFlags {
  NONE = 0,
  OBJECT = 1 << 0,
  STRING = 1 << 1,
  UNSIGNED = 1 << 2,
  BYTE = 1 << 3,
  INT16 = 1 << 4,
  INT32 = 1 << 5,
  INT64 = 1 << 6,
  FLOAT = 1 << 7,
  DOUBLE = 1 << 8,
  BOOLEAN = 1 << 9,
  BUFFER = 1 << 10,
}

/**
 * Storage class for storing an Unreal property value that is stored in an ASA save file.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export class UnrealProperty {
  protected flags: number; // Stores UnrealPropertyFlags
  protected name: UnrealTypes.UnrealName;
  protected type: UnrealTypes.UnrealName;
  protected length: number;
  protected value: any;
  protected objectFlags: Array<number>; // Array of flags storing UnrealPropertyFlags
  protected objectValues: Array<any>; // Array of values storing object values

  /**
   * Constructor for an Unreal property instance that sets all values in the instance.
   *
   * @param {UnrealPropertyFlags} flags - The flags describing the type of Unreal property.
   * @param {UnrealTypes.UnrealName} name - Unreal Engine name for this component which corresponds to an entry in the Unreal Engine name table.
   * @param {UnrealTypes.UnrealName} type - Unreal Engine type for this component which corresponds to an entry in the Unreal Engine name table.
   * @param {number} length - The byte length of stored data in the ASA save file.
   * @param {any} value - Actual value of the Unreal property with the type of the data described in {@link UnrealProperty#flags} value.
   * @param {Array<UnrealPropertyFlags>} objectFlags - Array of Unreal property flags describing the makeup of the object values.
   * @param {Array<any>} objectValues - Array of actual values that are stored as a single blob in the ASA save file.
   *
   * @throws {RangeError} If provided object value array and object flags array are not the same length.
   * @throws {TypeError} If property flags are set to an object but no object values or flags were provided.
   *
   * @author dkasten
   * @since 1.0.0
   */
  constructor (flags: number, name: UnrealTypes.UnrealName, type: UnrealTypes.UnrealName, length: number, value: any, objectFlags?: Array<number>, objectValues?: Array<any>) {
    this.flags = flags;
    this.name = name;
    this.type = type;
    this.length = length;
    this.value = value;

    // Store object information if provided else set to empty arrays
    if ((flags & UnrealPropertyFlags.OBJECT) === UnrealPropertyFlags.OBJECT) {
      if (objectFlags !== undefined && objectValues !== undefined) {
        if (objectFlags.length !== objectValues.length) {
          throw new RangeError('SaveProperty.constructor: Object values or flags missing');
        }
        this.objectFlags = objectFlags;
        this.objectValues = objectValues;
      } else {
        throw new TypeError('SaveProperty.constructor: Type set to object but no object values provided');
      }
    } else {
      this.objectFlags = [];
      this.objectValues = [];
    }
  }

  /**
   * Setter for Unreal property flags.
   *
   * @param {UnrealPropertyFlags} flags - Flags value to set that will replace current value.
   * @param {boolean} unsafe - Is set value allowed to be unsafe with no validation checks.
   *
   * @throws {RangeError} If flags value fails validation due to exclusive flags being set
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setFlags(flags: number, unsafe: boolean = false): void {
    // If unsafe or flags is zero (NONE) then skip all type checks and just set value
    if (!unsafe && flags !== UnrealPropertyFlags.NONE) {
      if (UnrealProperty.checkFlags(flags)) {
        throw new RangeError('UnrealProperty.setFlags: Invalid flag settings');
      }
    }

    this.flags = flags;
  }

  /**
   * Getter for Unreal property flags.
   *
   * @returns {UnrealPropertyFlags} Current Unreal property flags set for the instance
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getFlags(): number {
    return this.flags;
  }

  /**
   * Getter for Unreal name instance that indicates the name of this property which corresponds to an entry in the Unreal Engine name table.
   *
   * @returns {UnrealTypes.UnrealName} Current Unreal name instance
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getName(): UnrealTypes.UnrealName {
    return this.name;
  }

  /**
   * Getter for Unreal name instance that indicates the Unreal type of this property which corresponds to an entry in the Unreal Engine name table.
   *
   * @returns {UnrealTypes.UnrealName} Current Unreal type instance
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getType(): UnrealTypes.UnrealName {
    return this.type;
  }

  /**
   * Setter for Unreal name instance that indicates the Unreal type of this property which corresponds to an entry in the Unreal Engine name table.
   *
   * @param {UnrealTypes.UnrealName} type - The type as an Unreal name instance to set for this property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setType(type: UnrealTypes.UnrealName): void {
    this.type = type;
  }

  /**
   * Getter for byte length of this Unreal property instance when stored in the ASA save file.
   *
   * @returns {number} The byte length for this Unreal property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Getter for current value of this Unreal property instance which can be any type and needs flags to understand how to interpret the value.
   *
   * @returns {any} The current value for this Unreal property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getValue(): any {
    return this.value;
  }

  /**
   * Setter for current value of this Unreal property instance and will validate the value if not unsafe or by default.
   *
   * @param {any} value - The value to set for this Unreal property instance and can be any type.
   * @param {boolean} unsafe - If the provided value should be checked for correct type and range for the current flag settings.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setValue(value: any, unsafe: boolean = false): void {
    // If unsafe or buffer (raw binary data) then skip all type and range checks and just set value
    if (!unsafe || (this.flags & UnrealPropertyFlags.BUFFER) === UnrealPropertyFlags.BUFFER) {
      // Check if object flag is set and throw an error if it is as this is the wrong function
      if (this.flags & UnrealPropertyFlags.OBJECT) {
        throw new TypeError('SaveProperty.setValue: Incorrect set value called for object type');
      }

      // Check value based on current flags set and the given value
      if (UnrealProperty.checkValue(value, this.flags)) {
        throw new TypeError('SaveProperty.setValue: Invalid value');
      }
    }

    // If we made it to here then value can be set
    this.value = value;
  }

  /**
   * Getter for current list of object flags of this Unreal property instance.
   *
   * @returns {Array<number>} The current list in array form of all object flags.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getObjectFlags(): Array<number> {
    return this.objectFlags;
  }

  /**
   * Setter for current list of object flags to indicate how to decode all bytes of the object data.
   *
   * @param flags {UnrealPropertyFlags} - The current list of object flags to describe the object data being stored.
   * @param unsafe {boolean} - If flag checks should be skipped and should just be trusted. Used for known good values.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setObjectFlags(flags: Array<number>, unsafe: boolean = false): void {
    // If unsafe then skip all type checks and just set values
    if (!unsafe) {
      // Iterate through all values and use setObjectValue function to do tests and set value
      for (let x = 0; x < flags.length; x++) {
        if (UnrealProperty.checkFlags(flags[x] as number)) {
          throw new TypeError(`SaveProperty.setObjectFlags: Invalid flags settings for index ${x}`);
        }
      }
    }

    this.objectValues = flags;
  }

  /**
   * Setter for an individual object flag value to indicate how to decode a specific set of bytes of the object data.
   *
   * @param index {number} - The index in the object flag array to set.
   * @param flags {UnrealPropertyFlags} - The object flags to set for this specific index.
   * @param unsafe {boolean} - If flag checks should be skipped and should just be trusted. Used for known good values.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setObjectFlag(index: number, flags: number, unsafe: boolean = false) {
    // If unsafe then skip all type checks and just set values
    if (!unsafe) {
      // Check value based on current flags set and the given value
      if (UnrealProperty.checkFlags(flags)) {
        throw new TypeError('SaveProperty.setObjectFlag: Invalid flag settings');
      }
    }

    if (this.objectFlags) {
      this.objectFlags[index] = flags;
    }
  }

  /**
   * Getter for all object values for this property that is being stored.
   *
   * @returns {Array<any>} The full list of object values encoded in to this property. Will return empty array if no values are set.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getObjectValues(): Array<any> {
    if (this.objectValues !== null) {
      return this.objectValues;
    } else {
      return [];
    }
  }

  /**
   * Setter for all object values for this property this is to be stored.
   *
   * @param values {Array<any>} - The full list of object values to be encoded in to this property.
   * @param unsafe {boolean} - If value checks should be skipped and should just be trusted. Used for known good values.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setObjectValues(values: Array<any>, unsafe: boolean = false) {
    // If unsafe then skip all type and range checks and just set value
    if (!unsafe) {
      if ((this.flags & UnrealPropertyFlags.BUFFER) === UnrealPropertyFlags.BUFFER) {
        // Check that value array range is equal to flags array range
        if (values.length !== this.objectFlags.length) {
          throw new RangeError('UnrealProperty.setObjectValues: Values array length does not match flags array length.');
        }

        // Iterate through all values and use setObjectValue function to do tests and set value
        for (let x: number = 0; x < values.length; x++) {
          if (!UnrealProperty.checkValue(values[x], this.objectFlags[x] as number)) {
            throw new TypeError(`UnrealProperty.setObjectValues: Invalid value for index ${x}`);
          }
        }
      }
    }

    this.objectValues = values;
  }

  /**
   * Setter for an individual object value to save a value to be encoded in to the object property.
   *
   * @param index {number} - The index in the object value array to set.
   * @param value {any} - The actual value to set in the object value array.
   * @param unsafe {boolean} - If value checks should be skipped and should just be trusted. Used for known good values.
   */
  public setObjectValue(index: number, value: any, unsafe: boolean = false) {
    // If unsafe or buffer (raw binary data) then skip all type and range checks and just set value
    if (!unsafe || (this.flags & UnrealPropertyFlags.BUFFER) === UnrealPropertyFlags.BUFFER) {
      // Check value based on current flags set and the given value
      if (this.objectFlags && this.objectFlags[index]) {
        if (UnrealProperty.checkValue(value, this.objectFlags[index])) {
          throw new TypeError('UnrealProperty.setObjectValue: Invalid value');
        }
      }
    }

    if (this.objectFlags && this.objectFlags[index]) {}
    this.objectValues[index] = value;
  }

  /**
   * Helper static function to check flag values to make sure they are valid.
   *
   * @private
   * @static
   * @param flags {UnrealPropertyFlags} - The flags value to check for validity.
   * @returns {boolean} If the flag value check succeeded.
   *
   * @author dkasten
   * @since 1.0.0
   */
  private static checkFlags(flags: number): boolean {
    let flagsCheck: number = flags;
    // First check if UNSIGNED is set and if so then check for one of the three int types and remove unsigned in temp
    // variable to later confirm only one other flag is set
    if ((flags & UnrealPropertyFlags.UNSIGNED) === UnrealPropertyFlags.UNSIGNED) {
      if ((flags & UnrealPropertyFlags.INT16) === UnrealPropertyFlags.INT16
        || (flags & UnrealPropertyFlags.INT32) === UnrealPropertyFlags.INT32
        || (flags & UnrealPropertyFlags.INT64) === UnrealPropertyFlags.INT64) {
        flagsCheck &= ~UnrealPropertyFlags.UNSIGNED;
      } else {
        return false;
      }
    }

    // Verify only one flag is set
    return (flagsCheck & (flagsCheck - 1)) === 0;
  }

  /**
   * Helper static function to check values against the currently set flags to make sure the value is valid.
   *
   * @private
   * @static
   * @param value {any} - The value to check for validity.
   * @param flags {UnrealPropertyFlags} - The flags to use for determining the value type and range.
   * @returns {boolean} If the value check succeeded.
   *
   * @author dkasten
   * @since 1.0.0
   */
  private static checkValue(value: any, flags: number): boolean {
    // Get type and range that value should be based on flags
    let valueType: string = '';
    let valueRanges: Array<any> = [];
    if ((flags & UnrealPropertyFlags.DOUBLE) === UnrealPropertyFlags.DOUBLE) {
      valueType = 'number';
      valueRanges = [UnrealTypes.MIN_DOUBLE, UnrealTypes.MAX_DOUBLE];
    } else if ((flags & UnrealPropertyFlags.FLOAT) === UnrealPropertyFlags.FLOAT) {
      valueType = 'number';
      valueRanges = [UnrealTypes.MIN_FLOAT, UnrealTypes.MAX_FLOAT];
    } else if ((flags & UnrealPropertyFlags.BOOLEAN) === UnrealPropertyFlags.BOOLEAN) {
      valueType = 'boolean';
    } else if ((flags & UnrealPropertyFlags.INT32) === UnrealPropertyFlags.INT32) {
      valueType = 'number';
      if ((flags & UnrealPropertyFlags.UNSIGNED) === UnrealPropertyFlags.UNSIGNED) {
        valueRanges = [0, UnrealTypes.MAX_UINT32];
      } else {
        valueRanges = [UnrealTypes.MIN_INT32, UnrealTypes.MAX_INT32];
      }
    } else if ((flags & UnrealPropertyFlags.STRING) === UnrealPropertyFlags.STRING) {
      valueType = 'string';
    } else if ((flags & UnrealPropertyFlags.BYTE) === UnrealPropertyFlags.BYTE) {
      valueType = 'number';
      valueRanges = [0, UnrealTypes.MAX_BYTE];
    } else if ((flags & UnrealPropertyFlags.INT16) === UnrealPropertyFlags.INT16) {
      valueType = 'number';
      if ((flags & UnrealPropertyFlags.UNSIGNED) === UnrealPropertyFlags.UNSIGNED) {
        valueRanges = [0, UnrealTypes.MAX_UINT16];
      } else {
        valueRanges = [UnrealTypes.MIN_INT16, UnrealTypes.MAX_INT16];
      }
    } else if ((flags & UnrealPropertyFlags.INT64) === UnrealPropertyFlags.INT64) {
      valueType = 'bigint';
      if ((flags & UnrealPropertyFlags.UNSIGNED) === UnrealPropertyFlags.UNSIGNED) {
        valueRanges = [0, UnrealTypes.MAX_UINT64];
      } else {
        valueRanges = [UnrealTypes.MIN_INT64, UnrealTypes.MAX_INT64];
      }
    }

    // Check value type and range against the type and range based on the flags set
    if (valueType === 'string') {
      return value instanceof UnrealTypes.UnrealStrProperty;
    } else {
      if (typeof value === valueType) {
        if (valueType === 'number' || valueType === 'bigint') {
          if (value < valueRanges[0] || value > valueRanges[1]) {
            return false;
          }
        }
      } else {
        return false;
      }

      return true;
    }
  }
}

/**
 * Root save object that represents an entry in the SQL Lite database that is internal to the Ark ASA save file structure.
 *
 * @group Ark ASA Save Objects
 * @category Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export default class SaveObject extends SaveComponent {

}
