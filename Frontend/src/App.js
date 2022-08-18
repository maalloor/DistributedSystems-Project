import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { About } from './components/about'
import { Electronics } from './components/electronics';
import { Navbar } from './components/navbar';
function App() {
  return (
    <Router>
        <Navbar/>
            <div className="container">
              <Routes>
                <Route path="/" element= {<Electronics/>} />
                <Route path="/about" element= {<About/>} />
              </Routes>
            </div>
    </Router>
  );
}

export default App;
