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
                    id={isLoaded && sessionUser && sessionUser.id !== group.Organizer.id ? "red-button" : null}
                    >Join This Group</button>
                </div>
            </div>
            <div id="bottom">
                <h2>What we are about</h2>
                <h4>{group.about}</h4>
                <h2>Upcoming Events</h2>
                {eventsList.map((event) => (
                    <>
                        <h4 key={event.id}>{event.name}</h4>
                    </>
                ))}
            </div>

        </div>
    )


}