import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('amount_deposited').defaultTo(0);
      table.float('amount_withdrawn').defaultTo(0);
      table.float('amount_remitted').defaultTo(0);
      table.string('transaction_ref');
      table.integer('rider_id').references('id').inTable('riders').onDelete('CASCADE');
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
