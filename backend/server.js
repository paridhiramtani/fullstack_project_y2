const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hobbyhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobby: { type: String, required: true },
  countryCode: { type: String, required: true },
  phone: { type: String, required: true },
  fullPhone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  hobby: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Banned words list
const bannedWords = [
  'religious studies', 'islam', 'christianity', 'christ', 'god',
  'hinduism', 'sanatan', 'muslims', 'politics', 'religion'
];

// Helper function to check banned words
const containsBannedWords = (text) => {
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, hobby, countryCode, phone, fullPhone } = req.body;

    // Check for banned words in hobby
    if (containsBannedWords(hobby)) {
      return res.status(400).json({ message: 'This hobby is not allowed' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      hobby,
      countryCode,
      phone,
      fullPhone
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        hobby: newUser.hobby
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        hobby: user.hobby,
        countryCode: user.countryCode,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a hobby
app.get('/api/messages/:hobby', async (req, res) => {
  try {
    const messages = await Message.find({ hobby: req.params.hobby })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinRoom', async (hobby) => {
    socket.join(hobby);
    console.log(`User joined room: ${hobby}`);

    // Send previous messages
    const messages = await Message.find({ hobby })
      .sort({ timestamp: 1 })
      .limit(50);
    socket.emit('previousMessages', messages);
  });

  socket.on('chatMessage', async (data) => {
    const { hobby, sender, text } = data;

    // Save message to database
    const newMessage = new Message({
      hobby,
      sender,
      text,
      timestamp: new Date()
    });

    await newMessage.save();

    // Broadcast to room
    io.to(hobby).emit('message', {
      sender,
      text,
      timestamp: newMessage.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
