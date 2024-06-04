import { Link } from "react-router-dom"
import './EventsList.css'


export function EventsList(){
    return(
        <>
         <div id="header">
                    <Link id="group-header" to="/group-list"><h1>Groups</h1></Link>
                    <Link id="event-header"><h1>Events</h1></Link>
                </div>
        </>
    )
}