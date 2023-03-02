import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Screens/BookRoom';
import View from './Screens/view';
import AddRoom from './Screens/AddRoom';
import Edit from './Screens/Edit';
import reportWebVitals from './reportWebVitals';
import LayoutContainer from './Components/Header/LayoutContainer';
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>

<LayoutContainer />
  <Routes>
  
    <Route path="/" exact element={<App />} />
    <Route path="/edit" exact element={<Edit />} />
    <Route path="/view" exact element={<View />} />
    <Route path="/add" exact element={<AddRoom />} />
   
  </Routes>

  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
