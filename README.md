# ICS-Test

## LIST API
### Product
API | Endpoint | Methods |
--- | --- | --- |
Product | http://localhost:3006/ics/products | GET |
Product | http://localhost:3006/ics/product? | GET |
Product | http://localhost:3006/ics/product | POST |
Product | http://localhost:3006/ics/product/:product_id | PUT |
Product | http://localhost:3006/ics/product/:product_id | DELETE |
### Order
API | Endpoint | Methods |
--- | --- | --- |
Order | http://localhost:3006/ics/orders? | GET |
Order | http://localhost:3006/ics/order | POST |
Order | http://localhost:3006/ics/order/:order_id | PUT |
Order | http://localhost:3006/ics/order/:order_id | DELETE |
### Cart
API | Endpoint | Methods |
--- | --- | --- |
Cart | http://localhost:3006/ics/cart | POST |

## Database
**Run to local**
### Design
![image](https://user-images.githubusercontent.com/89995030/167252698-ed3c5488-45cd-404c-865b-99ba68285ce6.png)

### Export
* CREATE TABLE `order` (
  `id` int,
  `user` varchar(255),
  `address` json,
  `total_price` varchar(255),
  `status_order` varchar(255),
  `order_completed_date` datetime,
  `created_at` timestamp,
  `updated_at` datetime
);

* CREATE TABLE `product` (
  `id` int,
  `color` varchar(255),
  `pattern` varchar(255),
  `figure` varchar(255),
  `size` varchar(255),
  `sex` int,
  `price` varchar(255)
);

* CREATE TABLE `cart` (
  `id` int,
  `user` varchar(255)
);

* CREATE TABLE `orders_item` (
  `id` int,
  `order_id` int,
  `product_id` int,
  `price` varchar(255),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`id`),
  FOREIGN KEY (`order_id`) REFERENCES `order`(`id`)
);

* CREATE TABLE `cart_item` (
  `id` int,
  `cart_id` int,
  `product_id` int,
  FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`id`)
);

## Config
**Set in file `config.js`**

## Postman Collection
**In file `isc.postman_collection.json`**
