import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'

import * as ActionTypes from "../constants/ActionTypes"
import FirebaseHelper from "../helpers/FirebaseHelper"
import FacebookLoginHelper from "../helpers/FacebookLoginHelper";
import GoogleLoginHelper from "../helpers/GoogleLoginHelper";
import FirebaseAuthHelper from "../helpers/FirebaseAuthHelper";
import StatusTypes from "../constants/StatusTypes";
import LocationHelper from "../helpers/LocationHelper";
import User from "../models/User";

export function* firebaseFilterUser(action) {
    yield put({type: ActionTypes.USER_SET_IS_BUSY, data: {isBusy: true}})

    let {keyword, currentUserId} = action.data
    let usersSnapshot = yield call(FirebaseHelper.filter, keyword, "users", "name")
    let usersObject = {}

    // console.log("Saga firebaseFilterUser users: -" + JSON.stringify(usersObject) + "-")
    // console.log("Saga firebaseFilterUser currentUserId: " + currentUserId)

    if(JSON.stringify(usersSnapshot) != "null"){
        usersObject = usersSnapshot.toJSON()
        delete usersObject[currentUserId]
    }

    let userData = FirebaseHelper.objectToArray(usersObject)

    // console.log("Saga firebaseFilterUser userData: " + JSON.stringify(userData))
    yield put({type: ActionTypes.USER_SET_FILTER_USERS, data: {userData: userData, isBusy: false}})
}

export function* facebookLogin() {
    yield put({type: ActionTypes.USER_SET_IS_BUSY, data: {isBusy: true}})

    const loginStatus = yield call(FacebookLoginHelper.login)

    if(loginStatus == StatusTypes.SUCCESS){
        const accessToken = yield call(FacebookLoginHelper.getCurrentAccessToken)
        if(accessToken){
            const firebaseUser = yield call(FirebaseAuthHelper.facebookAuth, accessToken)
            if(firebaseUser){
                console.log("facebookLogin firebaseUser: " + JSON.stringify(firebaseUser))
                const userInfo = yield call(FacebookLoginHelper.getUserInfomation)

                console.log("facebookLogin userInfo: " + JSON.stringify(userInfo))
                if(userInfo){
                    const userDetail = yield call(FirebaseAuthHelper.updateUserProfile, firebaseUser, userInfo)
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
        const gooleUserInfomation = new User()
        gooleUserInfomation.displayName = googleUser.name
        gooleUserInfomation.photoURL = googleUser.photo

        const accessToken = googleUser.accessToken
        const idToken = googleUser.idToken
        const firebaseUser = yield call(FirebaseAuthHelper.googleAuth, idToken, accessToken)

        if(firebaseUser){
            const firebaseUserDetail = yield call(FirebaseAuthHelper.updateUserProfile, firebaseUser, gooleUserInfomation)
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
    const user = yield call(FirebaseAuthHelper.getCurrentUser)

    // console.log("getCurrentUser saga 2: " + JSON.stringify(user))

    yield put({type: ActionTypes.USER_SET_CURRENT_USER, data: {user: user}})
}

export function* logout(){
    const statusType = yield call(FirebaseAuthHelper.logout)

    yield put({type: ActionTypes.USER_USER_LOGOUT_DONE, data: {status: statusType}})
}

export function* getCurrentPlace(){
    const region = yield call(LocationHelper.getCurrentPosition)

    // console.log("saga getCurrentPlace : " + region)

    yield put({type: ActionTypes.MAP_SET_CURRENT_PLACE, data: {region: region}})
}

export function* getFriendData(action){

    const {friendId} = action
    const path = "users/" + friendId
    const data = yield call(FirebaseHelper.read, path)

    // console.log("saga getFriendData : " + JSON.stringify(data))

    yield put({type: ActionTypes.MAP_SET_FRIEND_DATA_IN_MAP, data: {friendData: data}})
}

export function* updateUserInfo(action) {
    let {firebaseUser, userInfo} = action.data

    console.log("Saga updateUserInfo : " + JSON.stringify(userInfo))

    let userProfile = firebaseUser
    let userEmail = firebaseUser

    if(firebaseUser.displayName != userInfo.displayName){
        userProfile = yield call(FirebaseAuthHelper.updateUserProfile, firebaseUser, userInfo)
        console.log("Saga updated userProfile : " + JSON.stringify(userProfile))
    }

    if(firebaseUser.email != userInfo.email){
        userEmail = yield call(FirebaseAuthHelper.updateUserEmail, firebaseUser, userInfo)
        console.log("Saga updated userEmail : " + JSON.stringify(userEmail))
    }

    console.log("Saga updateUserInfo userEmail : " + JSON.stringify(userEmail))
    console.log("Saga updateUserInfo userProfile : " + JSON.stringify(userProfile))

    if(userProfile && userEmail){
        userProfile.email = userEmail.email
        yield put({type: ActionTypes.USER_UPDATE_USER_INFO_DONE,
            data: {user: userProfile, error: null}})
    } else {
        yield put({type: ActionTypes.USER_UPDATE_USER_INFO_DONE,
            data: {user: userProfile, error: {message: "Need Login Again"}}})
    }
}

export function* addUserToHistory(action) {
    let {uid, friendId} = action.data
    let path = "users/" + uid + "/friendsHistory"
    let friendIds = []

    const data = yield call(FirebaseHelper.read, path)

    if(data){
        console.log("data" + data)

        if(!data.includes(friendId)){
            data.push(friendId)
        }

        console.log("friendIdsData 2" + data)

        friendIds = data

    } else {
        friendIds.push(friendId)
    }

    yield call(FirebaseHelper.write, path, friendIds)
}

export function* getUserFromHistory(action) {
    let {uid} = action.data
    let path = "users/" + uid + "/friendsHistory"
    let users = []

    const userIds = yield call(FirebaseHelper.read, path)

    console.log("getUserFromHistory userIds: " + JSON.stringify(userIds))

    if(userIds){
        let usersData = []

        yield* userIds.map(function* (userId) {
            const user = yield call(FirebaseHelper.read, "users/" + userId)
            user.key = userId
            usersData.push(user)
        })

        console.log("getUserFromHistory usersData: " + JSON.stringify(usersData))
        users = usersData
    }

    yield put({type: ActionTypes.USER_SET_FRIEND_HISTORY,
        data: {users: users}})
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
    yield takeEvery(ActionTypes.SAGA_UPDATE_USER_INFO, updateUserInfo)
    yield takeEvery(ActionTypes.SAGA_ADD_USER_TO_HISTORY, addUserToHistory)
    yield takeEvery(ActionTypes.SAGA_GET_USER_FROM_HISTORY, getUserFromHistory)
}




