import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './index.css'
import './satoshi.css'

import axios from 'axios';

const API_ORIGIN = `${window.location.protocol}//${window.location.hostname}:5000`;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_ORIGIN;

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string') {
    config.url = config.url
      .replace('http://127.0.0.1:5000', API_ORIGIN)
      .replace('http://localhost:5000', API_ORIGIN);
  }

  config.withCredentials = true;
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
