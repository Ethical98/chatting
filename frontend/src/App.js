import React, { useState } from 'react';
import { Badge, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GroupChatScreen from './Screens/GroupChatScreen';

function App() {
  return (
    <Container>
      
      <Router>
        <Route path='/' component={GroupChatScreen}></Route>
      </Router>
    </Container>
  );
}

export default App;
