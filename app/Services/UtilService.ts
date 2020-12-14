import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { messages } from "App/Utils";
import ImageService from './ImageService';
import _ from 'lodash';
import User from 'App/Models/User';
import Rider from 'App/Models/Rider';
import { nanoid } from 'nanoid';

class UtilService {
    public validateIdParam({ request, params }: HttpContextContract, tableName: string) {
        return request.validate({
            schema: schema.create({
                id: schema.number([rules.exists({ table: tableName, column: 'id' })])
            }),
            data: { id: params.id },
            messages
        })
    }
    public async savePhoto(photo: any, folder: string) {
        try {
            const tmpPath = photo.tmpPath as string;
            const fileName = photo.clientName;
            const { thumbnailUrl, fileId, url } = await ImageService.saveImage(
                tmpPath,
                fileName,
                folder
            );
            return { thumbnailUrl, fileId, url };
        } catch (error) {
            throw error;
        }
    }
    public toSnakeCase(arg: string | object) {
        if (typeof arg === 'string') {
            return _.snakeCase(arg);
        }
        if (typeof arg === 'object') {
            const obj = {};
            Object.keys(arg).forEach(key => {
                obj[_.snakeCase(key)] = arg[key];
            })
            return obj;
        }
        throw new TypeError('Can only accept a string or object data type');
    }
    public async fakeRider() {
        const user = new User();
        user.email = nanoid() + '@gmail.com';
        user.password = 'password';
        user.phoneNumber = nanoid();
        user.role = 'rider';

        const rider = new Rider();
        rider.firstName = 'test_firstname';
        rider.lastName = 'test_lastname';
        // console.log('transaction', trx)
        await user.related('rider').save(rider);
        await user.preload('rider')
        const { role, email, rider: { id: riderId } } = user;
        return { email, role, riderId, password: 'password' };

    }
    // public searchNews(page:number,limit:number,searchTerm) {
    //     const sql =
    //   "to_tsvector(news.title) || to_tsvector(news.description) @@ to_tsquery(?)";
    //     return News.query()
    //         .whereRaw(sql, searchTerm)
    //         .preload('coverImage')
    //         .preload('likes', query => query.preload('liker'))
    //         .withCount('comments')
    //         .withCount('likes')
    //         .preload('comments', query => query.preload('commentor'))
    //         .orderBy('updated_at','desc')
    //         .paginate(page, limit);
    // }
    // public searchUsers(page: number, limit: number, searchTerm) { 
    //      const sql =
    //   "to_tsvector(profiles.first_name) || to_tsvector(profiles.last_name) @@ to_tsquery(?)";
    //     return User.query()
    //     .preload('profile')
    //         .whereHas('profile', profile => {
    //             profile.preload('photo')
    //             profile.whereRaw(sql, searchTerm);
    //     })
    //     .withCount('comments')
    //     .withCount('likes')
    //     .withCount('suggestions')
    //     .orderBy('updated_at','desc')
    //     .paginate(page, limit);

    // }
}
export default new UtilService();