import NotificationService from 'App/Services/NotificationService';
import test from 'japa';
import { NOTIFICATION_TOKEN } from "../helpers";

test.group('Firebase notification', () => {

    test('notify a user given their token', async (assert) => {
        const data = {
            title: 'Sample title',
            body: 'Sample of a notification body'
        }
        const res = await NotificationService.notifyUser({ token: NOTIFICATION_TOKEN, data });
        assert.isDefined(res);
        assert.isString(res);
    })
})