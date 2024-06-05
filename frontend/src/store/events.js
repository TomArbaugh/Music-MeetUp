import { csrfFetch } from './csrf.js';

const GET_EVENTS = './get-events'

const GET_EVENT_ID = '/get-events-by-id'

const GET_ATTENDEES = '/get-attendees'

const getEvents = (events) => ({
    type: GET_EVENTS,
    events
});

const getEventId = (eventId, event) => ({
    type: GET_EVENT_ID,
    event
})

const getAttendees = (eventId, attendees) => ({
    type: GET_ATTENDEES,
    attendees
})

export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch(`/api/events`)
    const data = await response.json();
    dispatch(getEvents(data.Events));
    return response;
}

export const getAllEventsId = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    const data = await response.json();
    dispatch(getEventId(eventId, data));
    return response;
  };

export const getAllAttendees = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/attendees`);
    const data = await response.json();
    dispatch(getAttendees(eventId, data));
    return response
}

const initialState = {}

function eventsReducer(state = initialState, action) {
    switch(action.type){
        case GET_EVENTS:
            return {...state, Events: action.events}
        case GET_EVENT_ID:
            return {...state, EventById: action.event}
        case GET_ATTENDEES:
            return {...state, Attendees: action.attendees}
        default:
            return state;
    }
}

export default eventsReducer