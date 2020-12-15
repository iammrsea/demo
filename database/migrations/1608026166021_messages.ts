import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('text').notNullable();
      table.json('message_replies');
      table.integer('rider_id').references('id').inTable('riders').onDelete('CASCADE');
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
