import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Store from './redux/store';
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <React.StrictMode>
    {/* <Store.StoreProvider> */}
      <RecoilRoot>
        <App />
      </RecoilRoot>
    {/* </Store.StoreProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.vlog))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
