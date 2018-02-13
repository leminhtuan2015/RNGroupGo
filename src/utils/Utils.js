import DeviceInfo from 'react-native-device-info';

export function log(message){
  console.log("Logger : " + message)
}

export function objectToJson(object){
  let json = JSON.stringify(object)

  return json
}

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export function getCurrentPosition(callback) {
  try {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        callback(region, null)
      },
      (error) => {
        callback(null, error)
      }
    );
  } catch(e) {
    callback(null, e)
  }
};

export function uniqueId(){
  return DeviceInfo.getUniqueID()
}
