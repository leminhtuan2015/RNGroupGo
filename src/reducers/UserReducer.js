import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';
import StatusTypes from "../constants/StatusTypes";


const initialState = {
    filterUsers: [],
    currentUser: null,
    isBusy: false,
    isNeedReAuth: false,
}

export const UserReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.USER_SET_FILTER_USERS:
            return setFilterUsers(state, data)
        case ActionTypes.USER_ADD_FRIEND:
            return addFriend(state, data)
        case ActionTypes.USER_SUBSCRIBE:
            return subscribe(state, data)
        case ActionTypes.USER_REQUEST_LOCATION:
            return requestLocation(state, data)
        case ActionTypes.USER_CREATE_CHANNEL:
            return createChannel(state, data)
        case ActionTypes.USER_REJECT_JOIN_CHANNEL:
            return rejectJoinChannel(state, data)
        case ActionTypes.USER_ACCEPT_JOIN_CHANNEL:
            return acceptJoinChannel(state, data)
        case ActionTypes.USER_UN_SUBSCRIBE_CHANNEL:
            return unSubscribeChannel(state, data)
        case ActionTypes.USER_SET_CURRENT_USER:
            return setCurrentUser(state, data)
        case ActionTypes.USER_USER_LOGIN_DONE:
            return userLoginDone(state, data)
        case ActionTypes.USER_USER_LOGOUT_DONE:
            return userLogoutDone(state, data)
        case ActionTypes.USER_SET_IS_BUSY:
            return setBusyStatus(state, data)
        case ActionTypes.USER_SET_IS_NEED_RE_AUTH:
            return setIsNeedReAuthStatus(state, data)
        case ActionTypes.USER_UPDATE_USER_INFO_DONE:
            return updateUserInfoDone(state, data)
        default:
            return state
    }
}

function setFilterUsers(state, data) {
    const {userData, isBusy} = data
    return Object.assign({}, state, {filterUsers: userData, isBusy: isBusy})
}

function addFriend(state, data) {
    return state
}

function createChannel(state, data) {
    let {
        jsonData,
        channelId,
        hostId,
        friendId
    } = data

    FirebaseHelper.write("channels/" + channelId,
        {users: jsonData, channelId: channelId, hostId: hostId, friendId: friendId})

    return state
}

function rejectJoinChannel(state, data) {
    let {channelId, userId} = data
    FirebaseHelper.write("channels/" + channelId + "/users/" + userId, -1)
    return state
}

function acceptJoinChannel(state, data) {
    let {channelId, userId} = data
    FirebaseHelper.write("channels/" + channelId + "/users/" + userId, 1)

    return state
}

function requestLocation(state, data) {
    let {fromUserId, toUserId, channelId} = data
    FirebaseHelper.write("users/" + toUserId + "/inbox",
        {data: data, receiveTime: (new Date().getMilliseconds())})
    return state
}

function subscribe(state, data) {
    let {path, callback} = data

    FirebaseHelper.subscribe(path, callback)

    return state
}

function unSubscribeChannel(state, data) {
    let {channelId} = data

    console.log("unSubscribeChannel : " + channelId)

    FirebaseHelper.unSubscribe("channels/" + channelId)

    return state
}

function setCurrentUser(state, data) {
    const {user} = data

    // console.log("User Reducer setCurrentUser" + JSON.stringify(user))
    updateStatus(user.uid)
    return Object.assign({}, state, {currentUser: user, isBusy: false})
}

function userLoginDone(state, data) {

    const {status, message} = data
    console.log("status : " + status + "message userLoginDone: " + message)
    const commonData = {isBusy: false, isNeedReAuth: false}

    if(status == StatusTypes.SUCCESS){
        const {user} = data
        console.log("userLoginDone : " + JSON.stringify(user))

        storeUserToFirebaseDatabase(user)

        return Object.assign({}, state, {currentUser: user}, commonData)
    } else {
        return Object.assign({}, state, commonData)
    }
}

function storeUserToFirebaseDatabase(user) {
    FirebaseHelper.write("users/" + user.uid + "/status", "1")
    FirebaseHelper.write("users/" + user.uid + "/name", user.displayName)
    FirebaseHelper.write("users/" + user.uid + "/photoURL", user.photoURL)
    FirebaseHelper.write("users/" + user.uid + "/email", user.email)
    FirebaseHelper.write("users/" + user.uid + "/phoneNumber", user.phoneNumber)
}

function updateStatus(uid) {
    FirebaseHelper.onDisconnect("users/" + uid + "/status", "0")
    FirebaseHelper.write("users/" + uid + "/status", "1")
}

function userLogoutDone(state, data) {
    const {status} = data

    if(status == StatusTypes.SUCCESS){
        return Object.assign({}, state, {currentUser: null})
    } else {
        return state
    }
}

function setBusyStatus(state, data) {
    const {isBusy} = data
    return Object.assign({}, state, {isBusy: isBusy})
}

function setIsNeedReAuthStatus(state, data) {
    const {isNeedReAuth} = data
    return Object.assign({}, state, {isBusy: isNeedReAuth})
}

function updateUserInfoDone(state, data) {
    const {user, error} = data

    storeUserToFirebaseDatabase(user)

    if(error){
        return Object.assign({}, state, {currentUser: user, isNeedReAuth: true})
    } else {
        return Object.assign({}, state, {currentUser: user, isNeedReAuth: false})
    }
}

export default UserReducer


