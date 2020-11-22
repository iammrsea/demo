import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const user = await User.updateOrCreate({ email: 'admin@gmail.com' }, {
      email: 'admin@gmail.com',
      password: 'admin',
      role: 'admin'
    });
    await user.save();

    //User to access API documentation
    await User.updateOrCreateMany('email',[
      {
        email: "johndoe@gmail.com",
        password: 'password',
      }
    ])
  }
}

