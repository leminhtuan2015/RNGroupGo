import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'

import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import FacebookLoginHelper from "../helpers/FacebookLoginHelper";
import GoogleLoginHelper from "../helpers/GoogleLoginHelper";
import FirebaseAuthHelper from "../helpers/FirebaseAuthHelper";
import StatusTypes from "../constants/StatusTypes";
import LocationHelper from "../helpers/LocationHelper";

export function* firebaseFilterUser(action) {
    yield put({type: ActionTypes.USER_SET_IS_BUSY, data: {isBusy: true}})

    let {data} = action
    console.log("Saga Firebase Filter User : " + data)
    let users = yield call(FirebaseHelper.filter, data, "users", "name")
    console.log("users filtered: " + JSON.stringify(users))
    let userData = FirebaseHelper.snapshotToArray(users)

    yield put({type: ActionTypes.USER_SET_FILTER_USERS,
        data: {userData: userData, isBusy: false}})
}

export function* facebookLogin() {
    yield put({type: ActionTypes.USER_SET_IS_BUSY, data: {isBusy: true}})

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
                        yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                            data: {status: StatusTypes.SUCCESS, user: userDetail, message: "Login Success"}})
                    } else {
                        yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                            data: {status: StatusTypes.FAILED, message: "userDetail failed"}})
                    }
                } else {
                    yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                        data: {status: StatusTypes.FAILED, message: "userInfo failed"}})
                }
            } else {
                yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                    data: {status: StatusTypes.FAILED, message: "user failed"}})
            }
        } else {
            yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                data: {status: StatusTypes.FAILED, message: "accessToken failed"}})
        }
    } else {
        yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
            data: {status: loginStatus, message: "login not ok"}})
    }

    console.log("loginStatus : " + loginStatus)
}

export function* googleLogin() {
    yield put({type: ActionTypes.USER_SET_IS_BUSY, data: {isBusy: true}})

    const configStatus = yield call(GoogleLoginHelper.config)
    const data = yield call(GoogleLoginHelper.login)
    const {status} = data

    console.log("gg login status : " + status)

    if(status == StatusTypes.SUCCESS){
        const {googleUser} = data
        const gooleUserInfomation = {userName: googleUser.name, imageUrl: googleUser.photo}
        const accessToken = googleUser.accessToken
        const idToken = googleUser.idToken
        const firebaseUser = yield call(FirebaseAuthHelper.googleAuth, idToken, accessToken)

        if(firebaseUser){
            const firebaseUserDetail = yield call(FirebaseAuthHelper.updateUserInfo, firebaseUser, gooleUserInfomation)
            if(firebaseUserDetail){
                yield put({type: ActionTypes.USER_USER_LOGIN_DONE,
                    data: {status: StatusTypes.SUCCESS, user: firebaseUserDetail, message: "Login Success"}})
            } else {
                yield put({type: ActionTypes.USER_USER_LOGIN_DONE, data: {status: StatusTypes.FAILED,
                        message: "updateUserInfo failed"}})
            }
        } else {
            yield put({type: ActionTypes.USER_USER_LOGIN_DONE, data: {status: StatusTypes.FAILED,
                    message: "googleAuth failed"}})
        }
    } else {
        yield put({type: ActionTypes.USER_USER_LOGIN_DONE, data: {status: status, message: "Login Failed"}})
    }

    console.log("gg loginStatus : " + status)
}

export function* phoneLogin(action) {
    const phoneNumber = action.phoneNumber

    console.log("phoneLogin : " + phoneNumber)

    // const status = yield call(FirebaseAuthHelper.phoneNumberAuth, phoneNumber)
}

export function* getCurrentUser(){
    const user = yield call(FirebaseAuthHelper.user)

    console.log("getCurrentUser saga 2: " + JSON.stringify(user))

    yield put({type: ActionTypes.USER_SET_CURRENT_USER, data: {user: user}})

    console.log("getCurrentUser saga 3: " + JSON.stringify(user))
}

export function* logout(){
    const statusType = yield call(FirebaseAuthHelper.logout)

    yield put({type: ActionTypes.USER_USER_LOGOUT_DONE, data: {status: statusType}})
}

export function* getCurrentPlace(){
    const region = yield call(LocationHelper.getCurrentPosition)

    console.log("saga getCurrentPlace : " + region)

    yield put({type: ActionTypes.MAP_SET_CURRENT_PLACE, data: {region: region}})
}

export function* getFriendData(action){

    const {friendId} = action
    const path = "users/" + friendId
    const data = yield call(FirebaseHelper.read, path)

    console.log("saga getFriendData : " + JSON.stringify(data))

    yield put({type: ActionTypes.MAP_SET_FRIEND_DATA_IN_MAP, data: {friendData: data}})
}

export default function* rootSaga() {
    yield takeEvery(ActionTypes.SAGA_FIREBASE_FILTER_USER, firebaseFilterUser)
    yield takeEvery(ActionTypes.SAGA_GOOGLE_LOGIN, googleLogin)
    yield takeEvery(ActionTypes.SAGA_FACEBOOK_LOGIN, facebookLogin)
    yield takeEvery(ActionTypes.SAGA_PHONE_NUMBER_LOGIN, phoneLogin)
    yield takeEvery(ActionTypes.SAGA_GET_CURRENT_USER, getCurrentUser)
    yield takeEvery(ActionTypes.SAGA_USER_LOGOUT, logout)
    yield takeEvery(ActionTypes.SAGA_GET_CURRENT_PLACE, getCurrentPlace)
    yield takeEvery(ActionTypes.SAGA_GET_FRIEND_DATA_IN_MAP, getFriendData)
}




