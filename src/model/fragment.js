// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

const supportedTypes = ['text/*', 'application/json'];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId && !type) {
      throw new Error('ownerId and type are required');
    }

    if (!ownerId) {
      throw new Error('ownerId is required');
    }

    if (!type) {
      throw new Error('type is required');
    }

    if (typeof size !== 'number' || size < 0) {
      throw new Error('size must be a number');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error('invalid type');
    }

    this.id = id ?? randomUUID();
    this.ownerId = ownerId;
    this.created = created ?? new Date().toISOString();
    this.updated = updated ?? new Date().toISOString();
    this.type = type;
    this.size = size;

    logger.info(
      `User ${this.ownerId} created fragment ${this.id} of type ${this.type} and size ${this.size}`
    );
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    return fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      logger.error(`Fragment ${id} for user ${ownerId} not found`);
      throw new Error('not found');
    }
    return new Fragment(fragment);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    logger.info(`User ${ownerId} deleted fragment ${id}`);
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment (metadata) to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    logger.info(`Saving fragment ${this.id} for user ${this.ownerId}`);
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // TIP: make sure you update the metadata whenever you change the data, so they match
    logger.info(`Setting data for fragment ${this.id} for user ${this.ownerId}`);
    this.size = data.length;
    this.updated = new Date().toISOString();
    await writeFragmentData(this.ownerId, this.id, Buffer.from(data));
    await this.save();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.mimeType.startsWith('text/')) {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const mimeType = value.split(';')[0];
    return supportedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return mimeType.startsWith(type.split('/')[0] + '/');
      }
      return type === mimeType;
    });
  }
}

module.exports.Fragment = Fragment;
