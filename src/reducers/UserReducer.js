import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';


const initialState = {
  filterUsers: [],
}

export const UserReducer = (state = initialState, action) => {

  const {type, data} = action 

  switch (type) {
  case ActionTypes.SET_FILTER_USERS:
    return setFilterUsers(state, data)
  case ActionTypes.ADD_FRIEND:
    return addFriend(state, data)
  case ActionTypes.SUBSCRIBE:
    return subscribe(state, data)
  case ActionTypes.REQUEST_LOCATION:
    return requestLocation(state, data)
  case ActionTypes.CREATE_CHANNEL:
    return createChannel(state, data)
  case ActionTypes.REJECT_JOIN_CHANNEL:
     return rejectJoinChannel(state, data)
  case ActionTypes.ACCEPT_JOIN_CHANNEL:
     return acceptJoinChannel(state, data)
  case ActionTypes.LEAVE_CHANNEL:
     return unSubscribeChannel(state, data)
  default:
    return state 
  }
}

function setFilterUsers(state, data){
  return Object.assign({}, state, {filterUsers: data})
}

function addFriend(state, data){
  return state 
}

function createChannel(state, data){
  let {jsonData, channelId} = data
  FirebaseHelper.write("channels/" + channelId, {users: jsonData})

  return state
}

function rejectJoinChannel(state, data){
  let {channelId, userId} = data
  FirebaseHelper.write("channels/" + channelId + "/users/" + userId, -1)
  return state
}

function acceptJoinChannel(state, data){
  let {channelId, userId} = data
  FirebaseHelper.write("channels/" + channelId + "/users/" + userId, 1)

  return state
}

function requestLocation(state, data){
  let {fromUserId, toUserId, channelId} = data
  FirebaseHelper.write("users/" + toUserId + "/inbox",
    {data: data, receiveTime: (new Date().getMilliseconds())}) 
  return state
}

function subscribe(state, data){
  let {path, callback} = data

  FirebaseHelper.subscribe(path, callback) 

  return state
}

function unSubscribe(state, data){
  let {channelId} = data

  FirebaseHelper.unSubscribe("channels/" + channelId)

  return state
}

export default UserReducer

