import styles from "../styles/PlotMenu.module.css";
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

  const [toggleChannel, setToggleChannel] = useState(false);

  const didMount = useRef(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/initial-load/")
      .then((response) => {
        setOwners(response.data["owners"]);
        didMount.current = true;
      })
      .catch((error) => console.log(error));
  }, []);

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

  return (
    <div id="menu_container" className={styles.menu_container}>
      <div className={styles.dropdown_container}>
        <label>User:</label>
        <DropdownList
          id="user_menu"
          updateOptionCallback={updateOptionsByUser}
          objects={owners}
        />
        <label>Experiment:</label>
        <DropdownList
          id="experiment_menu"
          updateOptionCallback={updateOptionsByExperiment}
          objects={experiments}
        />
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
        <label>Observation:</label>
        <DropdownList
          id="observation_menu"
          updateOptionCallback={updateOptionsByObservation}
          objects={observations}
        />
        <label>Variable:</label>
        <VariableDropdownList
          id="variable_menu"
          updateOptionsByVariableName={updateOptionsByVariableName}
          updateOptionsByChannel={updateOptionsByChannel}
          variablesMap={variablesMap}
          toggleChannel={toggleChannel}
        />
        <label>Group:</label>
        <DropdownList
          id="group_menu"
          updateOptionCallback={updateOptionsByGroup}
          objects={groups}
        />
        <label>Plot Types:</label>
        <DropdownList id="plot_type_menu" objects={plotTypes} />
        <button
          className="submitBtn"
          type="submit"
          onClick={(e) => submitForm(e)}
        >
          Submit
        </button>
      </div>
      <div className={styles.plot}>
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
