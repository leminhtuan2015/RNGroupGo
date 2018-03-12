import FacebookLoginHelper from "./FacebookLoginHelper";
import StatusTypes from "../constants/StatusTypes";
import GoogleLoginHelper from "./GoogleLoginHelper";

var firebase = require("firebase");

class FirebaseAuthHelper {

    static facebookAuth = (accessToken) => {
        const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);

        return FirebaseAuthHelper.auth(credential)
    }

    static googleAuth = (idToken, accessToken) => {
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

        return FirebaseAuthHelper.auth(credential)
    }

    static auth = (credential) => {
        return firebase.auth().signInWithCredential(credential)
            .then((user) => {
                console.log("User id : " +user.uid )

                return user

            }).catch((err) => {
                console.error('User signin error', err);

                return null
            });
    }

    static updateUserInfo = (user, userInfo) => {
        return user.updateProfile({
            displayName: userInfo.userName,
            photoURL: userInfo.imageUrl
        }).then(function() {
            // Update successful.
            return user
        }).catch(function(error) {
            // An error happened.
            return null
        });
    }

    static logout = () => {
        return firebase.auth().signOut().then(function() {
            // Sign-out successful.
            FacebookLoginHelper.logOut()
            GoogleLoginHelper.logout()

            return StatusTypes.SUCCESS
        }, function(error) {
            // An error happened.
            return StatusTypes.FAILED
        });
    }

    static user = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    resolve(user)
                } else {
                    // No user is signed in.
                    resolve(null)
                }
            });
        })
    }

    static currentUser = () => {
        const user = firebase.auth().currentUser

        return user
    }

    static isLoggedIn = () => {
        if(FirebaseAuthHelper.currentUser()){
            return true
        }

        return false
    }
}

export default FirebaseAuthHelper