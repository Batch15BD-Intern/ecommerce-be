/**
 * cart controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
    async find(ctx) {
        const userId = ctx.state.auth.credentials.id;
        console.log(userId);
        return userId;
    }
}));
