import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { deleteTheGroup } from "../../store/groups";
import { useNavigate } from "react-router-dom";
import './DeleteGroup.css'

export function DeleteGroup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {groupId} = useParams()
    const { closeModal } = useModal();
                
                
    function onSubmit(e){
        e.preventDefault()
         closeModal()
    }  

    async function handleSubmit() {

 
           const deleted = await dispatch(deleteTheGroup(groupId))


        if (deleted) navigate('/group-list')
        
    }

    return (
        
            <form onSubmit={onSubmit}>
                <h1>Confirm Delete</h1>
                <h2>Are you sure you want to remove this group?</h2>

                <button 
                onClick={handleSubmit}
                type="submit" id="delete-button"
                >Yes (Delete Group)</button>

                <button type="submit">No (Keep Group)</button>
            </form>
         
    )
}