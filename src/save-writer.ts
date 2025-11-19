import { SaveComponentFlags, UnrealProperty } from "./save-object.js";
import { UnrealName } from "./unreal-types.js";


/**
 * Abstract base class for formatting Ark ASA save files in to different file formats contained in SaveObject class instances.
 *
 * @abstract
 * @group Save Writers
 * @category Base Classes
 *
 * @author dkasten
 * @since 1.0.0
 */
export default abstract class SaveWriter {
  /**
   * Write a property to the file with the current object. Must be overridden by the specific implementation of subclass of the SaveWriter.
   *
   * @abstract
   * @param propertyValue {UnrealProperty} - Unreal property to write.
   * @returns {Buffer} Generated binary buffer containing the written Unreal property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract writeProperty(propertyValue: UnrealProperty): Buffer;

  /**
   * Write a header to the file with the current object. Must be overridden by the specific implementation of subclass of the SaveWriter.
   *
   * @abstract
   * @param headerValue {UnrealProperty} - The Unreal header property to write.
   * @returns {Buffer} Generated binary buffer containing the written Unreal header property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract writeHeader(headerValue: UnrealProperty): Buffer;

  /**
   * Generate decorator for entering the specified object. Must be overridden by the specific implementation of subclass of the SaveWriter.
   *
   * @abstract
   * @param name {UnrealName} - Name of the object to generate the decorator for.
   * @param id {number} - Object ID of the object to generate the decorator for.
   * @param simple {boolean} - If a simple decorator for any empty objects that need to be created.
   * @param flags {SaveComponentFlags} - Save component flags to indicate how save writer should generate the data.
   * @returns {Buffer} Generated binary buffer containing the written decorator for the start of the object.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract enterDecorator(name: UnrealName, id: number, simple: boolean, flags: number): Buffer;

  /**
   * Generate decorator for exiting the current object. Must be overridden by the specific implementation of subclass of the SaveWriter.
   *
   * @abstract
   * @returns {Buffer} Generated binary buffer containing the written decorator for the end of the object.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract exitDecorator(): Buffer;
}

// export class JsonWriter extends SaveWriter {
//
// }
//
// export class AsaWriter extends SaveWriter {
//
// }

/**
 * Storage class for save file decorator pattern.
 *
 * @group Save Writers
 * @category Base Classes
 *
 */
export class SaveDecorator {
  public flags: SaveComponentFlags;
  public id: number;
  public simple: boolean;

  constructor(flags: SaveComponentFlags, id: number, simple: boolean) {
    this.flags = flags;
    this.id = id;
    this.simple = simple;
  }
}