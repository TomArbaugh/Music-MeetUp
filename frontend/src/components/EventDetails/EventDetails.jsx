import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as sessionActions from '../../store/session'
import { getAllEventsId } from "../../store/events";
import { getAllGroupsId, getAllMemberships } from "../../store/groups";
import { TfiAlarmClock } from "react-icons/tfi";
import { MdAttachMoney } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { DeleteEvent } from "../DeleteEvent/DeleteEvent";
import './EventDetails.css'

export function EventDetails() {

    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false);

    const { eventId } = useParams()

    useEffect(() => {
        dispatch(getAllEventsId(eventId))
    }, [dispatch, eventId])

    const event = useSelector((state) => state.events.EventById)

    const groups = useSelector((state) => state.groups)

    const members = groups.Memberships

    const group = groups.GroupById 

    useEffect(() => {
        event && Object.values(event).length ? dispatch(getAllGroupsId(event.groupId)) : null
    }, [group, event, dispatch])



    const sessionUser = useSelector(state => state.session.user)
    
    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => {
            setIsLoaded(true)
        });
    }, [dispatch]);




    useEffect(() => {

            event && Object.values(event).length ? dispatch(getAllMemberships(event.groupId)) : null
    

    }, [event, dispatch])
    
    
   



    if (!members) return

    const host = members.Members.find((host) => host.Membership.status === 'host')


    if (!event) return null;
    if (!group) return null;
 
    return (
        <>
            <div id="event-details-top">
                <Link to="/events-list" id="event-detail-bread">Events</Link>

                <h1 id="event-detail-title ">{event.name}</h1>
                <h4 id="event-host">Hosted By:  {host.firstName} {host.lastName}</h4>
            </div>

            <div id="event-details-second">
                <img id="event-details-img" src={event.EventImages[0].url} />

                <div id="event-details-right">
                    <div id="event-details-top-right">
                        <img src={group.GroupImages[0] ? group.GroupImages[0].url : 'no image'} id="event-detail-group-image" />
                        <h3>{event.Group.name}</h3>
                    </div>

                    <div id="event-details-bottom-right">
                        <div id="event-clock">
                            <TfiAlarmClock id="clock-logo" />
                            <div>
                                <h4 className="event-time">Start: {event.startDate.split('T')[0]} <LuDot />{event.startDate.split('T')[1].split('Z')}</h4>
                                <h4 className="event-time">End: {event.endDate.split('T')[0]} <LuDot />{event.endDate.split('T')[1].split('Z')}</h4>
                            </div>
                        </div>
                        <div id="event-money">
                            <MdAttachMoney id="event-dollar-sign" />
                            <h4>{event.price !== 0 ? event.price : "FREE"}</h4>
                        </div>

                        <div id="event-location">
                            <FiMapPin id="event-location-pin" />
                            <h4>{event.type}</h4>
                        </div>


                    </div>

                </div>

            </div>


            <div id="event-details-section3">
                <h2>Description</h2>
                <h4>{event.description}</h4>
            </div>

            <div id="event-details-buttons">
                <button
                className="event-details-update-button"
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === host.id ? null : e.preventDefault())}
                    id={isLoaded && sessionUser && sessionUser.id === host.id ? "show-button" : "hide-button"}
                >Update</button>

                <button
                className="event-details-delete-button"
                    onClick={((e) => isLoaded && sessionUser && sessionUser.id === host.id ? null : e.preventDefault())}
                    id={isLoaded && sessionUser && sessionUser.id === host.id ? "show-button" : "hide-button"}
                ><OpenModalMenuItem
                
                        itemText="Delete"
                        modalComponent={<DeleteEvent />}
                    />
                </button>
            </div>



        </>
    )
}