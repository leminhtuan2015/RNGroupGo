import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';

const initialState = {
    currentCoordinate: {latitude: 0, longitude: 0},
    userId: null,
}

export const MapReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.MAP_GET_CURRENT_PLACE:
            return getCurrentPlace(state)
        case ActionTypes.MAP_SET_USER_IN_MAP:
            return setUserInMap(state, data)
        case ActionTypes.MAP_UPDATE_CURRENT_PLACE_TO_FIREBASE:
            updateLocationToFirebase(data)
            return state
        case ActionTypes.MAP_LEAVE_CHANNEL:
            leaveChannel(data)
            return state
        case ActionTypes.MAP_REDUCER_TEST:
            return Object.assign({}, state, {map: "mapxxx"})
        default:
            return state
    }
}

function getCurrentPlace(state) {
    Utils.getCurrentPosition((region, error) => {
        console.log("Get Current Position done" + JSON.stringify(region))
        console.log("Get Current Position error" + JSON.stringify(error))

        return Object.assign({}, state, {currentCoordinate: region})
    })

    return state
}

function setUserInMap(state, data) {
    let {userId, channelId} = data

    return Object.assign({}, state, {userId: userId, channelId: channelId})
}

function updateLocationToFirebase(data) {
    const uniqueId = Utils.uniqueId();

    FirebaseHelper.write("users/" + uniqueId + "/coordinate", data)
}

function leaveChannel(data) {
    let {userId, channelId, status} = data

    FirebaseHelper.write("channels/" + channelId + "/users/" + userId, status)
}

export default MapReducer


