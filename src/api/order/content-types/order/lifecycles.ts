export default {
  async afterCreate(event, ctx) {
    const { result } = event;
    const findOrderlines = await strapi.entityService.findOne("api::order.order", result.id, {
      populate: {
        order_lines: {
          populate: {
            product_item: {
              fields: ["id", "quantity"],
            },
          },
        },
      },
    });
    for (const order_lines of findOrderlines.order_lines) {
      const findProduct_item = await strapi.entityService.findOne(
        "api::product-item.product-item",
        order_lines.product_item.id,
        {
          populate: {
            carts: {
              fields: ["id"]
            }
          },
        },
      );
      for (const carts of findProduct_item.carts) {
        await strapi.entityService.delete("api::cart.cart", carts.id)
      }
    }

  },
  async afterUpdate(event) {
    const { result } = event;
    if (result.status === "shipped") {
      const findOrderlines = await strapi.entityService.findOne("api::order.order", result.id, {
        populate: {
          order_lines: {
            populate: {
              product_item: {
                fields: ["id", "quantity"],
              },
            },
          },
        },
      });
      for (const order_lines of findOrderlines.order_lines) {
        const findProduct_item = await strapi.entityService.findOne(
          "api::product-item.product-item",
          order_lines.product_item.id,
          {
            fields: ["price"],
            populate: {
              product_merchants: {
                fields: ["quantity"],
              },
            },
          },
        );

        for (const pr of findProduct_item.product_merchants) {
          const product_merchant = await strapi.entityService.findOne(
            "api::product-merchant.product-merchant",
            pr.id,
            {
              fields: ["quantity"],
            },
          );

          findProduct_item.product_merchants.sort((a, b) => b.quantity - a.quantity);
          const maxQuantityMerchant = findProduct_item.product_merchants[0];
          if (maxQuantityMerchant.quantity >= order_lines.quantity) {
            await strapi.entityService.update(
              "api::product-merchant.product-merchant",
              maxQuantityMerchant.id,
              {
                data: {
                  quantity: maxQuantityMerchant.quantity - order_lines.quantity,
                },
              }
            );
          } else {
            throw new Error('Not enough quantity to ship');
          }

        }
      };

    }

  },
};
