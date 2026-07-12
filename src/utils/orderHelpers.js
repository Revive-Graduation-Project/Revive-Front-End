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
  if (activeOrder) return activeOrder;

  if (lastOrder && ACTIVE_TRACKING_ORDER_STATUSES.includes(normalizeStatus(lastOrder.status))) {
    return lastOrder;
  }

  return null;
};

export const isOrderCancellable = (order) => {
  if (!order) return false;
  return !NON_CANCELLABLE_ORDER_STATUSES.includes(normalizeStatus(order.status));
};

export const parseTimestamp = (val) => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (Array.isArray(val)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = val;
    return new Date(year, month - 1, day, hour, minute, second);
  }
  if (typeof val === "string" && /^\d{1,2}:\d{2}(:\d{2})?$/.test(val)) {
    const [h, m] = val.split(":").map(Number);
    const now = new Date();
    now.setHours(h, m, 0, 0);
    return now;
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? null : date;
};

export const formatOrderTime = (timestamp, fallback = "-") => {
  const date = parseTimestamp(timestamp);
  if (!date) return fallback;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

export const formatOrderDate = (timestamp, fallback = "-") => {
  const date = parseTimestamp(timestamp);
  if (!date) return fallback;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
