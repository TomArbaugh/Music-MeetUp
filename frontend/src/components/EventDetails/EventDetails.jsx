import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
// import { useState } from "react";
import { useSelector } from "react-redux";
// import * as sessionActions from '../../store/session'
import { getAllEventsId } from "../../store/events";
// import { getAllAttendees } from "../../store/events";
// import { getAllGroups, getAllGroupsId } from "../../store/groups";
import { TfiAlarmClock } from "react-icons/tfi";
import { MdAttachMoney } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import './EventDetails.css'

export function EventDetails(){

    const dispatch = useDispatch()
    // const [isLoaded, setIsLoaded] = useState(false);

    // const sessionUser = useSelector(state => state.session.user)

    // useEffect(() => {
    //   dispatch(sessionActions.restoreUser()).then(() => {
    //     setIsLoaded(true)
    //   });
    // }, [dispatch]);


    const { eventId } = useParams()

    useEffect(() => {
        dispatch(getAllEventsId(eventId))
    }, [dispatch, eventId])

 
    const event = useSelector((state) => state.events.EventById)

   
    
    // useEffect(() =>{
    //     dispatch(getAllGroupsId(event.groupId))
    // },[dispatch, event.groupId])

    // const group = useSelector((state) => state.groups.GroupById)

    // if (!group) return
    if (!event) return;
  
    return (
        <>
    <Link to="/events-list">Events</Link>
        <h1>Event Details</h1>
        <h4>{event.name}</h4>
        <h4>Hosted By:  </h4>
        <h4>{event.EventImages[0].url}</h4>
        <div>
            </div>
            <TfiAlarmClock />
            <h4>Start: {event.startDate.split('T')[0] } <LuDot />{event.startDate.split('T')[1].split('Z')}</h4>
            <h4>End: {event.endDate.split('T')[0] } <LuDot />{event.endDate.split('T')[1].split('Z')}</h4>
            <MdAttachMoney />
            <h4>{event.price !== 0 ? event.price : "FREE"}</h4>
            <FiMapPin />
            <h4>{event.type}</h4>
            <h2>Description</h2>
            <h4>{event.description}</h4>
            <div>

            </div>

            {/* <button 
            onClick={((e) => isLoaded && sessionUser && sessionUser.id === event.Organizer.id ? null : e.preventDefault())}
            id={isLoaded && sessionUser && sessionUser.id === event.Organizer.id ? "show-button" : "hide-button"}
            >Update</button>

            <button 
            onClick={((e) => isLoaded && sessionUser && sessionUser.id === event.Organizer.id ? null : e.preventDefault())}
            id={isLoaded && sessionUser && sessionUser.id === event.Organizer.id ? "show-button" : "hide-button"}
            >Delete</button> */}
        </>
    )
}