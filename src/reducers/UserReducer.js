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

function requestLocation(state, data){
  let {userId} = data
  FirebaseHelper.write("users/" + userId + "/inbox", {x: 1}) 
  return state
}

function subscribe(state, data){
  let {path, callback} = data

  FirebaseHelper.subscribe(path, callback) 

  return state
}

export default UserReducer


