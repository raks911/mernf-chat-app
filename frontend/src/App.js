import './App.css';
import {Route,Routes} from 'react-router-dom'
import HomePage from './components/HomePage';
import Chatpage from './components/Chatpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/chat" element={<Chatpage></Chatpage>}></Route>
        </Routes>
        
    </div>
  );
}

export default App;
