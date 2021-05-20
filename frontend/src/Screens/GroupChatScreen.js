import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from 'react-bootstrap';
import Pusher from 'pusher-js';
import axios from 'axios';

//Pusher.logToConsole = true;
const pusher = new Pusher('e64eb0d98384d7f1d4cc', {
  cluster: 'mt1',

  authEndpoint: '/pusher/auth',

  encrypted: true,
});
const GroupChatScreen = () => {
  const [joined, setJoined] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');

  const listen = () => {
    const channel = pusher.subscribe('presence-groupChat');
    channel.bind('message_sent', (data) => {
      setMessages([
        ...messages,
        { username: data.username, message: data.message },
      ]);
    });
    console.log(messages);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    let message = {
      username: username,
      message: newMessage,
    };
    setNewMessage('');
    axios.post('/send-message', message);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('join-chat', { username });
      if (data) {
        setJoined(true);
        const channel = pusher.subscribe('presence-groupChat');
        channel.bind('pusher:subscription_succeeded', (members) => {
          // console.log(members.ids);
          // setUsers(members);
          // console.log(users);
        });

        channel.bind('pusher:member_added', (member) => {
          setStatus(`${member.id} joined the chat`);
          //console.log(member);
        });
        listen();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className='my-5'>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={4}>
          <Card className='p-3'>
            <Card.Title>
              GROUP CHAT<Badge>{users.length}</Badge>
            </Card.Title>
            {joined ? (
              <div>
                <Form.Text>{status}</Form.Text>
                <ul>
                  {messages.map((message) => (
                    <li key="">
                      <div>
                        <div className='header'>
                          <strong className='primary-font'>
                            {message.username}
                          </strong>
                        </div>
                        <p>{message.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Form onSubmit={sendMessage}>
                  <Form.Control
                    required
                    type='message'
                    value={newMessage}
                    placeholder='Type Your Message here..'
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></Form.Control>
                  <Button type='submit' className='my-2'>
                    SEND
                  </Button>
                </Form>
              </div>
            ) : (
              <Form onSubmit={onSubmitHandler}>
                <Form.Control
                  required
                  type='username'
                  value={username}
                  placeholder='Enter Username to Join Chat'
                  onChange={(e) => setUsername(e.target.value)}
                ></Form.Control>
                <Button type='submit' className='my-2'>
                  JOIN
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupChatScreen;
