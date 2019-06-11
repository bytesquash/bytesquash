'use strict';

/**
 * Class that manages Cloud operations
 */
class Cloud {
  /**
   * Uploads a file to the Cloud's storage
   *
   * @param {String} localPath - local file path "/tmp/file.zip"
   * @param {String} remotePath - remote file path "upload/path/file.zip"
   * @param {Object} params
   * @returns {Promise}
   *
   * @example
   *
   * this.bsq.cloud.storage.uploadFile('/tmp/file.zip', 'upload/path/file.zip', {
    *     public : true // uploads the file as a public access URL
    * }).then(() => {
    *     // file successfully uploaded
    * });
    *
    * @name this.bsq.cloud.storage.uploadFile
    */

  /**
   * Uploads a directory to the Cloud's storage
   *
   * @param {string} localPath - local path "/tmp/source_dir"
   * @param {string} remotePath - remote path "upload/path"
   * @param {Object} params
   * @returns {Promise}
   *
   * @example
   *
   * this.bsq.cloud.storage.uploadDir('/tmp/source_dir', 'upload/path', {
   *     public : true, // uploads the file as a public access URL
   *     sync   : true  // synchronize directory
   * }).then(() => {
   *     // file successfully uploaded
   * });
   *
   * @name this.bsq.cloud.storage.uploadDir
   */
}

module.exports = Cloud;
