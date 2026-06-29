import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Task from "./pages/Task/Task";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task" element={<Task />} />
    </Routes>
  );
}

export default App;
