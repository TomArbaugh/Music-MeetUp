import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deleteTheEvent } from "../../store/events";
import { useEffect } from "react";
import { getAllEvents } from "../../store/events";


export function DeleteEvent() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {eventId} = useParams()
    const { closeModal } = useModal();

    const groupId = useSelector((state) => state.groups.GroupById.id)

    useEffect(() => {

        dispatch(getAllEvents())

    }, [dispatch])

    function onSubmit(e){
        e.preventDefault()
         closeModal()
    }  

    async function handleSubmit() {

 
        const deleted = await dispatch(deleteTheEvent(eventId))


     if (deleted) navigate(`/group/${groupId}`)
     
 }

 if(!groupId) return null;

    return (
             <form onSubmit={onSubmit}>
                <h1>Confirm Delete</h1>
                <h2>Are you sure you want to remove this event?</h2>

                <button 
                onClick={handleSubmit}
                type="submit" id="delete-button"
                >Yes (Delete Event)</button>

                <button type="submit">No (Keep Event)</button>
            </form>
    )
}