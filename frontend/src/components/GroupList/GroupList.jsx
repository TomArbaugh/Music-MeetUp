import './GroupList.css'
import { Link } from 'react-router-dom'
import { getAllGroups } from '../../store/groups'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllEvents } from '../../store/events'
import { LuDot } from "react-icons/lu";


export function GroupList() {

    const dispatch = useDispatch()
    

    useEffect(() => {
        async function getGroups() {
            await dispatch(getAllGroups())
        }
        getGroups()
    }, [dispatch])

    const groups = useSelector((state) => state.groups.Groups)

 
    useEffect(() => {
        
        async function getEvents() {
            await dispatch(getAllEvents())
        }
        getEvents()
    }, [dispatch])


    const event = useSelector((state) => state.events.Events)


    if (!groups) return null;
    if (!event) return null;
    return (
        <>
            <div id="group-outer-div">
                <div id="group-header">
                    <Link id="group-groups-header"><h1>Groups</h1></Link>
                    <Link id="group-events-header" to="/events-list"><h1>Events</h1></Link>
                </div>
                <div id="group-body">
                    <h2 id="group-subtitle">Groups In Meetup</h2>

                    {groups.map((group) => (
                        <Link key={group.id} to={`/group/${group.id}`} id="group-card-link">
                        <div id="group-card">
                            <div id="group-left">
                            <img src={group.previewImg} id="group-image" />
                            </div>
                            
                            <div id="group-right">
                                <div id="group-top">
                                    <h1 id="group-name">{group.name}</h1>
                                    <h4>{group.city}, {group.state}</h4>
                                    <h4>{group.about}</h4>
                                </div>

                                <div id="group-bottom">
                                    <h5>{event.filter((events) => events.groupId === group.id).length} events</h5>
                                    <LuDot id="group-dot"/>
                                        
                                        <h5>Private: {group.private.toString()}</h5>
                                        
                                    
                                    
                                </div>
                            </div>
                        </div>
                        </Link>
                    ))}

                </div>

            </div>

        </>

    )
}