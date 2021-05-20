import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './db.js';
import Pusher from 'pusher';
import session from 'express-session';
import bodyParser from 'body-parser';

dotenv.config();

ConnectDb();

const app = express();

const pusher = new Pusher({
  appId: '1206851',
  key: 'e64eb0d98384d7f1d4cc',
  secret: '05543a6b4374ce53da6e',
  cluster: 'mt1',
  useTLS: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true,
  })
);

app.post('/pusher/auth', (req, res) => {
  const { socket_id, channel_name } = req.body;
  // console.log(req.body.ID);
  //console.log(pusher.channel(channelName));

  // Retrieve username from session and use as presence channel user_id
  const presenceData = {
    user_id: req.session.username,
  };
  const auth = pusher.authenticate(socket_id, channel_name, presenceData);
  res.send(auth);
});

app.post('/join-chat', (req, res) => {
  // store username in session
  req.session.username = req.body.username;
  console.log(req.session.username);
  res.json('Joined');
});

app.post('/send-message', (req, res) => {
  pusher.trigger('presence-groupChat', 'message_sent', {
    username: req.body.username,
    message: req.body.message,
  });
  res.send('Message sent');
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
