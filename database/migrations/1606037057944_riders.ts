import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Riders extends BaseSchema {
  protected tableName = 'riders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name', 100);
      table.string('last_name', 100);
      table.string('address', 100);
      table.string('bvn', 30);
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
