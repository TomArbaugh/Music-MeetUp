import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { deleteTheGroup } from "../../store/groups";
import { useNavigate } from "react-router-dom";
import './DeleteGroup.css'

export function DeleteGroup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { groupId } = useParams()
    const { closeModal } = useModal();


    function onSubmit(e) {
        e.preventDefault()
        closeModal()
    }

    async function handleSubmit() {


        const deleted = await dispatch(deleteTheGroup(groupId))


        if (deleted) navigate('/group-list')

    }

    return (

        <form
            id="delete-group-form"
            onSubmit={onSubmit}>
            <h1 className="group-delete-margin">Confirm Delete</h1>
            <h2 className="group-delete-margin">Are you sure you want to remove this group?</h2>

            <button
                className="group-delete-margin"
                onClick={handleSubmit}
                type="submit" id="delete-button"
            >Yes (Delete Group)</button>

            <button
                type="submit"
                className="group-delete-margin"
            >No (Keep Group)</button>
        </form>

    )
}