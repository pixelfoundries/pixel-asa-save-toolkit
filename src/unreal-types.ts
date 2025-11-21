import { Buffer } from 'node:buffer';
import { v4 as uuidv4, parse } from 'uuid';

/**
 * Minimum Float value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MIN_FLOAT: number = -3.4028235e38;
/**
 * Maximum Float value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_FLOAT: number = 3.4028235e38;
/**
 * Minimum Double value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MIN_DOUBLE: number = -Number.MAX_VALUE;
/**
 * Maximum Double value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_DOUBLE: number = Number.MAX_VALUE;
/**
 * Minimum 16-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MIN_INT16: number = -32768;
/**
 * Maximum 16-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_INT16: number = 32768;
/**
 * Maximum 16-bit unsigned Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_UINT16: number = 65535;
/**
 * Minimum 32-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MIN_INT32: number = -2147483648;
/**
 * Maximum 32-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_INT32: number = 2147483648;
/**
 * Maximum 32-bit unsigned Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_UINT32: number = 4294967295;
/**
 * Minimum 64-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MIN_INT64: bigint = -9223372036854775808n;
/**
 * Maximum 64-bit Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_INT64: bigint = 9223372036854775808n;
/**
 * Maximum 64-bit unsigned Integer value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_UINT64: bigint = 18446744073709551615n;
/**
 * Maximum byte value supported in Unreal Engine
 * @group Unreal Engine Types
 * @category Constants
 */
export const MAX_BYTE: number = 255;

