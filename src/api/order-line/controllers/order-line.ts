/**
 * order-line controller
 */

import { factories } from '@strapi/strapi'


export default factories.createCoreController('api::order-line.order-line', ({ strapi }) => ({
  async find(ctx) {
    const result = await strapi.entityService.findMany('api::order-line.order-line', {
      filters: {
        user: ctx.state.user.id
      },
      fields: ["quantity", "price", "createdAt", "updatedAt"],
      populate: {
        product_item: {
          fields: ['price', 'name'],
          populate: {
            image: {
              fields: ['formats']
            }
          }
        }
      },

    })
    return { data: result };
  },
  // async create(ctx) {
  //   const { body } = ctx.request;

  //   // Tạo order_line từ dữ liệu được gửi từ client
  //   const orderLine = await strapi.entityService.create('api::order-line.order-line', {
  //     data: {
  //       user: ctx.state.user.id,
  //       quantity: body.data.quantity,
  //       price: body.data.price,
  //       product_item: body.data.product_item
  //     }
  //   });

  //   // Tìm hoặc tạo order cho người dùng
  //   const orders = await strapi.entityService.findMany('api::order.order', {
  //     filters: {
  //       user: ctx.state.user.id
  //     },
  //     populate: { order_lines: true }
  //   });

  //   let order = null;

  //   if (!orders || orders.length === 0) {
  //     // Nếu không có đơn hàng nào của người dùng tồn tại, tạo mới đơn hàng và thêm order_line vào
  //     order = await strapi.entityService.create('api::order.order', {
  //       data: {
  //         user: ctx.state.user.id,
  //         total: orderLine.price * orderLine.quantity,
  //         status: "pending",
  //         order_lines: [{ id: orderLine.id }]
  //       }
  //     });
  //   } else {
  //     // Nếu đã tồn tại đơn hàng của người dùng, chọn đơn hàng đầu tiên và cập nhật total và thêm order_line vào
  //     order = orders[0];
  //     order.total += orderLine.price * orderLine.quantity;
  //     if (!order.order_lines) {
  //       order.order_lines = [];
  //     }
  //     order.order_lines.push({ id: orderLine.id });

  //     // Cập nhật đơn hàng
  //     order = await strapi.entityService.update('api::order.order', order.id, {
  //       data: {
  //         total: order.total,
  //         order_lines: order.order_lines
  //       }
  //     });
  //   }

  //   return { data: order };
  // },
  // async create(ctx) {
  //   const { body } = ctx.request;
  //   const orderLine = await strapi.entityService.create('api::order-line.order-line', {
  //     data: {
  //       user: ctx.state.user.id,
  //       quantity: body.data.quantity,
  //       price: body.data.price,
  //       product_item: body.data.product_item
  //     },

  //   });
  //   const userAddress = await strapi.entityService.findMany('api::user-address.user-address', {
  //     filters: {
  //       user: ctx.state.user.id
  //     },
  //     sort: ["createdAt:desc"],
  //     limit: 1
  //   });
  //   const latestAddressId = userAddress[0].id;
  // const Order = await strapi.entityService.create('api::order.order', {
  //   data: {
  //     user: ctx.state.user.id,
  //     total: orderLine.price * orderLine.quantity,
  //     status: "pending",
  //     order_lines: [{ id: orderLine.id }],
  //     user_address: latestAddressId

  //   }
  // });

  //   return { data: orderLine };
  // }
}));
