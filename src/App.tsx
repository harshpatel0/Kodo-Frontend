import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Task from "./pages/Task/Task.tsx";
import { TaskProvider } from "./hooks/TaskContext";

function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:task?" element={<Task />} />
      </Routes>
    </TaskProvider>
  );
}

export default App;
