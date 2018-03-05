import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import DeviceInfo from 'react-native-device-info';


const initialState = {
    groups: []
}

export const GroupReducer = (state = initialState, action) => {

    const {type, data} = action

    switch (type) {
        case ActionTypes.CREATE_GROUP:
            return createGroup(state, data)
        case ActionTypes.SET_GROUPS:
            return setGroups(state, data)
        default:
            return state
    }
}

function createGroup(state, data) {
    let {userIds} = data

    console.log("GroupReducer create group")
    const groupId = Utils.guid()
    let dataJson = {name: "hello", userIds: userIds}
    FirebaseHelper.write("groups/" + groupId, dataJson)

    createGroupUser(userIds, groupId)

    return state
}

function createGroupUser(userIds, groupId) {
    userIds.forEach(function (userId) {
        const id = Utils.guid()
        FirebaseHelper.write("group_user/" + id, {userId: userId, groupId: groupId})
    })
}

function setGroups(state, data) {
    return Object.assign({}, state, {groups: [data]})
}

export default GroupReducer


