// Decide NOT use local storage, since there is no way to synchronize
// between server session expire and client local storage remove
// client may suffer false login state

// WHICH IS OK.  AMAZON.COM DOES IT
// EnsureLoggedInContainer will be needed anyway

import localforage from 'localforage';

const key = 'me';

export default {
  willGetSessionUser : async function() {
    return localforage.getItem(key).catch(err => err)
  },

  willSetSessionUser : async function(value) {
    return localforage.setItem(key, value).catch(err => err)
  },

  willRomveSessionUser : async function() {
    if (localforage.getItem(key)) {
      //console.log("removing me in local storage")
      return localforage.removeItem(key).catch(err => err)
    }
  }

}

// export const willGetSessionUserNew = async() => {
//   return localforage.getItem(key)
// }
