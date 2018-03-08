import {GoogleSignin} from 'react-native-google-signin';
import StatusTypes from "../constants/StatusTypes";

const GOOGLE_CLIENT_ID = "289883308274-2n5nr38gkespsv07vau0614ci12bl11a.apps.googleusercontent.com"
const REVERSED_CLIENT_ID = "com.googleusercontent.apps.289883308274-2n5nr38gkespsv07vau0614ci12bl11a"

// REVERSED_CLIENT_ID : using for config Info / URL type in Xcode

class GoogleLoginHelper {
    static config = () => {
        return GoogleSignin.configure({
            iosClientId: GOOGLE_CLIENT_ID, // only for iOS
        }).then(() => {
            console.log("Google Config Client ID Success");
            return StatusTypes.SUCCESS
        });
    }

    static login = () => {
        return new Promise((resolve, reject) => {
            GoogleSignin.signIn()
                .then((user) => {
                    console.log("GoogleSignin user : " + user)
                    console.log("GoogleSignin user access token : " + user.accessToken)
                    resolve({status: StatusTypes.SUCCESS, googleUser: user})
                    // return {status: StatusTypes.SUCCESS, user: user}
                })
                .catch((err) => {
                    console.log('WRONG SIGNIN', err);
                    reject({status: StatusTypes.FAILED, err: err});
                    // return {status: StatusTypes.FAILED, err: err}
                })
                .done();
        })
    }

    static logout = () => {
        return GoogleSignin.signOut()
            .then(() => {
                return StatusTypes.SUCCESS
            })
            .catch((err) => {
                return StatusTypes.FAILED
            });
    }
}

export default GoogleLoginHelper