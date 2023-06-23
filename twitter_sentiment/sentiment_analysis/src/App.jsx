import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './component/index';
import Signin from './component/signin';
import Signup from './component/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
