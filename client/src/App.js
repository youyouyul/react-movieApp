import React, { Suspense } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Auth from './hoc/auth';

import NavBar from './components/views/NavBar/NavBar';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import VideoUploadPage from'./components/views/VideoUploadPage/VideoUploadPage';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={ Auth(LandingPage, null) } />  
          <Route exact path="/login" component={ Auth(LoginPage, false) } />
          <Route exact path="/register" component={ Auth(RegisterPage, false) } />
          <Route exact path="/video/upload" component={ Auth(VideoUploadPage, true) } />
        </Switch>
      </div>
    </Suspense>
  );
}

export default App;
