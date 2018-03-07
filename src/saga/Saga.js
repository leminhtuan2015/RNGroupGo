import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'

import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import FacebookLoginHelper from "../helpers/FacebookLoginHelper";
import FirebaseAuthHelper from "../helpers/FirebaseAuthHelper";
import StatusTypes from "../constants/StatusTypes";

export function* firebaseFilterUser(action) {
    let {data} = action
    console.log("Saga Firebase Filter User : " + data)
    let users = yield call(FirebaseHelper.filter, data, "users", "name")
    console.log("users filtered: " + JSON.stringify(users))
    const uniqueId = Utils.uniqueId();
    delete users["679152F5-79BE-4158-9180-EBCF97005512"]
    console.log("users filtered ok: " + JSON.stringify(users))
    let userData = FirebaseHelper.snapshotToArray(users)
    yield put({type: ActionTypes.SET_FILTER_USERS, data: userData})
}

export function* facebookLogin() {
    const loginStatus = yield call(FacebookLoginHelper.login)

    if(loginStatus == StatusTypes.SUCCESS){
        const accessToken = yield call(FacebookLoginHelper.getCurrentAccessToken)
        if(accessToken){
            const user = yield call(FirebaseAuthHelper.facebookAuth, accessToken)
            if(user){
                console.log("facebookLogin user: " + JSON.stringify(user))
                const userInfo = yield call(FacebookLoginHelper.getUserInfomation)

                console.log("facebookLogin userInfo: " + JSON.stringify(userInfo))
                if(userInfo){
                    const userDetail = yield call(FirebaseAuthHelper.updateUserInfo, user, userInfo)
                    if(userDetail){
                        yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
                            data: {status: StatusTypes.SUCCESS, user: userDetail, message: "Login Success"}})
                    } else {
                        yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
                            data: {status: StatusTypes.FAILED, message: "userDetail failed"}})
                    }
                } else {
                    yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
                        data: {status: StatusTypes.FAILED, message: "userInfo failed"}})
                }
            } else {
                yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
                    data: {status: StatusTypes.FAILED, message: "user failed"}})
            }
        } else {
            yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
                data: {status: StatusTypes.FAILED, message: "accessToken failed"}})
        }
    } else {
        yield put({type: ActionTypes.PROFILE_USER_LOGIN_DONE,
            data: {status: loginStatus, message: "login not ok"}})
    }

    console.log("loginStatus : " + loginStatus)
}

export function* logout(){
    const statusType = yield call(FirebaseAuthHelper.logout)

    yield put({type: ActionTypes.PROFILE_USER_LOGOUT, data: {status: statusType}})

}


export default function* rootSaga() {
    yield takeEvery(ActionTypes.FIREBASE_FILTER_USER, firebaseFilterUser)
    yield takeEvery(ActionTypes.SAGA_FACEBOOK_LOGIN, facebookLogin)
    yield takeEvery(ActionTypes.SAGA_USER_LOGOUT, logout)
}




