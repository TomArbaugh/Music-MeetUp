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


    const today = new Date().toISOString().split('T')[0].split('-')



    const pastEvents = []
    const futureEvents = []

    eventsList.map((events) => {
        console.log('today',today)
        console.log('event', events.startDate.split('T')[0].split('-'))
       const eventDate =  events.startDate.split('T')[0].split('-')

        eventDate[0] < today[0] ? pastEvents.push(events) :
        eventDate[0] > today[0] ? futureEvents.push(events) :
        eventDate[1] < today[1] ? pastEvents.push(events) :
        eventDate[1] > today[1] ? futureEvents.push(events) :
        eventDate[2] < today[2] ? pastEvents.push(events) :
        futureEvents.push(events)
       
        

       
    })

    return (
        <div id="group-details-card">
            <Link to='/group-list' id="group-details-breadcrum">Back to Groups</Link>
            <div id="group-details-top">
                <div id="group-details-left">
                    <img id="group-details-img" src={group.GroupImages.length ? group.GroupImages[0].url : "no image"} />
                </div>
                <div id="group-details-right">

                    <div id="group-finer-details">
                        <h1 id="group-details-name">{group.name}</h1>
                        <h3 id="group-details-grey">{group.city}, {group.state}</h3>
                        <div id="group-details-event-private">
                            <h4 id="group-details-grey">{eventsList.length} events</h4>
                            <LuDot id="group-details-dot" />
                            <h4 id="group-details-grey">Private: {group.private.toString()}</h4>
                        </div>
                        <h4 id="group-details-grey">Orginaized By: {group.Organizer.firstName} {group.Organizer.lastName}</h4>

                    </div>

                    <button
                        id={isLoaded && sessionUser && sessionUser.id !== group.Organizer.id ? "group-details-red-button"
                            : !sessionUser ? "group-details-no-button"
                                : isLoaded && sessionUser && sessionUser.id == group.Organizer.id ? "group-details-no-button"
                                    : null}
                        onClick={((e) => isLoaded && sessionUser && sessionUser.id !== group.Organizer.id ? alert('Feature coming soon.') : e.preventDefault())}
                    >Join This Group</button>
                    <div>
                        <button
                            id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "group-details-dark-grey" : "group-details-no-button"}
                            onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? null : e.preventDefault())}
                        ><Link to="/create-event" id="group-details-link-buttons">Create Event</Link></button>

                        <button
                            id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "group-details-dark-grey" : "group-details-no-button"}
                            onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? null : e.preventDefault())}
                        ><Link to="/update-group" id="group-details-link-buttons">Update</Link></button>


                        <button
                            ref={ulRef}
                            onClick={((e) => isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? null : e.preventDefault())}
                            id={isLoaded && sessionUser && sessionUser.id === group.Organizer.id ? "group-details-dark-grey" : "group-details-no-button"}
                        ><OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteGroup />}
                            /></button>
                    </div>




                </div>
            </div>
            <div id="group-details-bottom">
                <h2 id="event-details-h2">Organizer</h2>
                <h4 id="make-grey">{group.Organizer.firstName} {group.Organizer.lastName}</h4>
                <h2 id="event-details-h2">What we are about</h2>
                <h4>{group.about}</h4>

                <h2 id={futureEvents.length ? "show" : "hide"}>Upcoming Events ({futureEvents.length})</h2>
                {futureEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`} className="no-more-underline">
                        <div>

                            {
                                <>
                                    <div id="event-details-card">

                                        <div id="event-details-card-top">
                                            <img id="group-details-event-card-image" src={event.previewImage} />
                                            <div id="event-card-top-right">
                                                <div id="event-details-date">
                                                    <h4 id="group-details-event-card">{event.startDate.split('T')[0]}</h4>
                                                    <LuDot />
                                                    <h4 id="group-details-event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                                                </div>


                                                <h2 id="group-details-event-card">{event.name} </h2>


                                                <h4 id="group-details-event-card">{event.Venue.city}, {event.Venue.state}</h4>

                                            </div>

                                        </div>
                                        <h4 id="group-details-event-card-bottom">{event.description}</h4>
                                    </div>


                                </>

                        


                            }

                        </div>
                    </Link>
                ))}
                <h2 id={pastEvents.length ? "show" : "hide"}>Past Events {pastEvents.length}</h2>
                {pastEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`} className="no-more-underline">
                        <div>

                            {
                                <>
                                    
                                    <div id="event-details-card">

                                        <div id="event-details-card-top">
                                            <img id="group-details-event-card-image" src={event.previewImage} />
                                            <div id="event-card-top-right">
                                                <div id="event-details-date">
                                                    <h4 id="group-details-event-card">{event.startDate.split('T')[0]}</h4>
                                                    <LuDot />
                                                    <h4 id="group-details-event-card">{event.startDate.split('T')[1].split('.')[0]}</h4>
                                                </div>


                                                <h2 id="group-details-event-card">{event.name} </h2>


                                                <h4 id="group-details-event-card">{event.Venue.city}, {event.Venue.state}</h4>

                                            </div>

                                        </div>
                                        <h4 id="group-details-event-card-bottom">{event.description}</h4>
                                    </div>


                                </>

                                


                            }

                        </div>
                    </Link>
                ))}

            </div>

        </div>
    )


}