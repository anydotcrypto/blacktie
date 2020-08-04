/*global Web3*/

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
const cleanContextForImports = () => {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('BlackTie - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
const restoreContextAfterImports = () => {
  try {
    global.define = __define
  } catch (_) {
    console.warn('BlackTie - global.define could not be overwritten.')
  }
}

cleanContextForImports()

import log from 'loglevel'
import LocalMessageDuplexStream from 'post-message-stream'
import { initProvider } from '@metamask/inpage-provider'

// TODO:deprecate:2020
import 'web3/dist/web3.min.js'

import setupDappAutoReload from './lib/auto-reload.js'

restoreContextAfterImports()

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

//
// setup plugin communication
//

// setup background connection
const metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

initProvider({
  connectionStream: metamaskStream,
})

//
// TODO:deprecate:2020
//

// setup web3

if (typeof window.web3 !== 'undefined') {
  throw new Error(`BlackTie detected another web3.
     BlackTie will not work reliably with another web3 extension.
     This usually happens if you have two BlackTies installed,
     or BlackTie and another web3 extension. Please remove one
     and try again.`)
}

const web3 = new Web3(window.ethereum)
web3.setProvider = function () {
  log.debug('BlackTie - overrode web3.setProvider')
}
log.debug('BlackTie - injected web3')

window.ethereum._web3Ref = web3.eth

// setup dapp auto reload AND proxy web3
setupDappAutoReload(web3, window.ethereum._publicConfigStore)
