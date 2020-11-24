import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('state').notNullable();
      table.string('lga').notNullable();
      table.string('home_address').notNullable();
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE').onUpdate('CASCADE');
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
