import auth from './auth'
import admin from './admin'
import error from './error'
import defaultRoute from './default'
export default [...admin,  auth, error,defaultRoute]
