'use strict'

class AuthController {

  async login({ request, auth, response }) {
    const {email, password} = request.all();

    let token = await auth.attempt(email, password);
    return response.status(200).json({data: token, message: 'Login successfull', status: true});
  }
}

module.exports = AuthController
