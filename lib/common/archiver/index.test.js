'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const bsq = require('../../../bin/ByteSquash');
const Archiver = require('./');

bsq.init();

const archiver = new Archiver(bsq);

// define archive mocks
const archiveSrcPath = '/tmp/archive_test_7777';
const archiveSrcFile = 'test_file';
const archiveFullPath = path.join((archiveSrcPath, archiveSrcFile));
const archiveDest = '/tmp/archive_test_7777.zip';

const cleanMockFiles = () => {
  fsExtra.removeSync(archiveSrcPath);
  fsExtra.removeSync(archiveDest);
};

cleanMockFiles();

describe('Testing archiver', () => {
  it('creates archive source directory',  async () => {
    const data = await fsExtra.ensureDir(archiveSrcPath);
    expect(data).toBe(archiveSrcPath);
  });

  it('adds archive test file', () => {
    const data = fs.writeFileSync(archiveFullPath, 'TEST');
    expect(data).toBe(undefined);
  });

  it('creates an archive', async () => {
    const data = await archiver.zipDir(archiveSrcPath, archiveDest);
    expect(data).toBe(archiveDest);
    cleanMockFiles();
  });
});
