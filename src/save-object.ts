import { validate as validateUuid } from 'uuid';
import { Buffer } from 'node:buffer';
import * as Types from './types.js';
import * as UnrealTypes from './unreal-types.js';
import { UnrealProperty } from './unreal-property.js';
import SaveWriter from './save-writer.js';

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
  protected headerMap: Map<string, UnrealProperty>;
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
  constructor(
    flags: number,
    id: number,
    uuid: string,
    name: UnrealTypes.UnrealName,
    type: UnrealTypes.UnrealName,
    blueprint: UnrealTypes.UnrealName | null = null,
    actorTransform: UnrealTypes.UnrealActorTransform | null = null,
    saveWriter: SaveWriter | null = null
  ) {
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
  protected setSaveWriter(writer: SaveWriter): void {
    this.saveWriter = writer;
  }

  protected writeProperty(property: UnrealProperty): Buffer {
    if (this.saveWriter) {
      const writerProperty: Types.IUnrealProperty = property.generate();
      return this.saveWriter.writeProperty(writerProperty);
    } else {
      throw new Error('SaveComponent: SaveWriter was not set before trying to write property');
    }
  }

  /**
   * Helper function to validate flags provide to the object either through constructor or setFlags.
   *
   * @private
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
      if ((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY || (flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT) {
        return false;
      }
    } else if ((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY) {
      typeFlagFound = true;
      if ((flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT || (flags & SaveComponentFlags.OBJECT) === SaveComponentFlags.OBJECT) {
        return false;
      }
    } else if ((flags & SaveComponentFlags.STRUCT) === SaveComponentFlags.STRUCT) {
      typeFlagFound = true;
      if ((flags & SaveComponentFlags.ARRAY) === SaveComponentFlags.ARRAY || (flags & SaveComponentFlags.OBJECT) === SaveComponentFlags.OBJECT) {
        return false;
      }
    }

    return typeFlagFound;
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
export default class SaveObject extends SaveComponent {}
