import * as Types from './types.js';

export enum SaveWriterFlags {}

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
   * @param propertyValue {Types.IUnrealProperty} - Unreal property to write.
   * @returns {Buffer} Generated binary buffer containing the written Unreal property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract writeProperty(propertyValue: Types.IUnrealProperty): Buffer;

  /**
   * Write a header to the file with the current object. Must be overridden by the specific implementation of subclass of the SaveWriter.
   *
   * @abstract
   * @param component {Types.ISaveComponent} - The save component to write the header of.
   * @returns {Buffer} Generated binary buffer containing the written Unreal header property.
   *
   * @author dkasten
   * @since 1.0.0
   */
  public abstract writeHeader(component: Types.ISaveComponent): Buffer;

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
  public abstract enterDecorator(name: string, id: number, simple: boolean, flags: number): Buffer;

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
  public flags: number;
  public id: number;
  public simple: boolean;

  constructor(flags: SaveWriterFlags, id: number, simple: boolean) {
    this.flags = flags;
    this.id = id;
    this.simple = simple;
  }
}
