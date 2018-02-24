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

export default UserReducer


