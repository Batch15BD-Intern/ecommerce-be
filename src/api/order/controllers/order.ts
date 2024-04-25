/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async find(ctx) {
    const result = await strapi.entityService.findMany('api::order.order', {
      filters: {
        user: ctx.state.user.id
      },
      populate: {
        order_lines: {
          fields: ["price", "quantity"],
          populate: {
            product_item: {
              fields: ["name"],
              populate: {
                image: {
                  fields: ['formats']
                }
              }

            }
          }
        },
      }
    })
    return { data: result };
  },
  async create(ctx) {
    const ids: any[] = []
    let total = 0;

    for (const e of ctx.request.body.data) {
      const product_item = await strapi.entityService.findOne('api::product-item.product-item',
        e.product_item, {
        fields: ["price"],
      });

      const res = await strapi.entityService.create("api::order-line.order-line", {
        data: {
          user: ctx.state.user.id,
          product_item: e.product_item,
          quantity: e.quantity,
          price: product_item.price
        }

      });
      ids.push(res.id);
      total += e.quantity * product_item.price;


    }
    const userAddress = await strapi.entityService.findMany('api::user-address.user-address', {
      filters: {
        user: ctx.state.user.id
      },
      sort: ["createdAt:desc"],
      limit: 1
    });
    const latestAddressId = userAddress[0].id;
    const result = await strapi.entityService.create("api::order.order", {
      data: {
        user: ctx.state.user.id,
        status: "pending",
        order_lines: ids,
        user_address: latestAddressId,
        total: total
      }
    });
    return result
  },
  async update(ctx) {
    const { body } = ctx.request;
    const order = await strapi.entityService.findOne('api::order.order',
      body.data.id, {
      fields: ['status'],
    });

    if (order.status === "shipped" || order.status === "processing") {
      return ctx.badRequest({
        error: {
          status: 400,
          message: 'Orders have been processing or shipped and cannot be canceled',
        },
      });
    }
    const response = await strapi.entityService.update('api::order.order',
      body.data.id, {
      data: {
        status: body.data.status,
      },

    })
    if (response.status === "shipped") {
      const findOrder = await strapi.entityService.findOne("api::order.order", body.data.id, {
        populate: {
          order_lines: {
            populate: {
              product_item: {
                fields: ["id", "quantity"]
              }
            }
          }
        }
      });
      for (const e of findOrder.order_lines) {
        const findProduct_item = await strapi.entityService.findOne("api::product-item.product-item", e.product_item.id, {
          fields: ["price"],
          populate: {
            product_merchants: {
              fields: ["quantity"]
            }
          }
        });
        for (const pr of findProduct_item.product_merchants) {
          const product_merchant = await strapi.entityService.findOne('api::product-merchant.product-merchant',
            pr.id, {
            fields: ["quantity"],
          });
          const updateInventory = await strapi.entityService.update("api::product-merchant.product-merchant", pr.id, {
            data: {
              quantity: product_merchant.quantity - e.quantity
            }
          });
        }

      }

    }
    return { data: response };

  }
}));
