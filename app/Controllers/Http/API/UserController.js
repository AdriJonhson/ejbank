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
      transferValue: 'required|number|above:0',
    }

    const validation = await validate(request.all(), rules, formatters.JsonApi)

    if (validation.fails()) {
        return response.status(422).json(validation.messages())
    }

    try{
      const { number, agency, transferValue } = request.all();
      const user                              = await auth.getUser();
      const userAccount                       = await user.account().fetch();

      if(transferValue > userAccount.ballance){
        return response.status(400).send({data: null, message: "Insufficient funds"});
      }

      const transferData = {
        number, agency, transferValue
      };

      let transferResponse = await this.transferToUser(user, userAccount, transferData);

      return response.status(transferResponse.code).send({data: transferResponse.data, message: transferResponse.message});

    }catch(error) {
      return response.status(500).send({data: null, message: error.message});
    }
  }

  async transferToUser(user, userAccount, transferData)
  {
    const recipientUser = await Account
        .query()
        .where('number', transferData.number)
        .where('agency', transferData.agency)
        .where('user_id', '!=', user.id)
        .first();

    if(!recipientUser){
      return {data: null, message: "Account not found", code: 422, success: false};
    }

    let updateRecipientUserBallance = recipientUser.ballance += transferData.transferValue;
    recipientUser.save();

    let updateUserBallance          = userAccount.ballance -= transferData.transferValue;
    userAccount.save();

    if(!updateRecipientUserBallance && !updateUserBallance){
      return {data: null, message: "Transfer Erro", code: 400, success: false};
    }

    return {data: null, message: "Transfer Success", code: 200, success: true};
  }
}

module.exports = UserController
