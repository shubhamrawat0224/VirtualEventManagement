const request = require('supertest');
const {app} = require('../../index');
const users = require('../../data/users');
const events = require('../../data/events');

let organizerToken;
let attendeeToken;
let createdEventId;

describe('Event API', () => {
  beforeEach(async () => {
    users.length = 0;
    events.length = 0;

    // Register organizer
    await request(app).post('/api/register').send({
      name: 'Organizer',
      email: 'org@example.com',
      password: 'pass123',
      role: 'organizer',
    });
    const orgRes = await request(app).post('/api/login').send({
      email: 'org@example.com',
      password: 'pass123',
    });
    organizerToken = orgRes.body.token;

    // Register attendee
    await request(app).post('/api/register').send({
      name: 'Attendee',
      email: 'att@example.com',
      password: 'pass123',
      role: 'attendee',
    });
    const attRes = await request(app).post('/api/login').send({
      email: 'att@example.com',
      password: 'pass123',
    });
    attendeeToken = attRes.body.token;
  });

  test('organizer can create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Test Event',
        description: 'Details here',
        date: '2025-08-01',
        time: '10:00',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.event.title).toBe('Test Event');
    createdEventId = res.body.event.id;
  });

  test('attendee cannot create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({ title: 'Fake', description: 'Fail', date: '2025-01-01', time: '12:00' });
    expect(res.statusCode).toBe(403);
  });

  test('can list events', async () => {
    await request(app).post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Test', description: 'ok', date: '2025-01-01', time: '10:00' });

    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('attendee can register for an event', async () => {
    const createRes = await request(app).post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Reg Event', description: 'info', date: '2025-01-01', time: '10:00' });

    const eventId = createRes.body.event.id;

    const regRes = await request(app).post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(regRes.statusCode).toBe(200);
    expect(regRes.body.message).toBe('Successfully registered for the event.');
  });
});
