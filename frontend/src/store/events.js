import { csrfFetch } from './csrf.js';

const GET_EVENTS = './get-events'

const getEvents = (events) => ({
    type: GET_EVENTS,
    events
});

export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch(`/api/events`)
    const data = await response.json();
    dispatch(getEvents(data.Events));
    return response;
}

const initialState = {}

function eventsReducer(state = initialState, action) {
    switch(action.type){
        case GET_EVENTS:
            return {...state, Events: action.events}
        default:
            return state;
    }
}

export default eventsReducer