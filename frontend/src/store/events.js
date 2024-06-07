import { csrfFetch } from './csrf.js';

const GET_EVENTS = './get-events'

const GET_EVENT_ID = '/get-events-by-id'

const GET_ATTENDEES = '/get-attendees'

const CREATE_EVENT = '/create-event'

const ADD_EVENT_IMAGE = '/add-event-image'

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

const createEvent = (groupId, payload) => ({
    type: CREATE_EVENT,
    payload

})

const addEventImage = (eventId, payloadTwo) => ({
    type: ADD_EVENT_IMAGE,
    payloadTwo
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

export const createTheEvent = (groupId, payload) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()
    dispatch(createEvent(data))
    return data
}

export const addAnEventImage = (eventId, payloadTwo) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadTwo)
    })

    const data = await response.json()
    dispatch(addEventImage(data))
    return data
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
        case CREATE_EVENT:
            return {...state, Events: [action.payload]}
        case ADD_EVENT_IMAGE:
            return {...state, EventImages: [action.payloadTwo]}
        default:
            return state;
    }
}

export default eventsReducer