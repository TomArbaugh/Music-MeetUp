import { Link } from "react-router-dom"
import './EventsList.css'
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getAllEvents } from "../../store/events"
import { LuDot } from "react-icons/lu";


export function EventsList() {

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

    return (
        <>
            <div id="events-header">
                <Link id="events-group-header" to="/group-list"><h1>Groups</h1></Link>
                <Link id="events-event-header"><h1>Events</h1></Link>
            </div>
            <h2 id="events-title">Events in Meetup</h2>
            {sortedEvents.map((event) => (
                <Link key={event.id} id="events-link" to={`/events/${event.id}`}>
                    <div id="events-border">

                        {event.startDate > today ?
                            <>
                                <div className="event-card-top">
                                    <img className="event-card-image" src={event.previewImage} />

                                    <div className="event-card-top-right">
                                        <div className="event-card-time">
                                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                                        <LuDot />
                                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                                        </div>
                                       
                                        <h2 id="event-card-name">{event.name} </h2>
                                        <h4 className="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                                    </div>

                                </div>


                                <h4 id="event-card">{event.description}</h4>
                            </>

                            :

                            <>
                                <div className="event-card-top">
                                    <img className="event-card-image" src={event.previewImage} />
                                    <div className="event-card-top-right">
                                       <div className="event-card-time">
                                       <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                                        <LuDot />
                                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                                       </div>
                                     
                                        <h2 className="event-card-name">{event.name} </h2>
                                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                                    </div>


                                </div>


                                <h4 id="event-card">{event.description}</h4>
                            </>
                        }

                    </div>
                </Link>
            ))}
        </>
    )
}