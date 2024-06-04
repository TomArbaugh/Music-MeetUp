import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { getAllEvents } from "../../store/events"
import { getAllGroupsId } from "../../store/groups"
import { LuDot } from "react-icons/lu";
import { useState } from "react"
import * as sessionActions from '../../store/session'

import './GroupDetails.css'

export function GroupDetails() {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false);

    const sessionUser = useSelector(state => state.session.user)

    useEffect(() => {
      dispatch(sessionActions.restoreUser()).then(() => {
        setIsLoaded(true)
      });
    }, [dispatch]);


    const { groupId } = useParams()


    useEffect(() => {
        dispatch(getAllGroupsId(groupId))
    }, [dispatch, groupId])

    const group = useSelector((state) => state.groups.GroupById)
   

    useEffect(() => {

        dispatch(getAllEvents())

    }, [dispatch])


    const events = useSelector((state) => state.events.Events)

    if (!events) return;
    if (!group) return;

    const eventsList = events.filter((events) => events.groupId === group.id)

    const sorter = (a, b) => {
        return a - b
    }
    const sortedEvents = eventsList.sort(sorter)


    const today = new Date().toISOString().split('T')[0]
    

    
    return (
        <div id="card">
            <Link to='/group-list'>Back to Groups</Link>
            <div id="top">
                <div id="left">
                    <h4>{group.GroupImages[0].url}</h4>
                </div>
                <div id="right">
                    <h4>{group.name}</h4>
                    <h4>{group.city}, {group.state}</h4>
                    <div id="event-private">
                        <h4>{eventsList.length} events</h4>
                        <LuDot id="dot" />
                        <h4>Private: {group.private.toString()}</h4>
                    </div>
                    <h4>Orginaized By: {group.Organizer.firstName} {group.Organizer.lastName}</h4>
                    <button
                    id={isLoaded && sessionUser && sessionUser.id !== group.Organizer.id ? "red-button" 
                    : !sessionUser ? "no-button"
                    : isLoaded && sessionUser && sessionUser.id == group.Organizer.id ? "no-button"
                    : null}
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id !== group.Organizer.id ? alert('Feature coming soon.'): e.preventDefault())}
                    >Join This Group</button>

                    <button
                    id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "dark-grey" : "no-button"}
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? alert('Feature coming soon.'): e.preventDefault())}
                    >Create Event</button>

                    <button
                    id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "dark-grey" : "no-button"}
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? alert('Feature coming soon.'): e.preventDefault())}
                    >Update</button>

                    <button
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? alert('Feature coming soon.'): e.preventDefault())}
                    id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "dark-grey" : "no-button"}
                    >Delete</button>
                </div>
            </div>
            <div id="bottom">
                <h2>What we are about</h2>
                <h4>{group.about}</h4>
                <h2>Events ({eventsList.length})</h2>
                {sortedEvents.map((event) => (
                    <div key={event.id} >
                        
                        {event.startDate > today ? 
                        <>
                                     <h2>Upcoming Events</h2>
                        <h4 id="event-card">{event.previewImage}</h4>
                        <h4 id="event-card">{event.description}</h4>
                        <h4 id="event-card">{event.name} </h4>
                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                        <LuDot />
                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                        <h4 id="event-card">{event.title}</h4>
                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                        </>
           
                        :
                       
                        <>
                         <h2>Past Events</h2>
                        <h4 id="event-card">{event.previewImage}</h4>
                        <h4 id="event-card">{event.description}</h4>
                        <h4 id="event-card">{event.name} </h4>
                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                        <LuDot />
                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                        <h4 id="event-card">{event.title}</h4>
                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                        </>
                        }

                    </div>
                ))}
            </div>

        </div>
    )


}