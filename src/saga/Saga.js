import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'

import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"
import FacebookLoginHelper from "../helpers/FacebookLoginHelper";

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

export function* facebookGetAccessToken() {
    const accessToken = yield call(FacebookLoginHelper.getCurrentAccessTokenSaga)

    console.log("getCurrentAccessTokenSaga : " + accessToken)
}


export default function* rootSaga() {

    yield takeEvery(ActionTypes.FIREBASE_FILTER_USER, firebaseFilterUser)
    yield takeEvery(ActionTypes.SAGA_FACEBOOK_GET_ACCESS_TOKEN, facebookGetAccessToken)
}




