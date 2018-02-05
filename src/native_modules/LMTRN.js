
var LMTRNModule = require('NativeModules').LMTRNModule

class LMTRN {
 squareMe = (num) => {
    if (num == '') {
      return;
    }

    console.log("CALLING TO NATIVE");

    LMTRNModule.squareMe(num, (error, number) => {
      if (error) {
        console.error(error);
      } else {
        console.log("OKIIII: " + number);
      }
    })
  }

  log = (message) => {
    LMTRNModule.log()
  }
}
export default LMTRN
