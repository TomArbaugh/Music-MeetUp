
import { csrfFetch } from './csrf.js';

const GET_GROUPS = '/get-groups'

const GET_GROUP_ID = '/get-groups-by-id'


const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
});

const getGroupsId = (groupId, group) => ({
    type: GET_GROUP_ID,
    group
})

export const getAllGroups = () => async dispatch => {
    const response = await csrfFetch("/api/groups");
    const data = await response.json();
    dispatch(getGroups(data.Groups));
    return response;
  };

  export const getAllGroupsId = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`);
    const data = await response.json();
    dispatch(getGroupsId(groupId, data));
    return response;
  };

const initialState = {}

function groupsReducer(state=initialState, action) {
    switch(action.type) {
        case GET_GROUPS:
            return {...state, Groups: action.groups}
        case GET_GROUP_ID:
            return {...state, GroupById: action.group}
        default:
            return state;
    }
    
    
}

export default groupsReducer;