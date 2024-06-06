
import { csrfFetch } from './csrf.js';

const GET_GROUPS = '/get-groups'

const GET_GROUP_ID = '/get-groups-by-id'

const GET_MEMBERSHIPS = '/get-memberships'

const CREATE_GROUP = '/create-group'

const getMemberships = (groupId, memberships) => ({
    type: GET_MEMBERSHIPS,
    memberships
})

const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
});

const getGroupsId = (groupId, group) => ({
    type: GET_GROUP_ID,
    group
})

const createGroup = (payload) => ({
    type: CREATE_GROUP,
    payload
})

export const getAllMemberships = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/members`);
    const data = await response.json();
    dispatch(getMemberships(groupId, data));
    return response;
  };

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

  export const createAGroup = (payload) => async dispatch => {
   
        const response = await csrfFetch('/api/groups/', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()
        dispatch(createGroup(data));
        return data

  
  }


const initialState = {}

function groupsReducer(state=initialState, action) {
    switch(action.type) {
        case GET_GROUPS:
            return {...state, Groups: action.groups}
        case GET_GROUP_ID:
            return {...state, GroupById: action.group}
        case GET_MEMBERSHIPS:
            return {...state, Memberships: action.memberships}
        case CREATE_GROUP:
            return {...state, Groups: [action.payload]}
        default:
            return state;
    }
    
    
}

export default groupsReducer;