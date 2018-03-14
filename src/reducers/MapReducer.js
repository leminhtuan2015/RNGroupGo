import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';

const initialState = {
    currentCoordinate: {latitude: 0, longitude: 0},
    friendId: null,
    channelId: null,
}

export const MapReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.MAP_SET_CURRENT_PLACE:
            return setCurrentPlace(state, data)
        case ActionTypes.MAP_SET_USER_IN_MAP:
            return setUserInMap(state, data)
        case ActionTypes.MAP_UPDATE_CURRENT_PLACE_TO_FIREBASE:
            updateLocationToFirebase(data)
            return state
        case ActionTypes.MAP_LEAVE_CHANNEL:
            return leaveChannel(state, data)
        case ActionTypes.MAP_REDUCER_TEST:
            console.log("MAP_REDUCER_TEST")
            return Object.assign({}, state, {map: "mapxxx"})
        default:
            return state
    }
}

function setCurrentPlace(state, data) {
    const {region} = data
    return Object.assign({}, state, {currentCoordinate: region})
}

function setUserInMap(state, data) {
    let {userId, channelId} = data

    return Object.assign({}, state, {friendId: userId, channelId: channelId})
}

function updateLocationToFirebase(data) {
    const {uid, currentCoordinate} = data

    FirebaseHelper.write("users/" + uid + "/coordinate", currentCoordinate)
}

function leaveChannel(state, data) {
    let {userId, channelId, status} = data

    FirebaseHelper.write("channels/" + channelId + "/users/" + userId, status)

    return state
}

export default MapReducer


