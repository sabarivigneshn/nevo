import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import BookTestDrive from "./components/bookTestDrive";

function App() {

   return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BookTestDrive />} />
      </Routes>
    </Router>
  );
}

export default App;
