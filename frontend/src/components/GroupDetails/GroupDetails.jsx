import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { useRef } from "react"
import { getAllEvents } from "../../store/events"
import { getAllGroupsId } from "../../store/groups"
import { LuDot } from "react-icons/lu";
import { useState } from "react"
import * as sessionActions from '../../store/session'
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import { DeleteGroup } from "../DeleteGroup/DeleteGroup"

import './GroupDetails.css'

export function GroupDetails() {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false);
   

   const ulRef = useRef()

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
                    <img src={group.GroupImages.length ? group.GroupImages[0].url : "no image"} />
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
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? null : e.preventDefault())}
                    ><Link to="/create-event">Create Event</Link></button>

                    <button
                    id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "dark-grey" : "no-button"}
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? alert('Feature coming soon.'): e.preventDefault())}
                    >Update</button>


                    <button
                    ref={ulRef}
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? null: e.preventDefault())}
                    id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "dark-grey" : "no-button"}
                    ><OpenModalMenuItem
                    itemText="Delete"
                    // onItemClick={closeMenu}
                    modalComponent={<DeleteGroup />}
            /></button>

                        
                    
                </div>
            </div>
            <div id="bottom">
                <h2>What we are about</h2>
                <h4>{group.about}</h4>
                
                <h2>Events ({eventsList.length})</h2>
                {sortedEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                    <div>
                        
                        {event.startDate > today ? 
                        <>
                                     <h2>Upcoming Events</h2>
                        <img id="event-card" src={event.previewImage} />
                        <h4 id="event-card">{event.description}</h4>
                        <h4 id="event-card">{event.name} </h4>
                        <h4 id="event-card">{event.startDate.split('T')[0]}</h4>
                        <LuDot />
                        <h4 id="event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                        
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
                       
                        <h4 id="event-card">{event.Venue.city}, {event.Venue.state}</h4>
                        </>
                        }

                    </div>
                    </Link>
                ))}
                
            </div>

        </div>
    )


}