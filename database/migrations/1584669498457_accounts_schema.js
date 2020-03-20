'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountsSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()

      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id')

      table.string('number', 80).notNullable().unique()
      table.string('agency', 80).notNullable().unique()
      table.double('float ').default(0)
      table.boolean('active').default(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountsSchema
