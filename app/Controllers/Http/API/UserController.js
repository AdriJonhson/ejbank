'use strict'

class UserController {
  async profile({request, auth})
  {
    try {
      return await auth.getUser()
    } catch (error) {
      response.send('Missing or invalid jwt token')
    }
  }
}

module.exports = UserController
