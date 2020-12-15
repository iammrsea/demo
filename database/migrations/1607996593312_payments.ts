import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Payments extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('amount_due').defaultTo(0);
      table.float('amount_paid').defaultTo(0);
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
