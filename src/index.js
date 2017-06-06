import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {ThemeProvider} from 'glamorous';
import {HashRouter as Router} from 'react-router-dom';
import './index.css';

const theme = {
  primaryColor: '#f39c12',
  textColor: '#fff',
  fontFamily: "'Playfair Display',serif",
};

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}><App /></ThemeProvider>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
