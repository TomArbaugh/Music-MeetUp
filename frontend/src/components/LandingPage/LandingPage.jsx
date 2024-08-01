import { GrGroup } from "react-icons/gr";
import { PiHandshakeDuotone } from "react-icons/pi";
import { MdContentPasteSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import './LandingPage.css'
import { useSelector } from "react-redux";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import SignupFormModal from "../SignupFormModal";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";


export function LandingPage() {

    const sessionUser = useSelector(state => state.session.user);

    return (
        <div id="test">
            <div id="layout-section-one">
                <div id="layout-title">
                    <h1>Meet the Music - at Music MeetUp</h1>
                    <h3>Welcome to the music. Some join to play music, some join to hear music... here, we are music. You do not need to be a musician to join a band. You do not need to be in a band to be a musician. All you need is for the music to be in YOU. We are Music MeetUp. Nice to meet you!</h3>
                </div>

                <img id="layout-img" src={"/infographic.jpeg"} />
            </div>
            <div id="layout-section-two">
                
                    <h2>How Music MeetUp Works</h2>
                    <h4>Meet musicians in your area or enjoy their performance from the audience when you brows our groups and events!</h4>


            </div>
            <div id="layout-section-three">
                <div id="see-all-groups">
                    <GrGroup className="icons"/>
                    <Link 
                    className="landingLink"
                    to="/group-list"
                    >
                        See All Groups
                    </Link>
                    <h3>Find a group now!</h3>
                </div>
                <div id="find-an-event">

                    <MdContentPasteSearch className="icons"/>
                    <Link to="/events-list" className="landingLink">Find an Event</Link>
                    <h3>Find an event today!</h3>
                </div>
                <div id="start-a-group">
                    <PiHandshakeDuotone className="icons"/>
                    
                    <Link 
                    
                    className={!sessionUser ? "start-a-group-link" : "landingLink"}
                    
                    to={sessionUser ? "/create-group" : null}
                    >
                        Start a Group
                    </Link>

                   
         
                    <h3>Create a new group!</h3>
                </div>
            </div>
            <div id="layout-section-four">
            <Link to="https://www.linkedin.com/in/tomarbaugh/"><FaLinkedin className="about-links"/></Link>
                <button id="sign-up-button">      <OpenModalMenuItem 
              itemText="Join MeetUp"
              modalComponent={<SignupFormModal />}
            /></button>
               <Link to="https://github.com/TomArbaugh/"><FaGithub className="about-links"/></Link>
            </div>

        </div>
    )
}