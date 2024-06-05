import { Link } from "react-router-dom"
import './EventsList.css'
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getAllEvents } from "../../store/events"
import { LuDot } from "react-icons/lu";


export function EventsList(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    const events = useSelector((state) => state.events.Events)

    const sorter = (a, b) => {
        return a - b
    }

    if (!events) return;
    
    const sortedEvents = events.sort(sorter)

    const today = new Date().toISOString().split('T')[0]

    return(
        <>
        <div id="header">
                    <Link id="group-header" to="/group-list"><h1>Groups</h1></Link>
                    <Link id="event-header"><h1>Events</h1></Link>
        </div>
        <h1>Events in Meetup</h1>
        {sortedEvents.map((event) => (
                    <Link  key={event.id} id="link" to={`/events/${event.id}`}>
                    <div id="border">
                        
                        {event.startDate > today ? 
                        <>
                                    
                        <h4 id="event-card">{event.previewImage}</h4>
                        <h4 id="event-card">{event.description}</h4>
                        <h4 id="event-card">{event.name} </h4>
                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                        <LuDot />
                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                        
                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                        </>
           
                        :
                       
                        <>
                      
                        <h4 id="event-card">{event.previewImage}</h4>
                        <h4 id="event-card">{event.description}</h4>
                        <h4 id="event-card">{event.name} </h4>
                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                        <LuDot />
                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                        
                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                        </>
                        }

                    </div>
                    </Link>
                ))}
        </>
    ) 
}