import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deleteTheEvent } from "../../store/events";
import { useEffect } from "react";
import { getAllEvents } from "../../store/events";
import './DeleteEvent.css'

export function DeleteEvent() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {eventId} = useParams()
    const { closeModal } = useModal();

    const groupId = useSelector((state) => state.groups.GroupById)

    useEffect(() => {

        dispatch(getAllEvents())

    }, [dispatch])



    function onSubmit(e){
        e.preventDefault()
         closeModal()
    }  

    async function handleSubmit() {

 
        const deleted = await dispatch(deleteTheEvent(eventId))


     if (deleted) navigate(`/group/${groupId.id}`)
     
 }

 if(!groupId) return null;

    return (
             <form onSubmit={onSubmit}>
                <h1 className="delete-event-margin">Confirm Delete</h1>
                <h2 className="delete-event-margin">Are you sure you want to remove this event?</h2>

                <button 
                className="delete-event-margin"
                onClick={handleSubmit}
                type="submit" id="delete-button"
                >Yes (Delete Event)</button>

                <button 
                 className="delete-event-margin"
                type="submit">No (Keep Event)</button>
            </form>
    )
}