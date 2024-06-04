
import { csrfFetch } from './csrf.js';

const GET_GROUPS = '/get-groups'

const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
})

export const getAllGroups = () => async dispatch => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(getGroups(data.Groups));
    return response;
  };

const initialState = {}

function groupsReducer(state=initialState, action) {
    switch(action.type) {
        case GET_GROUPS:
            return {...state, Groups: action.groups}
        default:
            return state;
    }
    
    
}

export default groupsReducer;