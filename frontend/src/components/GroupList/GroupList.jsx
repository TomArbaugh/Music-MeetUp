import './GroupList.css'
import { Link } from 'react-router-dom'
import { getAllGroups } from '../../store/groups'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export function GroupList() {



    const dispatch = useDispatch()

    useEffect(() => {
        async function getGroups() {
            await dispatch(getAllGroups())
        }
        getGroups()
    }, [dispatch])

    const groups = useSelector((state) => state.groups.Groups)
console.log(groups)
    if (!groups) return;

    return (
        <>
            <div id="outer-div">

                <Link id="groups-header"><h1>Groups</h1></Link>
                <Link id="events-header"><h1>Events</h1></Link>

                <div id="body">
                    <h2 id="subtitle">Groups In Meetup</h2>
                    {groups.map((group) => (
                        <div key={group.id} id="card">
                            <h4 id="left">{group.previewImg}</h4>
                            <div id="right">
                                <div id="top">
                                    <h3>{group.name}</h3>
                                    <h4>{group.city}, {group.state}</h4>
                                    <h4>{group.about}</h4>
                                </div>

                                <div id="bottom">
                                    <h4>number of events here</h4>
                                    <h4>Private: {group.private.toString()}</h4>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </>

    )
}