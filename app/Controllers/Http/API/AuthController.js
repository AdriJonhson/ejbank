'use strict'

class AuthController {

  async login({ request, auth, response }) {
    const {cpf, password} = request.all();

    let token = await auth.attempt(cpf, password);
    return response.status(200).json({data: token, message: 'Login successfull', status: true});
  }

  async logout({auth, response}) {
    await auth.logout();

    response.status(200).json({message: 'Logout successfull'});
  }
}

module.exports = AuthController
