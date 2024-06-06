
import { useModal } from "../../context/Modal";
import './DeleteGroup.css'

export function DeleteGroup() {

    const { closeModal } = useModal();
                
                
    function onSubmit(e){
        e.preventDefault()
         closeModal()
    }  

    return (
        
            <form onSubmit={onSubmit}>
                <h1>Confirm Delete</h1>
                <h2>Are you sure you want to remove this group?</h2>
                <button type="submit" id="delete-button">Yes (Delete Group)</button>
                <button type="submit">No (Keep Group)</button>
            </form>
         
    )
}