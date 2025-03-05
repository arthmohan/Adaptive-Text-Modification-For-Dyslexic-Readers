import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Results from './pages/Results';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/results" element={<Results/>}/>
      </Routes>
    </Router>
  );
}

export default App;