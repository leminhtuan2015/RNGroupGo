import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {delay} from 'redux-saga'

import * as ActionTypes from "../constants/ActionTypes"
import * as Utils from "../utils/Utils"
import FirebaseHelper from "../helpers/FirebaseHelper"

export function* hello() {
    yield delay(1000)
    console.log('HELLO')
    //yield put({type: 'INCREMENT'})
}

export function* bye() {
    console.log("BYE")
    yield
    console.log("bye 123")
}

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


// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
    // REGISTER actions
    yield takeEvery('HELLO', hello)
    yield takeEvery('BYE', bye)

    yield takeEvery(ActionTypes.FIREBASE_FILTER_USER, firebaseFilterUser)
}




