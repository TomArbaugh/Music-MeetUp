import { GrGroup } from "react-icons/gr";
import { PiHandshakeDuotone } from "react-icons/pi";
import { MdContentPasteSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import './LandingPage.css'

export function LandingPage() {

    return (
        <div id="test">
            <div id="layout-section-one">
                <div id="layout-title">
                    <h1>Meet the Music - at Music MeetUp</h1>
                    <h3>Welcome to the music. Some join to play music, some join to hear music... here, we are music. You do not need to be a musician to join a band. You do not need to be in a band to be a musician. All you need is for the music to be in YOU. We are Music MeetUp. Nice to meet you!</h3>
                </div>

                <img id="layout-img" src={"../../dist/infographic.jpeg"} />
            </div>
            <div id="layout-section-two">
                
                    <h2>How Music MeetUp works</h2>
                    <h4>Meet musicians in your area or enjoy their performance from the audience when you brows our groups and events!</h4>


            </div>
            <div id="layout-section-three">
                <div id="see-all-groups">
                    <GrGroup />
                    <Link>See All Groups</Link>
                    <h3>Heres a caption for you</h3>
                </div>
                <div id="find-an-event">

                    <MdContentPasteSearch />
                    <Link>Find an Event</Link>
                    <h3>Heres a caption for you</h3>
                </div>
                <div id="start-a-group">
                    <PiHandshakeDuotone />
                    <Link>Start a Group</Link>
                    <h3>Heres a caption for you</h3>
                </div>
            </div>
            <div id="layout-section-four">
                <button >Join Music MeetUp!</button>
            </div>
        </div>
    )
}