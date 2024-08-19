
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlotList from "./PlotList.js";
import DropdownList from "./DropdownList.js";
import VariableDropdownList from "./VariableDropdownList.js";

import { IoMdInformationCircleOutline } from "react-icons/io";


/*
The PlotMenu component contains all the dropdown menus the user interacts with to query
for diagnostics stored in the Evagram database. The interaction works in a cascading
order: the user must select an option in the dropdown from top to bottom. The user can
leave dropdown menus empty or selected to broaden or narrow the diagnostics results.
The component also contains the PlotList component that renders the Bokeh plots by the
constraints.
*/
function PlotMenu() {
  // const dummyOwners = [{key: 1, keyValue: 2  }];

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

  

    // Sample options for the dropdowns
  const userOptions = ["User 1", "User 2", "User 3"];
  const experimentOptions = ["Experiment A", "Experiment B", "Experiment C"];
  const cycleTimeOptions = ["10s", "20s", "30s"];
  const readerOptions = ["Reader 1", "Reader 2", "Reader 3"];
  const observationOptions = ["Observation 1", "Observation 2", "Observation 3"];
  const variableOptions = ["Variable X", "Variable Y", "Variable Z"];
  const groupOptions = ["Group 1", "Group 2", "Group 3"];
  const plotTypeOptions = ["Plot Type A", "Plot Type B", "Plot Type C"];
  const channelOptions =["Atmoshphere", "Temperature", "Brightness"];


  // State for dropdown selections
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedExperiment, setSelectedExperiment] = useState('');
  const [selectedCycleTime, setSelectedCycleTime] = useState('');
  const [selectedReader, setSelectedReader] = useState('');


  const [seelctedObservation, setSelectedObservation] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  
  const [selectedPlotType, setSelectedPlotType] = useState('');

  // State to control visibility of expand-dropdowns
  const [isExpandDropdownsVisible, setExpandDropdownsVisible] = useState(false);

  // Handle reader selection
  const handleReaderChange = (e) => {
    setSelectedReader(e.target.value);
    setExpandDropdownsVisible(true); // Show expand-dropdowns when a reader is selected
  };


  return (
    // <div id="experiment-header">

    // </div>
    <div id="main-div" className="min-h-screen flex flex-col">
      <div id="header" className="flex justify-center  items-center p-5 bg-white shadow-lg relative">
        <header className="font-heading font-bold text-black text-2xl flex items-center">
          Experiment View
          </header>
          <div className="relative group">
            <IoMdInformationCircleOutline className="ml-2 text-2xl cursor-pointer" />
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:flex flex-row items-center">
              <div className="bg-white w-[376px] shadow-lg text-black font-medium font-body text-sm p-2 rounded-lg">
                Welcome to Experiment View. 
                <p className="mb-4 font-body">
                  Here you can set your attributes of the experiment you are examining, 
                  and also bookmark this page to come back to.
                </p> 
                <p>
                  Pick your fields from the drop downs and the left, 
                  and hit submit to see the generated plots.

                </p>
               

                
             
                </div>
            </div>
          </div>
       
      </div>

     
  <div id="outer-container" className="mt-5 mb-5 flex flex-col lg:flex-row justify-center items-center lg:gap-48 gap-10">
    <div id="menu_container" className="mt-5 ml-10 flex flex-col w-96 justify-center items-center ">

      <div id="experiment-details-label" className="p-3">
        <header className="font-heading font-bold text-black text-2xl text-center ">
              Experiment Details

            </header>
        
        <div id="mandatory-label" className="">
          <header className="font-heading italic font-medium text-black text-sm text-center mt-1 ">
              Fields marked with * are mandatory

            </header>
      </div>

      </div>
      
      
      <div id="dropdown-container" className="mt-3 p-6 w-fit mb-3 flex rounded-md space-x-4 flex-row  bg-white shadow-lg ">

        {/* static drop down  */}

        <div id="required-dropdowns" className="w-fit flex flex-col">
          <label className="font-body font-bold text-black">User *</label>
              <select
                className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
            <option value="" disabled>Select One</option>
            {userOptions.map((user, index) => (
              <option key={index} value={user}>{user}</option>
            ))}
          </select>

          <label className="font-body font-bold text-black">Experiment *</label>
          <select
                className="bg-[#cccfd3] bg-opacity-100 w-36 shadow-lg m-1.5 mb-1 rounded-md"
                value={selectedExperiment}
                onChange={(e) => setSelectedExperiment(e.target.value)}
              >
              <option value="" disabled>Select One</option>
              {experimentOptions.map((experiment, index) => (
                <option key={index} value={experiment}>{experiment}</option>
              ))}
        </select>

          <label className="font-body font-bold text-black">Cycle Time *</label>
          <select
            className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
            value={selectedCycleTime}
            onChange={(e) => setSelectedCycleTime(e.target.value)}
          >
            <option value="" disabled>Select One</option>
            {cycleTimeOptions.map((cycleTime, index) => (
              <option key={index} value={cycleTime}>{cycleTime}</option>
            ))}
      </select>

          <label className="font-body font-bold text-black">Reader *</label>
          <select
                className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                value={selectedReader}
                onChange={handleReaderChange} // Call the handleReaderChange function
              >
                <option value="" disabled>Select One</option>
                {readerOptions.map((reader, index) => (
                  <option key={index} value={reader}>{reader}</option>
                ))}
              </select>
        </div>

        {/* static expanded drop down  */}

    {/* Conditionally render expanded drop down */}
    {isExpandDropdownsVisible && (
              <div id="expand-dropdowns" className="w-fit flex flex-col">
                <label className="font-body font-bold text-black">Observation</label>
                <select
                  className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                  value={seelctedObservation}
                  onChange={(e) => setSelectedObservation(e.target.value)} 
              >
                <option value="" disabled>Select One</option>
                {observationOptions.map((observation, index) => (
                  <option key={index} value={observation}>{observation}</option>
                ))}
              </select>

                <label className="font-body font-bold text-black">Variable</label>
                  <select
                    className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                    value={selectedVariable}
                    onChange={(e) => setSelectedVariable(e.target.value)} 
                >
                  <option value="" disabled>Select One</option>
                    {variableOptions.map((variable, index) => (
                      <option key={index} value={variable}>{variable}</option>
                ))}
              </select>
              
              {/* Conditionally Render New Dropdown if Any Variable is Selected */}
              {selectedVariable && (
                <>
                  <label className="font-body font-bold text-black">Channel</label>
                  <select
                    className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)} 
                  >
                    <option value="" disabled>Select One</option>
                    {channelOptions.map((channel, index) => (
                      <option key={index} value={channel}>{channel}</option>
                    ))}
                  </select>
                </>
              )}

                <label className="font-body font-bold text-black">Group</label>
                <select
                    className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                    value={selectedVariable}
                    onChange={(e) => setSelectedGroup(e.target.value)} 
                >
                  <option value="" disabled>Select One</option>
                    {groupOptions.map((group, index) => (
                      <option key={index} value={group}>{group}</option>
                ))}
              </select>

                <label className="font-body font-bold text-black">Plot Type</label>
                  <select
                      className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"
                      value={selectedPlotType}
                      onChange={(e) => setSelectedPlotType(e.target.value)} 
                  >
                    <option value="" disabled>Select One</option>
                      {plotTypeOptions.map((plottype, index) => (
                        <option key={index} value={plottype}>{plottype}</option>
                  ))}
                </select>

              </div>
            )}
  

        {/* Drop Downs with Database Connected */}

        {/* <label className="font-body font-bold text-black">User:</label>
        <DropdownList
          id="user_menu"
          updateOptionCallback={updateOptionsByUser}
          objects={owners}
          // objects={dummyOwners}
          
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
        <DropdownList id="group_menu" objects={groups} /> */}

      
     
      </div>

      <button
          className="submitBtn m-5 w-48 h-10 font-heading text-white shadow-lg rounded-md font-bold bg-primary-blue hover:bg-[#17507E] 
          transition ease-in-out duration-300"
          type="submit"
          onClick={(e) => submitForm(e)}
        >
          Submit
        </button>

        <button
          className="submitBtn m-5 w-48 h-14 font-heading text-white shadow-lg rounded-md font-bold bg-secondary-blue
           hover:bg-[#071C2C] 
          transition ease-in-out duration-300"
          
        >
          
          View Another Experiment
        </button>


        </div>

       
      
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
    
  );
}

export default PlotMenu;
