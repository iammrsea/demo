import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Review from 'App/Models/Review';
import ReviewValidator from 'App/Services/validators/ReviewValidator';

export default class ReviewsController {
    public async index() {
        const reviews = await Review.query()
            .preload('trip')
            .preload('driver', driver => driver.preload('userData'))
            .preload('rider', rider => rider.preload('userData'));
        return {
            status: true, message: 'Fetched reviews successfully',
            data: reviews.map(review => {
                const reviewInfo = review.toJSON();
                const userData = reviewInfo.reviewer.userData;
                const email = userData.email;
                const phone_number = userData.phone_number;
                const reviewer = reviewInfo.reviewer;
                delete reviewer.userData;
                return { ...reviewInfo, reviewer: { ...reviewer, email, phone_number } }
            })
        }
    }
    public async store({ request, auth }: HttpContextContract) {
        const { stars, comment, tripId } = request.all();
        await ReviewValidator.validateReview(stars, comment, tripId);
        const user = auth.user;
        const review = new Review();
        review.stars = stars;
        review.comment = comment;
        review.tripId = tripId;
        if (user!.role === 'rider') {
            await user!.preload('rider');
            review.riderId = user!.rider.id;
        }
        if (user!.role === 'driver') {
            await user!.preload('driver');
            review.driverId = user!.driver.id;
        }
        await review.save();
        return {
            status: true, message: 'Review successfully saved',
            data: { id: review.id, stars, comment, trip_id: tripId }
        }
    }
}
