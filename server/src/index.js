require('dotenv').config();
const cors = require("cors");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const { nanoid } = require("nanoid");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const log = console.log;
const sockets = new Map();

const clientPromise = MongoClient.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db("social-network");
    next();
  } catch (err) {
    next(err);
  }
});

const findUserBySessionId = async (db, sessionId) => {
  const session = await db.collection("sessions").findOne({ sessionId });
  if (!session) return null;
  return db.collection("users").findOne({ _id: new ObjectId(session.userId) });
};

const auth = () => async (req, _res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const user = await findUserBySessionId(req.db, sessionId);
  req.user = user;
  req.sessionId = sessionId;
  next();
};

const createSession = async (db, userId) => {
  const sessionId = nanoid();
  await db.collection("sessions").insertOne({ userId, sessionId });
  return sessionId;
};

const deleteSession = async (db, sessionId) => await db.collection("sessions").deleteOne({ sessionId });

app.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await req.db.collection("users").findOne({ username });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  else if (!(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Password does not match" });
  }

  const sessionId = await createSession(req.db, user._id);
  res.cookie("sessionId", sessionId).json({username: user.username, id: user._id});
})

app.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  await req.db.collection("users").insertOne({ username, passwordHash });
  res.status(201).send("User created");
})

app.get("/account", async (req, res) => {
  const { userId } = req.query;
  log(userId)
  const user = await req.db.collection("users").findOne({ _id: new ObjectId(userId) });
  res.json(user);
})

app.get("/logout", auth(), async (req, res) => {
    if (req.sessionId) {
    await deleteSession(req.db, req.sessionId);
    res.clearCookie("sessionId").send("User logged out");
  }
})


app.get('/users', async (req, res) => {
  const { myUserId } = req.query;
  const users = await req.db.collection("users")
    .find({ _id: { $ne: new ObjectId(myUserId) } }).toArray();
  res.json(users);
});

app.get('/messages', async (req, res) => {
  const { myUserId, recipientId } = req.query;
  const messages = await req.db.collection("messages").find().toArray();

  const chat = messages.filter(
    m =>
      (m.myUserId === myUserId && m.recipientId === recipientId) ||
      (m.myUserId === recipientId && m.recipientId === myUserId)
  );
  res.json(chat);
});

clientPromise.then(client => {
  const db = client.db("social-network");
  const users = db.collection("users");
  const messages = db.collection("messages");

  wss.on('connection', (ws) => {
    let myUserId = '';
    let recipientId = '';
    let username = '';

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);
        const recipient = sockets.get(msg.recipientId);
        recipientId = msg.recipientId;
        
        if (msg.type === 'login') {
          myUserId = msg.myUserId;

          username = msg.username;
          
          console.log(recipient?.readyState)
          if (recipient?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'isOnline', isOnline: true }));
            recipient.send(JSON.stringify({ type: 'isOnline', isOnline: true }));
          } else {
            ws.send(JSON.stringify({ type: 'isOnline', isOnline: false }))
          }

          sockets.set(myUserId, ws);
          console.log('Пользователь ' + username + ' вошел в чат');
          return;
        }

        if (msg.type == 'typing') {
          if (recipient?.readyState === WebSocket.OPEN) {
            recipient.send(JSON.stringify(msg));
          }
        }

        if (msg.type == 'stop-typing') {
          if (recipient?.readyState === WebSocket.OPEN) {
            recipient.send(JSON.stringify(msg));
          }
        }

        if (msg.type === 'message') {
          const { myUserId, recipientId, username, recipientName, message } = msg;
          await messages.insertOne({ myUserId, recipientId, username, recipientName, message });
          
          if (recipient?.readyState === WebSocket.OPEN) {
            recipient.send(JSON.stringify(msg));
          }
        }

      } catch (e) {
        console.error('Ошибка:', e.message);
      }
    });
  
    ws.on('close', async () => {
      if (!myUserId && !recipientId) return;
      const recipient = sockets.get(recipientId);
      if (recipient?.readyState === WebSocket.OPEN) {
        recipient.send(JSON.stringify({ type: 'isOnline', isOnline: false }));
      }
      sockets.delete(myUserId);
      console.log('Пользователь ' + username + ' вышел из чата');
    });
  });
})

app.use((err, req, res) => {
  // console.error(err);
  res.status(500).send(err.message)
});

const port = 3000;
server.listen(port, () => console.log(`http://localhost:${port}`));