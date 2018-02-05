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
