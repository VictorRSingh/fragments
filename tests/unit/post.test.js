const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    await request(app).post('/v1/fragments').expect(401);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('Hello, world!')
      .expect(201);

    expect(res.body.status).toBe('ok');
    expect(res.body.fragment?.type).toBe('text/plain');
  });

  test('incorrect credentials are denied', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('responses include all necessary properties (id, ownerId, created, updated, type, size)', async () => {
      const res = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('Hello, world!')
      .expect(201);

    expect(res.body.fragment).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ownerId: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        type: 'text/plain',
        size: 13,
      })
    );
  });

  test('POST requests include a Location header with a full URL to the GET request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('Hello, world!')
      .expect(201);
    
    expect(res.headers.location).toBe(`http://localhost:8080/v1/fragments/${res.body.fragment.id}`);
  });

  test('trying to create a fragment with an unsupported type errors/logs as expected', async () => {
    expect(await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'image/jpeg')
      .send('Hello, world!')
      .expect(415));
  }); 
});
