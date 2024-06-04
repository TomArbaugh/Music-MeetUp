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


    if (!groups) return;
    if (!event) return;
    return (
        <>
            <div id="outer-div">
                <div id="header">
                    <Link id="groups-header"><h1>Groups</h1></Link>
                    <Link id="events-header" to="/events-list"><h1>Events</h1></Link>
                </div>
                <div id="body">
                    <h2 id="subtitle">Groups In Meetup</h2>
                    {groups.map((group) => (
                        <Link key={group.id} to={`/group/${group.id}`} id="card-link">
                        <div id="card">
                            <div id="left">
                            <h4>{group.previewImg}</h4>
                            </div>
                            
                            <div id="right">
                                <div id="top">
                                    <h3>{group.name}</h3>
                                    <h4>{group.city}, {group.state}</h4>
                                    <h4>{group.about}</h4>
                                </div>

                                <div id="bottom">
                                    <h5>{event.filter((events) => events.groupId === group.id).length} events</h5>
                                    <LuDot id="dot"/>
                                        
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