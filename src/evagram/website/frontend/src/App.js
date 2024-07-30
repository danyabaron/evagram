import "./App.css";
import Navbar from "./Components/Navbar"
import PlotMenu from "./Components/PlotMenu";
import Plot from "./Components/Plot";

function App() {
  return (
    <div className="App">
      <Navbar/>
        <PlotMenu>
          <Plot />
        </PlotMenu>

      
      
    </div>
  );
}

export default App;

