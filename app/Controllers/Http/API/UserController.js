'use strict'

const Account = use('App/Models/Account');

const { validate, formatters } = use('Validator')

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
      response.status(400).send({data: null, message: "Internal Error"});
    }
  }

  async transfer({request, auth, response})
  {
    const rules = {
      number: 'required',
      agency: 'required',
      value: 'required',
    }

    const validation = await validate(request.all(), rules, formatters.JsonApi)

    if (validation.fails()) {
        return response
            .status(422)
            .json(validation.messages())
    }

    try{
      const { number, agency, value } = request.all();
      const user                      = await auth.getUser();
      const userAccount               = await user.account().fetch();

      if(value > userAccount.ballance){
        return response
            .status(400)
            .send({data: null, message: "Insufficient funds"});
      }

      const account = await Account
                  .query()
                  .where('number', number)
                  .where('agency', agency)
                  .where('user_id', '!=', user.id)
                  .getCount();

      if(account == 0){
        return response
          .status(400)
          .send({data: null, message: "Account not found"});
      }

    }catch(error) {
      return response
        .status(400)
        .send({data: null, message: error.message});
    }
  }
}

module.exports = UserController
