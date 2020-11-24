import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Drivers extends BaseSchema {
  protected tableName = 'drivers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {  
      table.increments('id')
      table.string('first_name', 100);
      table.string('last_name', 100);
      table.string('full_name',180)
      table.string('bvn', 30);
      table.boolean('verified').defaultTo(false);
      table.boolean('suspended').defaultTo(false);
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
