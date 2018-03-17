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
                console.log("User id : " + user.uid)

                return user

            }).catch((err) => {
                console.error('User signin error', err);

                return null
            });
    }

    static updateUserEmail = (firebaseUser, user) => {
        return firebaseUser.updateEmail(user.email)
            .then(function () {
                // Update successful.
                firebaseUser.email = user.email

                return firebaseUser
            }).catch(function (error) {
                // An error happened.
                console.log("updateUserEmail error : " + JSON.stringify(error))
                return null
            });
    }

    static updateUserProfile = (firebaseUser, user) => {
        // IMPOTANT: updateProfile only updates the [displayName] and [photoURL]

        return firebaseUser.updateProfile({
            displayName: user.displayName,
            photoURL: user.photoURL,

        }).then(function () {
            // Update successful.
            // console.log("updateUserInfo successful")
            firebaseUser.displayName = user.displayName
            firebaseUser.photoURL = user.photoURL

            return firebaseUser
        }).catch(function (error) {
            // console.log("updateUserInfo error")
            // An error happened.
            return null
        });
    }

    static logout = () => {
        return firebase.auth().signOut().then(function () {
            // Sign-out successful.
            FacebookLoginHelper.logOut()
            GoogleLoginHelper.logout()

            return StatusTypes.SUCCESS
        }, function (error) {
            // An error happened.
            return StatusTypes.FAILED
        });
    }

    static getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
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
}

export default FirebaseAuthHelper