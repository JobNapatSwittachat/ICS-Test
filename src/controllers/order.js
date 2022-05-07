const db = require("../db/mysqlDB");
const _ = require("lodash");

const mockUser = "JOB";

const sqlFilter = (filter = {}) => {
  let sql = ``;
  const start_date = `'${filter.start_date}'`;
  const end_date = `'${filter.end_date}'`;
  const status_order = filter.status_order ? `'${filter.status_order}'` : null;

  sql = `where (status_order = ${status_order} or ${status_order} is null)`;

  if (start_date.length > 2 && end_date.length > 2) {
    sql = `where (status_order = ${status_order} or ${status_order} is null) 
    and order_completed_date between ${start_date} and ${end_date}`;
    // Order complete use order_completed_date
    // But
    // Order start use created_at
  }

  return sql;
};

const orderController = {
  getOrder: (req, res) => {
    let sql =
      "SELECT *,(SELECT COUNT(ods.id) FROM orders ods) AS total FROM orders";
    let perPage = req.query.perPage || 2;
    let page = req.query.page || 1;
    let offset = 0;
    let total = 0;

    const filter = req.body;
    if (Object.keys(filter).length !== 0) sql = `${sql} ${sqlFilter(filter)}`;

    offset = (page - 1) * perPage;
    sql = `${sql} LIMIT ${offset},${perPage}`;

    db.query(sql, (error, results, fields) => {
      if (error) throw error;

      total = results.length;
      if (page && total > 0) total = results[0].total;
      const result = {
        total: total,
        current_page: page,
        total_page: Math.ceil(total / perPage),
        data: results
      };
      return res.json(result);
    });
  },
  create: (req, res) => {
    let { cart_id, address } = req.body;

    db.query(
      `select
          c.id,
          c.user,
          pd.price,
          pd.id
       from
          cart c
          inner join cart_item ci on c.id = ci.cart_id
          inner join product pd on ci.product_id = pd.id
       where
          user = '${mockUser}'`,
      (err, result) => {
        if (err) throw err;

        const total_price = result
          .map((e) => parseInt(e.price))
          .reduce((prev, curr) => prev + curr, 0);
        address = JSON.stringify(address);

        if (result.length !== 0) {
          db.query(
            `insert into orders (user,address,total_price) value ('${mockUser}','${address}','${total_price}')`,
            (err, orderResult) => {
              if (err) throw err;
              const { insertId: order_id } = orderResult;

              result.forEach((e) => {
                db.query(
                  `insert into orders_item (order_id,product_id,price) value ('${order_id}','${e.id}','${e.price}')`,
                  (err, e) => {
                    if (err) throw err;
                  }
                );
              });
            }
          );

          db.query(`delete from cart where id=${cart_id}`, (err) => {
            if (err) throw err;
          });
        }

        res.status(200).send("Order complete");
      }
    );
  },
  completeOrder: (req, res) => {
    const { order_id } = req.params;
    if (!order_id) return res.status(404);

    const today = new Date().toISOString().slice(0, 10);

    // db.query(`select id from orders where id = ${order_id}`, (err, e) => {
    //   if (e.length === 0) {
    //     return res.status(404).send("Not found");
    //   }
    // });

    db.query(
      `update orders set status_order='done',order_completed_date='${today} from where id = ${order_id}'`,
      (err) => {
        if (err) throw err;
        res.status(200).send(`Order completed`);
      }
    );
  },
  delete: (req, res) => {
    const { order_id } = req.params;
    if (!order_id) return res.status(404);

    // db.query(`select id from orders where id = ${order_id}`, (err, e) => {
    //   if (e.length === 0) {
    //     return res.status(404).send("Not found");
    //   }
    // });

    db.query(`delete from orders where id=${order_id}`, (err) => {
      if (err) throw err;
      res.status(200).send("Delete order");
    });
  }
};

module.exports = orderController;
