import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Images extends BaseSchema {
  protected tableName = 'images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("url").notNullable();
      table.string("file_id").notNullable();
      table.string("thumbnail_url");
      table.enu('document_type',['profile_picture','birth_certificate','national_id','driver_license','utility_bill'])
      table.integer("driver_id").references('id').inTable('drivers').onDelete('CASCADE'); 
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
