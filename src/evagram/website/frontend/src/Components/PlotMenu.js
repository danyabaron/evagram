
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlotList from "./PlotList.js";
import DropdownList from "./DropdownList.js";
import VariableDropdownList from "./VariableDropdownList.js";
import plot1 from "./assets/plot1.png";
import plot2 from "./assets/plot2.png";
import plot3 from "./assets/plot3.png";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

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

   // array of static carousel images

   const imageList = [
    {
      id: 1,
      src: plot1,
      alt: "Image 1",
    },
    {
      id: 2,
      src: plot2,
      alt: "Image 2",
    },
    {
      id: 3,
      src: plot3,
      alt: "Image 3",
    }

  ]

  // Carousel Logic

  // index for carousel images 
  const [currentIndex, setCurrentIndex] = useState(0);

  //logic for slider arrows

  //logic for previous slide button
  const prevSlide = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? imageList.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

  }
  //logic for next slide button
  const nextSlide = () => {
    const isLastSlide = currentIndex === imageList.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    // <div id="experiment-header">

    // </div>
    <div id="main-div" className="min-h-screen flex flex-col">
      <header className="font-heading font-bold text-black text-2xl text-center w-full bg-white p-5 shadow-lg">
          Experiment View

        </header>
     
  <div id="outer-container" className="mt-5 flex flex-row justify-start items-start space-x-6  w-full">
    <div id="menu_container" className="mt-5 ml-10 flex flex-col w-96 justify-center items-center ">

      <div id="experiment-details-label" className="p-5">
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
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Experiment *</label>
          <select className="bg-[#cccfd3] bg-opacity-100 w-36 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Cycle Time *</label>
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Reader *</label>
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>
        </div>

        {/* static expanded drop down  */}

        <div id="expand-dropdowns" className="w-fit flex flex-col">
          <label className="font-body font-bold text-black">Observation</label>
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Variable</label>
          <select className="bg-[#cccfd3] bg-opacity-100 w-36 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Group</label>
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>

          <label className="font-body font-bold text-black">Plot Type</label>
          <select className="bg-[#cccfd3] w-36 bg-opacity-100 shadow-lg m-1.5 mb-1 rounded-md"></select>
        </div>

  

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
          className="submitBtn m-5 w-48 h-10 font-heading text-white shadow-lg rounded-md font-bold bg-primary-blue"
          type="submit"
          onClick={(e) => submitForm(e)}
        >
          Submit
        </button>
        </div>

        {/* carousel with static images to test  */}
        <div id="carousel" className=" m-5 w-full flex flex-col items-center">
          <div id="plot-header" className="p-5">
            <header className="font-heading font-bold text-black text-2xl text-center ">
              Plot View
            </header>
          </div>
          <div id="image-container" className="w-full flex flex-col items-center p-5">
            <div 
              style={{backgroundImage: `url(${imageList[currentIndex].src})`}} 
              className='w-[545px] h-[445px] rounded-lg bg-center bg-cover duration-300'
            >
              </div>
              <div id="arrow-container" className="flex flex-row p-5 space-x-4"> 
              {/* left arrow */}
              <div className="right-5 text-2xl p-2 rounded-full bg-primary-blue/20 text-black cursor-pointer">
                  
                  <RiArrowLeftSLine onClick={prevSlide} size={40}/>
                </div>
              {/* right arrow */}
                <div className="right-5 text-2xl p-2 rounded-full bg-primary-blue/20 text-black cursor-pointer">
                 
                  <RiArrowRightSLine onClick={nextSlide} size={40}/>
                </div>

              </div>
              <div id="diagnostics-text">
                <header className="font-body font-medium text-base">
                  Showing {currentIndex + 1} out of {imageList.length} diagnostics
                </header>
              </div>
              <div id="scroll-text" className="p-2">
                <header className="font-body italic font-medium text-sm">
                  Click on arrow buttons to scroll through diagnostics
                </header>
              </div>
             

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
    </div>
  );
}

export default PlotMenu;
