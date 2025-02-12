import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signin from "./Signin";
import AuthForm from "./AuthForm";
import Game from "./Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
