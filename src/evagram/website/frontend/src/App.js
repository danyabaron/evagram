import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import About from "./Components/About";
import PlotMenu from "./Components/PlotMenu";
import Plot from "./Components/Plot";
import Footer from "./Components/Footer";


function App() {
  return (
    <Router>
    
    <div className="App">
      <Navbar/>
      <Routes>
          {/* Setting PlotMenu as the main page */}
          <Route path="/" element={<PlotMenu />} />
          <Route path="/about" element={<About />} />
          
        </Routes>
      <Footer/>
      </div>
    </Router>
      
      
   
  );
}

export default App;

