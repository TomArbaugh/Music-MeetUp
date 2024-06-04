import { useParams } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export function GroupDetails() {

    const { groupId } = useParams()

    const group = useSelector((state) => state.groups.Groups[groupId])

    if (!group) return;

    return (
        <div>
            <Link to='/group-list'>Back to Groups</Link>
            <h4>{group.previewImg}</h4>
            <h4>{group.name}</h4>
            <h4>{group.city}, {group.state}</h4>
            <h4>{group.private.toString()}</h4>
            <h1>ORGANIZER HERE</h1>
            <button>Join This Group</button>
            <h2>What we are about</h2>
            <h4>{group.about}</h4>
            <h1>EVENTS</h1>
        </div>
    )


}