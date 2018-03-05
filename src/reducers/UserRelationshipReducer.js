import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';


const initialState = {}

export const UserRelationshipReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.INSERT_DATA:
            return insertData(state, data)
        default:
            return state
    }
}

function insertData(state, data) {
    return state
}

export default UserRelationshipReducer


