'use strict'

class UserController {
  async profile({request, auth, response})
  {
    try {
      const user        = await auth.getUser();
      const userAccount = await user.account().fetch();

      const data = {
        'name': user.username,
        'email': user.email,
        'cpf': user.cpf,
      };

      let accountData = null;

      if(userAccount){
        accountData = {
          'number': userAccount.number,
          'agency': userAccount.agency,
          'ballance': userAccount.ballance
        };
      }

      data.account = accountData;

      return response.status(200).json({data: data});
    } catch (error) {
      response.send('Missing or invalid jwt token')
    }
  }
}

module.exports = UserController
