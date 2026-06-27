import {
  ACTIVE_TRACKING_ORDER_STATUSES,
  NON_CANCELLABLE_ORDER_STATUSES,
} from "../constants";

const normalizeStatus = (status) => status?.toUpperCase?.() || "";

export const normalizeOrderForList = (order) => {
  if (!order) return null;

  return {
    ...order,
    date: order.date || "Today",
    status: order.status || "PENDING",
    totalPrice: order.totalPrice ?? order.totalAmount,
  };
};

export const mergeOrdersWithLastOrder = (apiOrders = [], lastOrder) => {
  const mergedList = [...apiOrders];
  
  if (
    lastOrder &&
    !mergedList.some((order) => String(order.id) === String(lastOrder.id))
  ) {
    mergedList.unshift(normalizeOrderForList(lastOrder));
  }

  return mergedList;
};

export const groupOrdersByDate = (orders = []) =>
  orders.reduce((acc, order) => {
    const dateLabel = order.date || "Past Orders";
    acc[dateLabel] = acc[dateLabel] || [];
    acc[dateLabel].push(order);
    return acc;
  }, {});

export const pickTrackingOrder = (orders = [], lastOrder) => {
  const activeOrder = orders.find((order) =>
    ACTIVE_TRACKING_ORDER_STATUSES.includes(normalizeStatus(order.status))
  );

  return activeOrder || lastOrder || orders[0] || null;
};

export const isOrderCancellable = (order) => {
  if (!order) return false;
  return !NON_CANCELLABLE_ORDER_STATUSES.includes(normalizeStatus(order.status));
};