/**
 * Storage class that represents an Unreal Engine string value. Used with SaveWriter classes to generate save file data.
 *
 * @group Unreal Engine Types
 * @category Primitive Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export class UnrealStrProperty {
  protected length: number;
  protected value: string;

  /**
   * Constructor that initializes the string with the provided data.
   *
   * @param {string} value - String value.
   * @param {number} length - String length including null termination byte.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public constructor(value: string, length: number) {
    this.length = length;
    this.value = value;
  }

  /**
   * Generate a binary buffer object to use for building a new save file for modification or repair.
   *
   * @returns {Buffer} Binary buffer object with the properly generated binary data for an Unreal string property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public generate(): Buffer {
    const returnValue: Buffer = Buffer.alloc(this.length + 4);

    // First write length as uint32
    returnValue.writeUint32LE(this.length, 0);

    // Second write string with null termination byte
    returnValue.write(this.value, 4, this.length - 1, 'utf8');
    returnValue.writeInt8(0, this.length + 3);

    return returnValue;
  }

  /**
   * Getter for the length of the string.
   *
   * @returns {number} Length of the string.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Getter for string value.
   *
   * @returns {string} The stored string value.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Setter for string value that will also update the length field.
   *
   * @param {string} value - String value to set instance to and update the length value to the length of the string.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setValue(value: string): void {
    this.value = value;
    this.length = value.length + 1;
  }
}

/**
 * Storage class that represents an Unreal name entry which is used for all string names in Ark ASA save files.
 *
 * @group Unreal Engine Types
 * @category Primitive Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export class UnrealName {
  protected name: UnrealStrProperty;
  protected id: number;

  /**
   * Constructor that initializes the name with the provided data.
   *
   * @param {number} id - UInt32 identifier used in name table and all references to this string.
   * @param {string} name - String value to store for the name.
   *
   * @author dkasten
   * @since 1.0.0
   */
  constructor(id: number, name: string) {
    this.id = id;
    this.name = new UnrealStrProperty(name, name.length + 1);
  }

  /**
   * Generate a binary buffer object to use for building a new save file for modification or repair.
   *
   * @returns {Buffer} Binary buffer object with the properly generated binary data for an Unreal name table entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public generate(): Buffer {
    const idBuffer: Buffer = Buffer.alloc(4);

    // Write ID as uint32 first
    idBuffer.writeUint32LE(this.id, 0);

    // Write string as second part
    const stringBuffer: Buffer = this.name.generate();

    return Buffer.concat([idBuffer, stringBuffer]);
  }

  /**
   * Getter for the name string value.
   *
   * @returns {UnrealStrProperty} Value of the name string as an UnrealStrProperty instance.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getName(): UnrealStrProperty {
    return this.name;
  }

  /**
   * Setter for string value that will also update the length field.
   *
   * @param {string} value - String value to set instance to and update the length value to the length of the string.
   * @since 1.0.0
   */
  public setName(value: string): void {
    this.name = new UnrealStrProperty(value, value.length + 1);
  }

  /**
   * Getter for the ID value of the name.
   *
   * @returns {number} ID value for the name.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getID(): number {
    return this.id;
  }
}

/**
 * Storage class that represents an Unreal actor transform entry used for all game objects in Ark ASA save files.
 *
 * @group Unreal Engine Types
 * @category Primitive Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export class UnrealActorTransform {
  protected uuid: string;
  protected x: number;
  protected y: number;
  protected z: number;
  protected yaw: number;
  protected pitch: number;
  protected roll: number;
  protected scale: number;

  /**
   * Constructor that initializes the actor transform with the provided data. UUID can be left off and a new UUID will
   * be generated using uuid library.
   *
   * @param {number} x - Double value indicating x position.
   * @param {number} y - Double value indicating y position.
   * @param {number} z - Double value indicating z position.
   * @param {number} yaw - Double value indicating yaw rotation of vector.
   * @param {number} pitch - Double value indicating pitch rotation of vector.
   * @param {number} roll - Double value indicating roll rotation of vector.
   * @param {number} scale - Double value indicating scale of transform in all three directions.
   * @param {number} uuid - String version of UUID for this transform which is used for lookup in actor transform table.
   *
   * @author dkasten
   * @since 1.0.0
   */
  constructor(x: number, y: number, z: number, yaw: number, pitch: number, roll: number, scale: number, uuid?: string) {
    if (uuid === undefined) {
      this.uuid = uuidv4();
    } else {
      this.uuid = uuid;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
    this.scale = scale;
  }

  /**
   * Generate a binary buffer object to use for building a new save file for modification or repair.
   *
   * @returns {Buffer} Binary buffer object with the properly generated actor transform data for an Unreal actor transform table entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public generate(): Buffer {
    const returnValue: Buffer = Buffer.alloc(72);

    // First write UUID in binary format
    const uuidBytes: Uint8Array = parse(this.uuid);
    uuidBytes.forEach((byte, index) => {
      returnValue.writeUInt8(byte, index);
    });

    // Second write each number as a LE double value
    returnValue.writeDoubleLE(this.x, 16);
    returnValue.writeDoubleLE(this.y, 24);
    returnValue.writeDoubleLE(this.z, 32);
    returnValue.writeDoubleLE(this.yaw, 40);
    returnValue.writeDoubleLE(this.pitch, 48);
    returnValue.writeDoubleLE(this.roll, 56);
    returnValue.writeDoubleLE(this.scale, 64);

    return returnValue;
  }

  /**
   * Getter for the uuid of the actor transform.
   *
   * @return string - String version of the UUID. Can use parse function of uuid library to convert to binary buffer.
   * @since 1.0.0
   */
  public getUUID(): string {
    return this.uuid;
  }

  /**
   * Getter for the transform position in x, y, and z format.
   *
   * @returns {object} Object with the tuple x, y, and z that represents the transform position.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getPosition(): { x: number; y: number; z: number } {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return { x, y, z };
  }

  /**
   * Setter for transform position.
   *
   * @param {number} x - New x position for the actor transform.
   * @param {number} y - New y position for the actor transform.
   * @param {number} z - New z position for the actor transform.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setPosition(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Getter for the transform rotation in yaw, pitch, and roll format.
   *
   * @returns {object} Object with the tuple yaw, pitch, and roll that represents the transform rotation.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getRotation(): { yaw: number; pitch: number; roll: number } {
    const yaw = this.yaw;
    const pitch = this.pitch;
    const roll = this.roll;
    return { yaw, pitch, roll };
  }

  /**
   * Setter for transform rotation.
   *
   * @param {number} yaw - New yaw rotation for transform.
   * @param {number} pitch - New pitch rotation for transform.
   * @param {number} roll - New roll rotation for transform.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setRotation(yaw: number, pitch: number, roll: number): void {
    this.roll = roll;
    this.yaw = yaw;
    this.pitch = pitch;
  }

  /**
   * Getter for the transform scale in all directions.
   *
   * @returns {number} The scale amount of the transform with 1.0 as no scaling.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getScale(): number {
    return this.scale;
  }

  /**
   * Setter for the transform scale in all directions.
   *
   * @param {number} scale - New scale for transform.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setScale(scale: number) {
    this.scale = scale;
  }
}

/**
 * Storage class that represents an entry for an unknown table in save file header.
 *
 * @group Unreal Engine Types
 * @category Ark ASA Types
 *
 * @author dkasten
 * @since 1.0.0
 */
export class UnrealUnknown {
  protected name: UnrealStrProperty;
  protected value1: number;
  protected value2: number;

  /**
   * Constructor that initializes the unknown table entry with the provided data.
   *
   * @param {string} name - Double value indicating x position.
   * @param {number} value1 - First Uint32 value.
   * @param {number} value2 - Second Uint32 value.
   *
   * @author dkasten
   * @since 1.0.0
   */
  constructor(name: string, value1: number, value2: number) {
    this.name = new UnrealStrProperty(name, name.length + 1);
    this.value1 = value1;
    this.value2 = value2;
  }

  /**
   * Generate a binary buffer object to use for building a new save file for modification or repair.
   *
   * @returns {Buffer} Binary buffer object with the properly generated unknown table entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public generate(): Buffer {
    const uintBuffer: Buffer = Buffer.alloc(8);

    // First write the two uint32 values
    uintBuffer.writeUint32LE(this.value1, 0);
    uintBuffer.writeUint32LE(this.value2, 4);

    // Second write string to buffer
    const stringBuffer: Buffer = this.name.generate();

    return Buffer.concat([uintBuffer, stringBuffer]);
  }

  /**
   * Getter for the name of the unknown table entry.
   *
   * @returns {UnrealStrProperty} String name value stored in unknown table entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getName(): UnrealStrProperty {
    return this.name;
  }

  /**
   * Getter for the uuid of the actor transform.
   *
   * @returns {string} String version of the UUID. Can use parse function of uuid library to convert to binary buffer.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getValue1(): number {
    return this.value1;
  }

  /**
   * Setter for the first Uint32 value.
   *
   * @param {number} value - New Uint32 value for entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setValue1(value: number): void {
    this.value1 = value;
  }

  /**
   * Getter for the uuid of the actor transform.
   *
   * @returns {string} String version of the UUID. Can use parse function of uuid library to convert to binary buffer.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public getValue2(): number {
    return this.value2;
  }

  /**
   * Setter for the second Uint32 value.
   *
   * @param {number} value - New Uint32 value for entry.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public setValue2(value: number): void {
    this.value2 = value;
  }
}
