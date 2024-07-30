
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlotList from "./PlotList.js";
import DropdownList from "./DropdownList.js";
import VariableDropdownList from "./VariableDropdownList.js";

/*
The PlotMenu component contains all the dropdown menus the user interacts with to query
for diagnostics stored in the Evagram database. The interaction works in a cascading
order: the user must select an option in the dropdown from top to bottom. The user can
leave dropdown menus empty or selected to broaden or narrow the diagnostics results.
The component also contains the PlotList component that renders the Bokeh plots by the
constraints.
*/
function PlotMenu() {
  const [owners, setOwners] = useState([]);
  const [groups, setGroups] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [observations, setObservations] = useState([]);
  const [variablesMap, setVariablesMap] = useState(new Map());
  const [currentOwner, setCurrentOwner] = useState("");
  const [currentExperiment, setCurrentExperiment] = useState("");
  const [currentObservation, setCurrentObservation] = useState("");
  const [currentVariableName, setCurrentVariableName] = useState("");
  const [currentChannel, setCurrentChannel] = useState("null");
  const [currentGroup, setCurrentGroup] = useState("");

  const [toggleChannel, setToggleChannel] = useState(false);

  const didMount = useRef(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/initial-load/")
      .then((response) => {
        setOwners(response.data["owners"]);
        setExperiments(response.data["experiments"]);
        // setGroups(response.data["groups"]);
        // setObservations(response.data["observations"]);
        didMount.current = true;
      })
      .catch((error) => console.log(error));
  }, []);


  // need another function to open second menu 


  const submitForm = (e) => {
    setCurrentOwner(document.getElementById("user_menu").value);
    setCurrentExperiment(document.getElementById("experiment_menu").value);
    setCurrentObservation(document.getElementById("observation_menu").value);
    setCurrentVariableName(document.getElementById("variable_menu").value);
    setCurrentChannel(document.getElementById("channel_menu").value);
    setCurrentGroup(document.getElementById("group_menu").value);
  };

  const updateOptionsByUser = (e) => {
    // setCurrentExperiment(""); // sets state to empty until all data is fetched
    setExperiments([]);
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-user-option/", {
          params: {
            owner_id: e.target.value,
          },
        })
        .then((response) => {
          setExperiments(response.data["experiments"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByExperiment = (e) => {
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    if (e.target.value !== "null") {
      //setCurrentGroup("");
      axios
        .get("http://localhost:8000/api/update-experiment-option/", {
          params: {
            experiment_id: e.target.value,
          },
        })
        .then((response) => {
          setObservations(response.data["observations"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByObservation = (e) => {
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-observation-option/", {
          params: {
            observation_id: e.target.value,
          },
        })
        .then((response) => {
          setVariablesMap(response.data["variablesMap"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByVariableName = (e) => {
    setToggleChannel(false);
    setGroups([]);
    if (e.target.value !== "null") {
      setToggleChannel(true);
      var channel = "null";
      if (variablesMap[e.target.value][0] !== null) {
        channel = variablesMap[e.target.value][0];
      }
      axios
        .get("http://localhost:8000/api/update-variable-option/", {
          params: {
            variable_name: e.target.value,
            channel: channel,
          },
        })
        .then((response) => {
          setGroups(response.data["groups"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByChannel = (e) => {
    setGroups([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-variable-option/", {
          params: {
            variable_name: document.getElementById("variable_menu").value,
            channel: e.target.value,
          },
        })
        .then((response) => {
          setGroups(response.data["groups"]);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    // <div id="experiment-header">

    // </div>
    <div id="main-div" className="min-h-screen flex flex-col items-left">
      <header className="font-heading font-bold text-black text-2xl text-center w-full bg-white p-5 shadow-lg">
          Experiment View

        </header>
     
 
    <div id="menu_container" className="mt-10 ml-10 flex flex-col w-96 justify-center items-center ">
      <header className="font-heading font-bold text-black text-2xl text-center mt-4">
            Experiment Details

          </header>
      
      <div id="required-dropdowns" className="">
        <header className="font-heading italic font-medium text-black text-sm text-center mt-1 ">
            Fields marked with * are mandatory

          </header>
        

      </div>
      
      <div id="dropdown-container" className="mt-3 p-6 w-full flex rounded-md flex-col  bg-white shadow-lg ">
        <label className="font-body font-bold text-black">User:</label>
        <DropdownList
          id="user_menu"
          updateOptionCallback={updateOptionsByUser}
          objects={owners}
          
        />
        <label className="font-body font-bold text-black">Experiment:</label>
        <DropdownList
          id="experiment_menu"
          updateOptionCallback={updateOptionsByExperiment}
          objects={experiments}
          

        />
        <label className="font-body font-bold text-black">Observation:</label>
        <DropdownList
          id="observation_menu"
          updateOptionCallback={updateOptionsByObservation}
          objects={observations}
          
        />
        <label className="font-body font-bold text-black">Variable:</label>
        <VariableDropdownList
          id="variable_menu"
          updateOptionsByVariableName={updateOptionsByVariableName}
          updateOptionsByChannel={updateOptionsByChannel}
          variablesMap={variablesMap}
          toggleChannel={toggleChannel}
        />
        <label className="font-body font-bold text-black">Group:</label>
        <DropdownList id="group_menu" objects={groups} />
        
      </div>

      <button
          className="submitBtn m-5 w-48 h-10 font-heading text-white shadow-lg rounded-md font-bold bg-primary-blue"
          type="submit"
          onClick={(e) => submitForm(e)}
        >
          Submit
        </button>


      <div className="ml-[100px] w-[60%] h-[300px]">
        <PlotList
          owner={currentOwner}
          experiment={currentExperiment}
          observation={currentObservation}
          variableName={currentVariableName}
          channel={currentChannel}
          group={currentGroup}
        />
      </div>
    </div>
    </div>
  );
}

export default PlotMenu;
