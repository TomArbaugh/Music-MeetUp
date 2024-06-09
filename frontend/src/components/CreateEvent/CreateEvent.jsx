
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createTheEvent } from "../../store/events";
import { addAnEventImage } from "../../store/events";
import './CreateEvent.css'

export function CreateEvent() {
const dispatch = useDispatch()
const navigate = useNavigate()

const group = useSelector((state) => state.groups.GroupById)

const [name, setName] = useState()
const [type, setType] = useState('Online')
const [price, setPrice] = useState()
const [startDate, setStartDate] = useState()
const [endDate, setEndDate] = useState()
const [description, setDescription] = useState()
const [url, setUrl] = useState()


const [errorState, setErrorState] = useState({})
const [ setImageErrorState] = useState({})

const onSubmit = async (e) => {

    e.preventDefault()

    const payload = {
        venueId: 1,
        name,
        type,
        capacity: 0,
        price,
        startDate,
        endDate,
        description
    }

    const payloadTwo = {
        groupId: group.id,
        url,
        preview: false
    }

    let event;
    
    try {
        event = await dispatch(createTheEvent(group.id, payload))
    } catch (e) {
        const errors = await e.json()

        setErrorState(errors.errors)
        
    }
    
    let eventImage;
    try {
        event ? eventImage = await dispatch(addAnEventImage(event.id, payloadTwo)) : null

    } catch (e) {
        const errors = await e.json()
     
        setImageErrorState(errors.errors)
       
    }

    if (event && eventImage) {
        navigate(`/events/${event.id}`)
    } 
    
}
    



if(!group) return null;

    return (
        <form 
        id="create-event-form"
        onSubmit={onSubmit}>
        <h1 id="create-event-title">Create a new event for {group.name}</h1>
        <h4>What is the name of your event?</h4>
        <input 
className="create-event-input"
        value={name}
        placeholder="Event Name"
        onChange={((e) => setName(e.target.value))}
        >
        </input>
        {errorState.name && <p className="red-errors-event">{errorState.name}</p>}
        <select
        id="online-or-not"
className="create-event-input"
            value={type}
            onChange={((e) => setType(e.target.value))}
            >
                <option>Online</option>
                <option>In person</option>
            </select>
            {errorState.type && <p className="red-errors-event">{errorState.type}</p>}
        <h4>What is the price of your event?</h4>
        <input 
className="create-event-input"
        type='number' 
        placeholder="0"
        value={price}
        onChange={((e) => setPrice(e.target.value))}
        ></input>
        {errorState.price && <p className="red-errors-event">{errorState.price}</p>}
        <h4>When does your event start?</h4>
        <input 
className="create-event-input"
        type="date" 
        placeholder="YYYY/MM/DD, HH/mm AM"
        value={startDate}
        onChange={((e) => setStartDate(e.target.value))}
        ></input>
        {errorState.startDate && <p className="red-errors-event">{errorState.startDate}</p>}
        <h4>When does your event end?</h4>
        <input 
className="create-event-input"
        type="date" 
        placeholder="YYYY/MM/DD, HH/mm PM"
        value={endDate}
        onChange={((e) => setEndDate(e.target.value))}
        ></input>
        {errorState.endDate && <p className="red-errors-event">{errorState.endDate}</p>}
        <h4>Please add an image URL for your group below</h4>
            <input 
className="create-event-input"
            type="text" 
            placeholder="Image Url"
            value={url}
            onChange={((e) => setUrl(e.target.value))}
            ></input>
            {!url && <p className="red-errors-event">URL Required</p>}
            <h4>Please describe your event</h4>
        <input 
        className="create-event-input"
        type="text" 
        placeholder="Please include at least 30 characters."
        value={description}
        onChange={((e) => setDescription(e.target.value))}
        ></input>
        {errorState.description && <p className="red-errors-event">{errorState.description}</p>}
        <button 
        id="create-event-button"
        type="submit">Create Event</button>
        </form>
    )
}