import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { updateTheGroup } from "../../store/groups"
import { useNavigate } from "react-router-dom";
import './UpdatedGroup.css'

export function UpdateGroup() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const group = useSelector((state) => state.groups.GroupById)

    
    const [name, setName] = useState()
    const [about, setAbout] = useState()
    const [type, setType] = useState()
    const [city, setCity] = useState()
    const [isPrivate, setIsPrivate] = useState()
    const [state, setState] = useState()
    const [errorState, setErrorState] = useState({})

    

        useEffect(() => {

            setName(group.name)
            setAbout(group.about)
            setType(group.type)
            setCity(group.city)
            setIsPrivate(group.private)
            setState(group.state)

        }, [group])

        
    
    

    

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            name,
            about,
            type,
            isPrivate,
            city,
            state
        }

        let updatedGroup; 


        try {
            updatedGroup = await dispatch(updateTheGroup(group.id, payload))
            
        } catch (error) {

            const errors = await error.json()
            
            setErrorState(errors.errors)
        }



        if (updatedGroup) {
            navigate(`/group/${group.id}`)
        }
        return;
    }

    if(!group) return null;

    return (
        <form 
        id="update-group-form"
        onSubmit={handleSubmit}>
        <h1 id="update-title">Update Your Group</h1>
        <div>
            <h2>Set your group&apos;s location</h2>
            <h3 className="long-text-update">Meetup groups meet locally, in person, and online. We&#39;ll connect you with people in your area.</h3>
            <input 
className="update-inputs"
            value={city}
            type="text" 
            placeholder="City"
            onChange={((e) => setCity(e.target.value))}
            >
            </input>
            {errorState.city && <p className="update-red-errors">{errorState.city}</p>}
            <input
className="update-inputs"
            value={state}
            type="text"
            placeholder='STATE'
            onChange={((e) => setState(e.target.value))}
            >
            </input>
            {errorState.state && <p className="update-red-errors">{errorState.state}</p>}
        </div>
        <div>
            <h2>What will your group&#39;s name be?</h2>
            <h3 className="long-text-update">Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
            <input 
className="update-inputs"
            value={name}
            type="text" 
            placeholder="What is your group name?"
            onChange={((e) => setName(e.target.value))}
            ></input>
            {errorState.name && <p className="update-red-errors">{errorState.name}</p>}
        </div>
        <div>
            <h2>Describe the purpose of your group.</h2>
            <h3 className="long-text-update">People will see this when we promote your group, but you&#39;ll be able to add to it later, too. 1. What&#39;s the purpose of the group? 2. Who should join? 3. What will you do at your events?</h3>
            <input 
className="update-inputs"
            value={about}
            type="text" 
            placeholder="Please write at least 30 characters"
            onChange={((e) => setAbout(e.target.value))}
            ></input>
            {errorState.about && <p className="update-red-errors">{errorState.about}</p>}
        </div>
        <div>
            <h3>Is this an in-person or online group?</h3>
            <select
className="update-select-inputs"
            value={type}
            onChange={((e) => setType(e.target.value))}
            >
                <option>Online</option>
                <option>In person</option>
            </select>
            {errorState.type && <p className="update-red-errors">{errorState.type}</p>}
            <h3>Is this group private or public?</h3>
            <select
            className="update-select-inputs"
            value={isPrivate}
            onChange={((e) => setIsPrivate(e.target.value))}
            >
                <option value={true}>Private</option>
                <option value={false}>Public</option>
            </select>
            {errorState.private && <p className="update-red-errors">{errorState.private}</p>}
            <h3>Please add an image URL for your group below</h3>
            <input className="update-inputs" type="text" placeholder="Image Url"></input>
            <button 
            id="update-button"
            type="submit">Update Group</button>
        </div>
        </form>
        
    )
    
}