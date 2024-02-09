import "./App.css";
import PlotMenu from "./Components/PlotMenu";
import Plot from "./Components/Plot";

function App() {
  return (
    <div className="App">
      <PlotMenu>
        <Plot />
      </PlotMenu>
    </div>
  );
}

export default App;
