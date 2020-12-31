import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tokens extends BaseSchema {
  protected tableName = 'tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('token').notNullable();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('rider_id').references('id').inTable('riders').onDelete('CASCADE')
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
