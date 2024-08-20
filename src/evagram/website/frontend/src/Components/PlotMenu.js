
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
  const [experiments, setExperiments] = useState([]);
  const [cycleTimes, setCycleTimes] = useState([]);
  const [readers, setReaders] = useState([]);
  const [observations, setObservations] = useState([]);
  const [variablesMap, setVariablesMap] = useState(new Map());
  const [groups, setGroups] = useState([]);
  const [plotTypes, setPlotTypes] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const [selectedCycleTime, setSelectedCycleTime] = useState("");
  const [selectedReader, setSelectedReader] = useState("");
  const [selectedObservation, setSelectedObservation] = useState("");
  const [selectedVariableName, setSelectedVariableName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("null");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPlotType, setSelectedPlotType] = useState("");

  const [observationAlias, setObservationAlias] = useState("Observation");
  const [variableAlias, setVariableAlias] = useState("Variable");
  const [groupAlias, setGroupAlias] = useState("Group");

  const [toggleChannel, setToggleChannel] = useState(false);

  const didMount = useRef(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/initial-load/")
      .then((response) => {
        setOwners(response.data["owners"]);
        setExperiments(response.data["experiments"]);
        didMount.current = true;
      })
      .catch((error) => console.log(error));
  }, []);


  // need another function to open second menu 


  const submitForm = (e) => {
    setSelectedOwner(document.getElementById("user_menu").value);
    setSelectedExperiment(document.getElementById("experiment_menu").value);
    setSelectedCycleTime(document.getElementById("cycle_time_menu").value);
    setSelectedReader(document.getElementById("reader_menu").value);
    setSelectedObservation(document.getElementById("observation_menu").value);
    setSelectedVariableName(document.getElementById("variable_menu").value);
    setSelectedChannel(document.getElementById("channel_menu").value);
    setSelectedGroup(document.getElementById("group_menu").value);
    setSelectedPlotType(document.getElementById("plot_type_menu").value);
  };

  const updateOptionsByUser = (e) => {
    setExperiments([]);
    setCycleTimes([]);
    setReaders([]);
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    setPlotTypes([]);
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
    setCycleTimes([]);
    setReaders([]);
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    setPlotTypes([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-experiment-option/", {
          params: {
            experiment_id: e.target.value,
          },
        })
        .then((response) => {
          setCycleTimes(response.data["cycle_times"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByCycleTime = (e) => {
    setReaders([]);
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    setPlotTypes([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-cycle-time-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: e.target.value,
          },
        })
        .then((response) => {
          setReaders(response.data["readers"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOptionsByReader = (e) => {
    setObservations([]);
    setVariablesMap(new Map());
    setToggleChannel(false);
    setGroups([]);
    setPlotTypes([]);
    updateReaderAliases(e.target.value);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-reader-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: document.getElementById("cycle_time_menu").value,
            reader_id: e.target.value,
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
    setPlotTypes([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-observation-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: document.getElementById("cycle_time_menu").value,
            reader_id: document.getElementById("reader_menu").value,
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
    setPlotTypes([]);
    if (e.target.value !== "null") {
      setToggleChannel(true);
      var channel = "null";
      if (variablesMap[e.target.value][0] !== null) {
        channel = variablesMap[e.target.value][0];
      }
      axios
        .get("http://localhost:8000/api/update-variable-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: document.getElementById("cycle_time_menu").value,
            reader_id: document.getElementById("reader_menu").value,
            observation_id: document.getElementById("observation_menu").value,
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
    setPlotTypes([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-variable-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: document.getElementById("cycle_time_menu").value,
            reader_id: document.getElementById("reader_menu").value,
            observation_id: document.getElementById("observation_menu").value,
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

<<<<<<< HEAD
  

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

=======
  const updateOptionsByGroup = (e) => {
    setPlotTypes([]);
    if (e.target.value !== "null") {
      axios
        .get("http://localhost:8000/api/update-group-option/", {
          params: {
            experiment_id: document.getElementById("experiment_menu").value,
            cycle_time: document.getElementById("cycle_time_menu").value,
            reader_id: document.getElementById("reader_menu").value,
            observation_id: document.getElementById("observation_menu").value,
            variable_name: document.getElementById("variable_menu").value,
            channel: document.getElementById("channel_menu").value,
            group_id: e.target.value,
          },
        })
        .then((response) => {
          setPlotTypes(response.data["plot_types"]);
        })
        .catch((error) => console.log(error));
    }
  };

  const updateReaderAliases = (reader_id) => {
    if (reader_id === "null") {
      setObservationAlias("Observation");
      setVariableAlias("Variable");
      setGroupAlias("Group");
    } else {
      axios
        .get("http://localhost:8000/api/get-reader-aliases/", {
          params: {
            reader_id: reader_id,
          },
        })
        .then((response) => {
          setObservationAlias(response.data["observation_name"]);
          setVariableAlias(response.data["variable_name"]);
          setGroupAlias(response.data["group_name"]);
        })
        .catch((error) => console.log(error));
    }
  };
>>>>>>> upstream/develop

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
<<<<<<< HEAD
          // objects={dummyOwners}
          
=======
          nullable={false}
>>>>>>> upstream/develop
        />
        <label className="font-body font-bold text-black">Experiment:</label>
        <DropdownList
          id="experiment_menu"
          updateOptionCallback={updateOptionsByExperiment}
          objects={experiments}
          

        />
<<<<<<< HEAD
        <label className="font-body font-bold text-black">Observation:</label>
=======
        <label>Cycle Times:</label>
        <DropdownList
          id="cycle_time_menu"
          updateOptionCallback={updateOptionsByCycleTime}
          objects={cycleTimes}
        />
        <label>Reader:</label>
        <DropdownList
          id="reader_menu"
          updateOptionCallback={updateOptionsByReader}
          objects={readers}
        />
        <label>{observationAlias}:</label>
>>>>>>> upstream/develop
        <DropdownList
          id="observation_menu"
          updateOptionCallback={updateOptionsByObservation}
          objects={observations}
          
        />
<<<<<<< HEAD

        
        <label className="font-body font-bold text-black">Variable:</label>
=======
        <label>{variableAlias}:</label>
>>>>>>> upstream/develop
        <VariableDropdownList
          id="variable_menu"
          updateOptionsByVariableName={updateOptionsByVariableName}
          updateOptionsByChannel={updateOptionsByChannel}
          variablesMap={variablesMap}
          toggleChannel={toggleChannel}
        />
<<<<<<< HEAD
        <label className="font-body font-bold text-black">Group:</label>
        <DropdownList id="group_menu" objects={groups} /> */}

      
     
      </div>

      <button
          className="submitBtn m-5 w-48 h-10 font-heading text-white shadow-lg rounded-md font-bold bg-primary-blue hover:bg-[#17507E] 
          transition ease-in-out duration-300"
=======
        <label>{groupAlias}:</label>
        <DropdownList
          id="group_menu"
          updateOptionCallback={updateOptionsByGroup}
          objects={groups}
        />
        <label>Plot Types:</label>
        <DropdownList id="plot_type_menu" objects={plotTypes} />
        <button
          className="submitBtn"
>>>>>>> upstream/develop
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
          owner={selectedOwner}
          experiment={selectedExperiment}
          cycleTime={selectedCycleTime}
          reader={selectedReader}
          observation={selectedObservation}
          variableName={selectedVariableName}
          channel={selectedChannel}
          group={selectedGroup}
          plotType={selectedPlotType}
        />
     
      </div>
      
      
    </div>
    
  );
}

export default PlotMenu;
