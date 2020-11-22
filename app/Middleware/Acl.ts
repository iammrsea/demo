import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import User from 'App/Models/User'
export default class Acl {
  public async handle (
    { params, auth }: HttpContextContract,
    next: () => Promise<void>,
    acls: string[]
  ) {
    const user = auth.user as User
    await user.preload('profile');
    await user.preload('dangiwaProfile')
    const id = params.id;
    let allow = false
    for (let i = 0; i < acls.length; i++) {
      if (allow) return
      switch (acls[i]) {
        case 'admin':
          allow = this.isAdmin(user)
          break
        case 'owner':
          allow = this.isOwner(user, id)
          break
        case 'canDelete':
          allow = await this.canDelete(user, id)
          break
      }
    }
    allow ? await next() : this.throwError('Unauthorized Access')
  }

  private throwError (message: string) {
    throw new AuthenticationException(message, '401')
  }
  private isAdmin(user: User) {
    const { profile, dangiwaProfile } = user;
    if (profile) {
      return profile.role === 'admin';
    }
    if (dangiwaProfile) {
      return dangiwaProfile.role === 'admin'
    }
    return false
  }
  private isOwner(user: User, userId: number) {
    // console.log('userId',+userId, user.id)
    return user.id === +userId
  }
  private async canDelete (authUser: User, userId: number): Promise<boolean> {
    const { profile:{role}, id } = authUser
    if (role !== 'admin') return false
    if (role === 'admin' && id === userId) return true
    if (role === 'admin') return true
    return false
  }
}
