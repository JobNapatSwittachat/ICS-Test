const db = require("../db/mysqlDB");

const mockUser = "JOB";

const cartController = {
  create: (req, res) => {
    const product = req.body;
    const { product_id } = product;

    db.query(
      `insert into cart (user) value ('${mockUser}')`,
      (error, results, fields) => {
        if (error) throw error;
        const { insertId: cart_id } = results;

        db.query(
          `insert into cart_item (cart_id,product_id) value ('${cart_id}','${product_id}')`,
          (err) => {
            if (err) throw error;
            res.status(200).send("Add to cart");
          }
        );
      }
    );
  }
};

module.exports = cartController;
