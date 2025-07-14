const events = require('../data/events');
const users = require('../data/users');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

exports.getEvents = (req, res) => {
  res.json(events);
};

exports.createEvent = (req, res) => {
  const { title, description, date, time } = req.body;
  if (!title || !description || !date || !time) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const newEvent = {
    id: uuidv4(),
    title,
    description,
    date,
    time,
    createdBy: req.user.id,
    participants: [],
  };
  events.push(newEvent);
  res.status(201).json({ message: 'Event created successfully.', event: newEvent });
};

exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  if (event.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized to update this event.' });
  }
  const { title, description, date, time } = req.body;
  if (title) event.title = title;
  if (description) event.description = description;
  if (date) event.date = date;
  if (time) event.time = time;
  res.json({ message: 'Event updated.', event });
};

exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json({ message: 'Event not found.' });
  if (events[index].createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized to delete this event.' });
  }
  events.splice(index, 1);
  res.json({ message: 'Event deleted successfully.' });
};

exports.registerForEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });

  if (event.participants.includes(req.user.id)) {
    return res.status(400).json({ message: 'You are already registered for this event.' });
  }

  event.participants.push(req.user.id);

  const user = users.find(u => u.id === req.user.id);

  // Send confirmation email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Event Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Event Registration Confirmation',
      text: `Hi ${user.name}, you have successfully registered for: ${event.title}`,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
  }

  res.json({ message: 'Successfully registered for the event.' });
};

