// Step1: 載入 React 相關套件
import React from 'react';
import ReactDOM from 'react-dom';

// Step2: 載入 CSS 和 React 元件
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'normalize.css';

// Step 3: 將 React 元件和 HTML 互相綁定
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
