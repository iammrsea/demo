import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { messages } from "../utils";
import ImageService from './ImageService';

class UtilService{
    public validateIdParam({request,params}: HttpContextContract,tableName:string) {
        return request.validate({
            schema: schema.create({
                id: schema.number([rules.exists({table: tableName,column:'id'})])
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