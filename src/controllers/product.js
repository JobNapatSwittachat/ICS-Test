const db = require("../db/mysqlDB");

const sqlFilter = (filter = {}) => {
  const color = filter.color ? `'${filter.color}'` : null;
  const pattern = filter.pattern ? `'${filter.pattern}'` : null;
  const figure = filter.figure ? `'${filter.figure}'` : null;
  const size = filter.size ? `'${filter.size}'` : null;
  const sex = filter.sex ? `'${filter.sex}'` : null;

  const sql = `where (color = ${color} or ${color} is null) 
  and (pattern = ${pattern} or ${pattern} is null) 
  and (figure = ${figure} or ${figure} is null)
  and (size = ${size} or ${size} is null)
  and (sex = ${sex} or ${sex} is null)`;

  return sql;
};

const productController = {
  get: (req, res) => {
    db.query(`select * from product`, (error, results, fields) => {
      if (error) throw error;
      return res.json(results);
    });
  },
  filter: (req, res) => {
    let sql =
      "SELECT *,(SELECT COUNT(pd.id) FROM product pd) AS total FROM product";
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
    const { color, pattern, figure, size, sex } = req.body;
    const maxPrice = 1000;
    const minPrice = 100;
    const price =
      Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

    db.query(
      `insert into product (color,pattern,figure,${`size`},sex,price) value (${color},${pattern},${figure},${size},${sex},${price})`,
      (err) => {
        if (err) throw err;
        res.status(200).send("Create product");
      }
    );
  },
  update: (req, res) => {
    const { product_id } = req.params;
    const { color, pattern, figure, size, sex, price } = req.body;

    // db.query(`select id from product where id = ${product_id}`, (err, e) => {
    //   if (e.length === 0) {
    //     return res.status(404).send("Not found");
    //   }
    // });

    db.query(
      `update product set color=${color},pattern='${pattern}',figure='${figure}',size='${size}',sex='${sex}',price='${price}' where id =${product_id}`,
      (err) => {
        if (err) throw err;
        res.status(200).send("Update product");
      }
    );
  },
  delete: (req, res) => {
    const { product_id } = req.params;

    // db.query(`select id from product where id = ${product_id}`, (err, e) => {
    //   if (e.length === 0) {
    //     return res.status(404).send("Not found");
    //   }
    // });

    db.query(`delete from product where id=${product_id}`, (err) => {
      if (err) throw err;
      res.status(200).send("Delete product");
    });
  }
};

module.exports = productController;
