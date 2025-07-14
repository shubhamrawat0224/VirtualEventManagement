                                                                                     🎉 Virtual Event Management Backend
This is a simple virtual event management backend built using Node.js, Express.js, JWT Authentication, and Nodemailer. It uses in-memory storage to handle users, events, and registrations.

📜 Features
✅ User Registration & Login with bcrypt and JWT

✅ Role-based access for Organizers and Attendees

✅ CRUD Operations for Event Management (Organizers Only)

✅ Event Registration (Attendees)

✅ Email Notification on Event Registration using Nodemailer

✅ RESTful API Endpoints

✅ Fully Tested with Jest and Supertest

📂 Project Structure
/controllers    → Business logic
/data           → In-memory stores for users and events
/middleware     → Authentication and authorization middleware
/routes         → API routes
/utils          → Utility functions (email sender)
test/           → Jest test cases
app.js          → Express app setup
🚀 Getting Started
1. Clone the Repo
git clone https://github.com/your-username/virtual-event-platform.git
cd virtual-event-platform
2. Install Dependencies
npm install
3. Configure Environment Variables
Create a .env file:

PORT=3000
JWT_SECRET=your_jwt_secret_key

EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_email
EMAIL_PASS=your_ethereal_password
💡 For testing emails, you can use Ethereal Email or substitute with real SMTP like Gmail/SendGrid.

4. Run the Server
npm run dev
🧪 Running Tests
npm run test
Covers:

✅ User registration and login

✅ Event CRUD operations

✅ Event registration

📌 API Endpoints
Method	Endpoint	Description	Access
POST	/api/register	Register user (organizer or attendee)	Public
POST	/api/login	Login user	Public
GET	/api/events	List all events	Authenticated users
POST	/api/events	Create event	Organizer
PUT	/api/events/:id	Update event	Organizer (creator only)
DELETE	/api/events/:id	Delete event	Organizer (creator only)
POST	/api/events/:id/register	Register for an event	Attendee

✅ Roles
organizer: Can create, update, delete events.

attendee: Can register for events.

🌟 Tech Stack
Node.js + Express.js

bcryptjs + JWT

Nodemailer

Jest + Supertest (Testing)

