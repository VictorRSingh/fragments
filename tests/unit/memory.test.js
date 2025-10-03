const {
  readFragment,
  writeFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('write fragment metadata to memory db', async () => {
    const fragment = { ownerId: 'a', id: 'b' };
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('read fragment metadata from memory db', async () => {
    const fragment = { ownerId: 'a', id: 'b' };
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('write fragments data buffer to memory db', async () => {
    const ownerId = 'a';
    const id = 'b';
    const buffer = Buffer.from([1, 2, 3]);
    const fragment = { ownerId, id, buffer };

    const result = await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    expect(result).toBe(undefined);
  });

  test('read fragment data from memory db', async () => {
    const ownerId = 'a';
    const id = 'b';
    const buffer = Buffer.from([1, 2, 3]);

    await writeFragmentData(ownerId, id, buffer);
    const result = await readFragmentData(ownerId, id);

    expect(result).toEqual(buffer);
  });

  test('Get list of fragment ids for a given user(ownerId) from memory db when expanded is false', async () => {
    const ownerId = 'a';
    const result = await listFragments(ownerId);
    expect(result).toEqual(['b']);
  });

  test('Get list of fragment ids for a given user(ownerId) from memory db when expanded is true', async () => {
    const ownerId = 'a';
    const result = await listFragments(ownerId, true);
    expect(result).toEqual([JSON.stringify({ ownerId: 'a', id: 'b' })]);
  });

  test('Delete a fragments metadata and data from memory db', async () => {
    const ownerId = 'a';
    const id = 'b';

    const result = await deleteFragment(ownerId, id);
    expect(result).toEqual([undefined, undefined]);

    const readResult = await readFragment(ownerId, id);
    expect(readResult).toBe(undefined);
  });

  test('writeFragment() expects string keys in fragment', () => {
    expect(async () => await writeFragment()).rejects.toThrow();
    expect(async () => await writeFragment({})).rejects.toThrow();
    expect(async () => await writeFragment({ ownerId: 'a' })).rejects.toThrow();
  });

  test('readFragment() expects string keys', () => {
    expect(async () => await readFragment()).rejects.toThrow();
    expect(async () => await readFragment(1)).rejects.toThrow();
    expect(async () => await readFragment(1, 1)).rejects.toThrow();
  });

  test('writeFragmentData() expects string keys', () => {
    expect(async () => await writeFragmentData()).rejects.toThrow();
    expect(async () => await writeFragmentData(1)).rejects.toThrow();
    expect(async () => await writeFragmentData(1, 1, Buffer.from([1, 2, 3]))).rejects.toThrow();
  });

  test('readFragmentData() expects string keys', () => {
    expect(async () => await readFragmentData()).rejects.toThrow();
    expect(async () => await readFragmentData(1)).rejects.toThrow();
    expect(async () => await readFragmentData(1, 1)).rejects.toThrow();
  });

  test('listFragments() expects string key', () => {
    expect(async () => await listFragments()).rejects.toThrow();
    expect(async () => await listFragments(1)).rejects.toThrow();
  });

  test('deleteFragment() expects string keys', () => {
    expect(() => deleteFragment()).rejects.toThrow();
    expect(() => deleteFragment(1)).rejects.toThrow();
    expect(() => deleteFragment(1, 1)).rejects.toThrow();
  });
});
