const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    AccessToken,
    LoginManager
} = FBSDK;

class FacebookLoginHelper {

    static login = (callback) => {
        FacebookLoginHelper.getCurrentAccessToken((accessToken) => {
            if(accessToken){
                // LoggedIn
                // alert("LoggedIn : " + accessToken)
                callback(accessToken)
            } else {
                FacebookLoginHelper.loginWithPermissions((accessToken) => {
                    // alert("accessToken : " + accessToken)
                    callback(accessToken)
                })
            }
        })
    }

    static getCurrentAccessToken = (callback) => {
        AccessToken.getCurrentAccessToken().then(
            (data) => {
                if(data){
                    callback(data.accessToken)
                } else {
                    callback(null)
                }

            }
        )
    }

    static loginWithPermissions = (callback) => {
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            (result) => {
                if (result.isCancelled) {
                    alert('Login cancelled');
                } else {
                    FacebookLoginHelper.getCurrentAccessToken(callback)
                }
            },
            function(error) {
                alert('Login fail with error: ' + error);
            }
        );
    }

    static logOut = () => {
        LoginManager.logOut()
    }
}

export default FacebookLoginHelper