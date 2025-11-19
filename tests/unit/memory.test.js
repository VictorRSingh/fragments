const {
  readFragment,
  writeFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('Write fragment metadat to memory db, Promise<void> returned', async () => {
    const fragment = { ownerId: 'a', id: 'b'}
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('Read fragment metadata from memory db. Promise<Object> returned', async () => {
    const fragment = {ownerId: 'a', id: 'b'};
    await writeFragment(fragment);

    const readResult = await readFragment(fragment.ownerId, fragment.id);
    expect(readResult).toEqual(fragment);
  })

  test('Write fragment data buffer to memory db, Promise Returned', async () => {
    const fragment = { ownerId: 'a', id: 'b'}
    const buffer = Buffer.from([1, 2, 3])
    fragment.buffer = buffer;
    const results = await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    expect(results).toBe(undefined);
  })

  test('Read fragment data from memory db, Promise<Buffer> returned', async () => {
    const fragment = { ownerId: 'a', id: 'b', buffer: Buffer.from([1, 2, 3])}
    await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);

    const result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment.buffer);
  })

});
