
# 🎨 HobbyHub - MEAN Stack Application

A real-time chat application that connects people with similar hobbies using the MEAN stack (MongoDB, Express.js, AngularJS, Node.js) with Socket.IO for real-time communication.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Hobby-based Groups**: Connect with people who share your interests
- **Real-time Chat**: Instant messaging using Socket.IO
- **Content Filtering**: Automatically blocks religious and political topics
- **International Support**: Country code selection with flags
- **Responsive Design**: Modern, gradient-based UI

## 🎯 Available Hobbies

- Pottery
- Jewellery Making
- Sculpture Making
- Poetry
- Creative Writing
- Coding
- Sports (Indoor)
- Fashion Designing
- Yoga and Meditation
- Fitness
- Others (with content filtering)

## 🚫 Filtered Topics

The application automatically blocks:
- Religious studies, Islam, Christianity, Christ, God
- Hinduism, Sanatan, Muslims
- Politics, Religion

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
mkdir hobbyhub
cd hobbyhub
```

### 2. Set Up Backend

Create a `backend` folder and add the following files:

#### File Structure:
```
hobbyhub/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env (optional)
├── public/
│   ├── index.html (or login.html)
│   ├── register-angular.html
│   ├── chat-improved.html
│   ├── app.js
│   ├── service.js
│   └── controllers.js
```

#### Install Backend Dependencies:

```bash
cd backend
npm install
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `server.js` connection string

### 4. Configure Environment (Optional)

Create `.env` file in backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hobbyhub
JWT_SECRET=your_secret_key_here_change_this_in_production
```

### 5. Run the Application

#### Terminal 1 - Start Backend:
```bash
cd backend
npm start
# Or for development with auto-restart:
npm run dev
```

#### Terminal 2 - Serve Frontend:
```bash
cd public
# Using Python 3:
python -m http.server 3000

# Or using Python 2:
python -m SimpleHTTPServer 3000

# Or using Node.js http-server:
npx http-server -p 3000
```

### 6. Access the Application

- Frontend: http://localhost:3000/login.html
- Register: http://localhost:3000/register-angular.html
- Backend API: http://localhost:5000/api

## 🎮 Usage

1. **Register**: Go to register page, fill in details, select hobby
2. **Login**: Use your credentials to log in
3. **Chat**: Join your hobby group and start chatting!

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Messages
- `GET /api/messages/:hobby` - Get messages for specific hobby

### Socket.IO Events
- `joinRoom` - Join a hobby chat room
- `chatMessage` - Send a message
- `message` - Receive messages
- `previousMessages` - Load chat history

## 🔧 Project Structure

```
backend/
├── server.js           # Main server file with Express, Socket.IO, MongoDB
└── package.json        # Backend dependencies

public/
├── login.html          # Login page
├── register-angular.html  # Registration page with AngularJS
├── chat-improved.html  # Real-time chat interface
├── app.js              # AngularJS app initialization
├── service.js          # API service layer
└── controllers.js      # AngularJS controllers
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation
- Content filtering for banned topics
- CORS enabled for frontend-backend communication

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running:
mongo --eval "db.version()"

# If using MongoDB Atlas, verify connection string
```

### Port Already in Use
```bash
# Change ports in:
# - server.js (PORT variable)
# - service.js (API_URL)
# - controllers.js (socket connection)
```

### CORS Errors
Verify `cors` is properly configured in `server.js`:
```javascript
app.use(cors());
```

### Socket.IO Connection Issues
Check that:
1. Backend is running on port 5000
2. Frontend Socket.IO URL matches: `http://localhost:5000`
3. Socket.IO script is loaded in HTML

## 📝 Development Notes

- Frontend uses AngularJS 1.8.3
- Backend uses Express.js with Socket.IO
- Database: MongoDB with Mongoose ODM
- Real-time: Socket.IO for instant messaging
- Authentication: JWT tokens with bcryptjs hashing

## 🚀 Deployment Tips

### For Production:
1. Change JWT secret in environment variables
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Set proper CORS origins
5. Use environment variables for configuration
6. Add rate limiting and additional security

### Hosting Options:
- **Backend**: Heroku, DigitalOcean, AWS, Render
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Database**: MongoDB Atlas

## 📄 License

MIT License - Feel free to use for learning and personal projects.

## 🤝 Contributing

This is a learning project. Feel free to fork and customize!

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Verify all services are running
3. Check console for error messages
4. Ensure MongoDB is connected

---

**Happy Connecting! 🎨**
