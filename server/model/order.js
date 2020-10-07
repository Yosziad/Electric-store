const utils = require('../utils/utils');

const ordersList = [];

const getAllOrders = () => (ordersList);

const getOrder = (id) => {
  if (ordersList.some((e) => e.id === id)) {
    return ordersList.find((order) => order.id === id);
  }
  return false;
};

const createOrder = (order) => {
  const id = utils.idGenerator.generateId();
  ordersList.push({ ...order, id });
};

const getOrdersByUsername = (username) => {
  if (ordersList.some((e) => e.userName === username)) {
    const usersOrders = ordersList.filter((order) => order.userName === username);
    usersOrders.sort((a, b) => (b.date - a.date));
    return usersOrders;
  }
  return false;
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  getOrdersByUsername,
};
