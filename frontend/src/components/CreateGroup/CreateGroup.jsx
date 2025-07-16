import { useDispatch} from 'react-redux';
import { useState } from "react"
import { createAGroup } from '../../store/groups';
import { useNavigate } from 'react-router-dom';
import './CreateGroup.css'


export function CreateGroup(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState()
    const [about, setAbout] = useState()
    const [type, setType] = useState('Online')
    const [city, setCity] = useState()
    const [isPrivate, setIsPrivate] = useState(true)
    const [state, setState] = useState()
    const [errorState, setErrorState] = useState({})
    const [url, setUrl] = useState(' ')
    


    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            name,
            about,
            type,
            isPrivate,
            city,
            state,
            
        }

        const payloadTwo = {
            url,
            preview: false
        }


      
        
        let group;
        try {
            group = await dispatch(createAGroup(payload, payloadTwo))
           
        } catch (e){
           
            const theErrors = await e.json()
            
            setErrorState(theErrors.errors)
            
        }

        if (url === ' ') {
            setUrl()
            return null;
        }
        
        if (group) {
            navigate(`/group/${group.id}`)
        } 
        
           

    }


  
    return (
        <form 
        id="start-group-form"
        onSubmit={handleSubmit}>
        <h1 id="start-new-group-title">Start a New Group</h1>
        <div>
            <h2>Set your group&apos;s location</h2>
            <h3 className='long-text-bodies'>Meetup groups meet locally, in person, and online. We&#39;ll connect you with people in your area.</h3>
            
            <input 
className='start-group-inputs'
            value={city}
            type="text" 
            placeholder="City"
            onChange={((e) => setCity(e.target.value))}
            >
            </input>
            {errorState.city && <p className="red-errors">{errorState.city}</p>}
            <input
className='start-group-inputs'
            value={state}
            type="text"
            placeholder='STATE'
            onChange={((e) => setState(e.target.value))}
            >
            </input>
            {errorState.state && <p className="red-errors">{errorState.state}</p>}
        </div>
        <div>
            <h2>What will your group&#39;s name be?</h2>
            <h3 className='long-text-bodies'>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
            <input 
className='start-group-inputs'
            value={name}
            type="text" 
            placeholder="What is your group name?"
            onChange={((e) => setName(e.target.value))}
            ></input>
            {errorState.name && <p className="red-errors">{errorState.name}</p>}
        </div>
        <div>
            <h2>Describe the purpose of your group.</h2>
            <h3 className='long-text-bodies'>People will see this when we promote your group, but you&#39;ll be able to add to it later, too. 1. What&#39;s the purpose of the group? 2. Who should join? 3. What will you do at your events?</h3>
            <input 
className='start-group-inputs'
            value={about}
            type="text" 
            placeholder="Please write at least 30 characters"
            onChange={((e) => setAbout(e.target.value))}
            ></input>
            {errorState.about && <p className="red-errors">{errorState.about}</p>}
        </div>
        <div>
            <h3>Is this an in-person or online group?</h3>
            <select
            className='start-group-select-inputs'
            value={type}
            onChange={((e) => setType(e.target.value))}
            >
                <option>Online</option>
                <option>In person</option>
            </select>
            {errorState.type && <p className="red-errors">{errorState.type}</p>}
            <h3>Is this group private or public?</h3>
            <select
            className='start-group-select-inputs'
            value={isPrivate}
            onChange={((e) => setIsPrivate(e.target.value))}
            >
                <option value={true}>Private</option>
                <option value={false}>Public</option>
            </select>
            {errorState.private && <p className="red-errors">{errorState.private}</p>}
            <h3>Please add an image URL for your group below</h3>
            <input 
            className='start-group-inputs'
            type="text" 
            placeholder="Image Url"
            value={url}
            onChange={((e) => setUrl(e.target.value))}
            ></input>
             {!url && <p className="red-errors">URL required</p>}
            <button 
            className='create-group-button'
            type="submit">Create Group</button>
        </div>
        </form>
        
    )
}