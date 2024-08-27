import React from 'react';
import  PlotMenu from "./PlotMenu.js";
import ExperimentView from "./assets/experiment view.png";
import ExperimentSearch from "./assets/ExperimentSearch.png";

function About() {
    return ( 
     
        <div className="flex flex-col min-h-screen max-w-screen w-full bg-bg-blue">

            <div
                id="header"
                className="flex flex-col items-left p-5 bg-white shadow-lg relative"
            >
                <header className="font-heading font-bold text-black text-2xl flex">
                Welcome to Evagram
                </header>
                <h2 className="font-heading font-medium text-black text-xl flex">
                    User Guide
                </h2>
      
          </div>

          <div className="flex flex-1 bg-bg-blue">
                {/* Side Navigation Bar */}
                <nav className="w-55 p-5 min-h-screen shadow-lg flex flex-col justify-start mt-5">
                    <ul className="space-y-4">
                        <li>
                            <a href="/" className="text-black text-lg font-heading font-semibold hover:text-secondary-blue transition ease-in-out duration-300">
                                About Evagram
                            </a>
                        </li>
                        <li>
                            <a href="/plot" className="text-black text-lg font-heading font-semibold hover:text-secondary-blue transition ease-in-out duration-300">
                                Experiment View
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="text-black text-lg font-heading font-semibold hover:text-secondary-blue transition ease-in-out duration-300">
                                Experiment Search
                            </a>
                        </li>
                        
                    </ul>
                </nav>

                <div id="user-guide-container"className="flex-grow p-5 mb-9">
                    <div id="about-evagram" className="flex flex-col mb-7">
                        <div id="header" className="p-5 text-left">
                            <h2 className="text-black text-2xl font-heading font-bold text-left">What is Evagram?</h2>

                        </div>
                        <div id="summary" className='bg-white rounded-lg p-5 mx-5 ml-5 my-5 text-left flex flex-col gap-3 shadow-lg max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-[1028px]'>
                            <p className="text-black text-wrap font-body font-medium">Evagram is a web interface that allows a convenient way to view experiment diagnostics produced by Eva. Eva is a 
                                collaborative project to provide diagnostics that can be used to assess the performance of a JEDI-based data assimilation system.</p>
                            <p className="text-black text-wrap font-body font-medium">Evagram provides a way to interact with Eva’s new html-based dynamic plots. The features include searching for
                                 an experiment within the Eva database, and viewing up to 2 experiments with their dynamic plots.</p>


                        </div>
                        
                    </div>
                    <div id="experiment-view" className="flex flex-col max-w-screen mb-9">
                        <div id="header" className="p-5 text-left">
                            <h2 className="text-black text-2xl font-heading font-bold text-left">Experiment View</h2>
                        </div>
                        <div id="experiment-view-container" className="flex flex-row justify-between p-5">
                            <div id="image-container" className="flex w-fit flex-grow ">
                                <img src={ExperimentView} width={569} alt="Experiment View" className="shadow-lg" /> {/* Using img tag for PNG */}

                            </div>
                            <div id="experiment-search-text" className="bg-white rounded-lg p-5 mx-5 ml-5 my-5 text-left flex flex-col gap-3 shadow-lg max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-[1028px]">
                            <p className="text-black text-wrap font-body font-medium">The experiment view is where you can view the dynamic html-based plots of what experiment you are looking for.</p>
                            <p className="text-black text-wrap font-body font-medium">There are a list of attributes that you can select to view a specific plot. Required attributes are user, experiment, cycle time, and reader. 
                            </p>
                        
                            </div>
                    </div>
                   
                        
                    </div>



                    <div id="experiment-search" className="flex flex-col max-w-screen mb-9">
                        <div id="header" className="p-5 text-left">
                                <h2 className="text-black text-2xl font-heading font-bold text-left">Experiment Search</h2>
                            </div>
                        <div id="experiment-search-container" className="flex flex-row justify-between p-5">
                            <div id="image-container" className="flex w-fit flex-grow ">
                                    <img src={ExperimentSearch} width={569} height={600} alt="Experiment Search" className="shadow-lg" /> {/* Using img tag for PNG */}

                                </div>


                                <div id="experiment-search-text" className="bg-white rounded-lg p-5 mx-5 ml-5 my-5 text-left flex flex-col gap-3 shadow-lg max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-[1028px]">
                                    <p className="text-black text-wrap font-body font-medium">The experiment search is a database of all experiments that are currently being added to Eva.</p>
                                    <p className="text-black text-wrap font-body font-medium">You may search for a specific experiment, data
                                        source, or user in the global search bar in the 
                                        top left corner of the screen. 
                                    </p>
                                    <p className="text-black text-wrap font-body font-medium">You may select up to two experiments to view. 
                                            If you select more than 2, a warning will pop up 
                                            and you will have to deselect one of the selected
                                            experiments. Once you have selected 1-2 
                                            experiments, click “View Diagnostic” to view. 
                                    </p>
                                    <p className="text-black text-wrap font-body font-medium">Selecting one experiment will bring you to 
                                        experiment view. Selecting two experiments
                                        will bring you to the compare experiments view
                                    </p>

                            </div>

                        </div>

                       
                    
                    </div>

                    
                    
                </div>
            </div>


        </div>
        
        
     );
}

export default About;