import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProfileImages extends BaseSchema {
  protected tableName = 'profile_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("url").notNullable();
      table.string("file_id").notNullable();
      table.string("thumbnail_url");
      table.integer("driver_id").references('id').inTable('drivers').onDelete('CASCADE');
      table.integer("rider_id").references('id').inTable('riders').onDelete('CASCADE');
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
