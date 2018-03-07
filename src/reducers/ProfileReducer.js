import * as ActionTypes from "../constants/ActionTypes"
import FirebaseAuthHelper from "../helpers/FirebaseAuthHelper";
import StatusTypes from "../constants/StatusTypes";
import {PROFILE_USER_LOGGEDIN} from "../constants/ActionTypes";

const initialState = {
    currentUser: null
}

export const ProfileReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.PROFILE_GET_CURRENT_USER:
            return getCurrentUser(state, data)
        case ActionTypes.PROFILE_USER_LOGOUT:
            return userLogout(state, data)
        case ActionTypes.PROFILE_USER_LOGIN_DONE:
            return userLoginDone(state, data)
        default:
            return state
    }
}

function getCurrentUser(state, data) {
    const currentUser = FirebaseAuthHelper.currentUser()

    console.log("getCurrentUser : " + JSON.stringify(currentUser))

    return Object.assign({}, state, {currentUser: currentUser})
}

function userLogout(state, data) {
    const {status} = data

    if(status == StatusTypes.SUCCESS){
        return Object.assign({}, state, {currentUser: null})
    } else {
        return state
    }
}

function userLoginDone(state, data) {

    const {status, user, message} = data

    console.log("status : " + status + "message userLoginDone: " + message)

    if(status == StatusTypes.SUCCESS){
        return Object.assign({}, state, {currentUser: user})
    } else {
        return state
    }
    
}


export default ProfileReducer


