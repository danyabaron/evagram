import styles from "../styles/PlotMenu.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Plot from "./Plot.js";

function PlotMenu() {
  const [owners, setOwners] = useState([]);
  const [groups, setGroups] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [observations, setObservations] = useState([]);
  const [variables, setVariables] = useState([]);
  const [currentOwner, setCurrentOwner] = useState("");
  const [currentExperiment, setCurrentExperiment] = useState("");
  const [currentGroup, setCurrentGroup] = useState("");
  const [currentObservation, setCurrentObservation] = useState("");
  const [currentVariable, setCurrentVariable] = useState("");

  const didMount = useRef(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/initial-load")
      .then((response) => {
        setOwners(response.data["owners"]);
        setExperiments(response.data["experiments"]);
        setGroups(response.data["groups"]);
        setObservations(response.data["observations"]);
        setVariables(response.data["variables"]);
        didMount.current = true;
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (owners.length > 0) {
      setCurrentOwner(owners[0]["owner_id"]);
    }
  }, [owners]);

  useEffect(() => {
    if (experiments.length > 0) {
      setCurrentExperiment(experiments[0]["experiment_id"]);
    }
  }, [experiments]);

  useEffect(() => {
    if (observations.length > 0) {
      setCurrentObservation(observations[0]["observation_id"]);
    }
  }, [observations]);

  useEffect(() => {
    if (variables.length > 0) {
      setCurrentVariable(variables[0]["variable_id"]);
    }
  }, [variables]);

  useEffect(() => {
    if (groups.length > 0) {
      setCurrentGroup(groups[0]["group_id"]);
    }
  }, [groups]);

  const updateOptionsByUser = (e) => {
    setCurrentExperiment(""); // sets state to empty until all data is fetched
    axios
      .get("http://localhost:8000/api/update-user-option", {
        params: {
          owner_id: e.target.value,
        },
      })
      .then((response) => {
        setExperiments(response.data["experiments"]);
        setGroups(response.data["groups"]);
        setObservations(response.data["observations"]);
        setVariables(response.data["variables"]);
        setCurrentOwner(e.target.value);
      })
      .catch((error) => console.log(error));
  };

  const updateOptionsByExperiment = (e) => {
    setCurrentGroup("");
    axios
      .get("http://localhost:8000/api/update-experiment-option", {
        params: {
          experiment_id: e.target.value,
        },
      })
      .then((response) => {
        setGroups(response.data["groups"]);
        setObservations(response.data["observations"]);
        setVariables(response.data["variables"]);
        setCurrentExperiment(e.target.value);
      })
      .catch((error) => console.log(error));
  };

  const updateOptionsByObservation = (e) => {
    setCurrentVariable("");
    axios
      .get("http://localhost:8000/api/update-observation-option", {
        params: {
          observation_id: e.target.value,
        },
      })
      .then((response) => {
        setVariables(response.data["variables"]);
        setGroups(response.data["groups"]);
        setCurrentObservation(e.target.value);
      })
      .catch((error) => console.log(error));
  };

  const updateOptionsByVariable = (e) => {
    setCurrentGroup("");
    axios
      .get("http://localhost:8000/api/update-variable-option", {
        params: {
          variable_id: e.target.value,
        },
      })
      .then((response) => {
        setGroups(response.data["groups"]);
        setCurrentVariable(e.target.value);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div id="menu_container" className={styles.menu_container}>
      <div className={styles.dropdown_container}>
      <label for="user-menu">User:</label>
        <select id="user-menu" onChange={(e) => updateOptionsByUser(e)}>
          {owners.map((owner) =>
            owner.owner_id === currentOwner ? (
              <option key={owner.owner_id} value={owner.owner_id} selected>
                {owner.first_name + " " + owner.last_name}
              </option>
            ) : (
              <option key={owner.owner_id} value={owner.owner_id}>
                {owner.first_name + " " + owner.last_name}
              </option>
            )
          )}
        </select>
        <label for="experiment-menu">Experiment:</label>
        <select
          id="experiment-menu"
          onChange={(e) => updateOptionsByExperiment(e)}
        >
          {experiments.map((experiment) =>
            experiment.experiment_id === currentExperiment ? (
              <option
                key={experiment.experiment_id}
                value={experiment.experiment_id}
                selected
              >
                {experiment.experiment_name}
              </option>
            ) : (
              <option
                key={experiment.experiment_id}
                value={experiment.experiment_id}
              >
                {experiment.experiment_name}
              </option>
            )
          )}
        </select>
        <label for="observation-menu">Observation:</label>
        <select
          id="observation-menu"
          onChange={(e) => updateOptionsByObservation(e)}
        >
          {observations.map((observation) =>
            observation.observation_id === currentObservation ? (
              <option
                key={observation.observation_id}
                value={observation.observation_id}
                selected
              >
                {observation.observation_name}
              </option>
            ) : (
              <option
                key={observation.observation_id}
                value={observation.observation_id}
              >
                {observation.observation_name}
              </option>
            )
          )}
        </select>
        <label for="variable-menu">Variable:</label>
        <select id="variable-menu" onChange={(e) => updateOptionsByVariable(e)}>
          {variables.map((variable) =>
            variable.variable_id === currentVariable ? (
              variable.channel ? (
                <option
                  key={variable.variable_id}
                  value={variable.variable_id}
                  selected
                >
                  {variable.variable_name + variable.channel}
                </option>
              ) : (
                <option
                  key={variable.variable_id}
                  value={variable.variable_id}
                  selected
                >
                  {variable.variable_name}
                </option>
              )
            ) : variable.channel ? (
              <option key={variable.variable_id} value={variable.variable_id}>
                {variable.variable_name + variable.channel}
              </option>
            ) : (
              <option key={variable.variable_id} value={variable.variable_id}>
                {variable.variable_name}
              </option>
            )
          )}
        </select>
        <label for="group-menu">Group:</label>
        <select
          id="group-menu"
          onChange={(e) => setCurrentGroup(e.target.value)}
        >
          {groups.map((group) =>
            group.group_id === currentGroup ? (
              <option key={group.group_id} value={group.group_id} selected>
                {group.group_name}
              </option>
            ) : (
              <option key={group.group_id} value={group.group_id}>
                {group.group_name}
              </option>
            )
          )}
        </select>
      </div>
      <div className={styles.plot}>
        <Plot
          experiment={currentExperiment}
          group={currentGroup}
          observation={currentObservation}
          variable={currentVariable}
        />
      </div>
    </div>
  );
}

export default PlotMenu;
