import { ReactComponent as NasaLogo } from "./assets/nasa-logo.svg";
import GoddardLogo from "./assets/goddard-logo.png";


function Footer() {
    return ( 
<footer className="bg-footer text-white space-x-4">
  {/* <div className="w-full flex flex-row items-center"> */}
    
    {/* Footer Logo / Brand */}
    <div className="mb-4 md:mb-0 flex flex-row items-center space-x-4">
        <div id="nasa-logo" className="p-4">
            <a href="https://www.nasa.gov/" class="flex items-center space-x-3">
                <NasaLogo/>
            </a>
                        
        </div>

        <div id="goddard-logo" className="w-fit p-4">
                <a href="" className="flex items-center space-x-3">
                    <img src={GoddardLogo} width={600} alt="Goddard Logo" /> {/* Using img tag for PNG */}
                </a>           
                        
        </div>

        <div id="footer-text" className="pl-5">
            <ul className="list-disc">
                <li>
                Privacy Policy & Important Notices
                </li>
            </ul>

        </div>
    </div>
    
    {/* </div> */}
</footer>
 );
}

export default Footer;