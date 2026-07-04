import {
  ACTIVE_TRACKING_ORDER_STATUSES,
  NON_CANCELLABLE_ORDER_STATUSES,
} from "../constants";

const normalizeStatus = (status) => status?.toUpperCase?.() || "";

export const normalizeOrderForList = (order) => {
  if (!order) return null;

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let formattedDate;

  // Check if it's today
  if (orderDate.toDateString() === today.toDateString()) {
    formattedDate = "Today";
  }
  // Check if it's yesterday
  else if (orderDate.toDateString() === yesterday.toDateString()) {
    formattedDate = "Yesterday";
  }
  // Otherwise format as full date
  else {
    const isDifferentYear = orderDate.getFullYear() !== today.getFullYear();
    formattedDate = orderDate.toLocaleDateString("en-US", {
      year: isDifferentYear ? "numeric" : undefined,
      month: "long",
      day: "numeric",
    });
  }

  return {
    ...order,
    date: order.date || formattedDate,
    status: order.status || "PENDING",
    totalPrice: order.totalPrice ?? order.totalAmount,
  };
};

export const mergeOrdersWithLastOrder = (apiOrders = [], lastOrder) => {
  const mergedList = apiOrders.map(normalizeOrderForList);

  if (
    lastOrder &&
    !mergedList.some((order) => String(order.id) === String(lastOrder.id))
  ) {
    mergedList.unshift(normalizeOrderForList(lastOrder));
  }

  // Sort newest-first by actual timestamp, regardless of API/mock order
  return mergedList.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};
export const groupOrdersByDate = (orders = []) =>
  orders.reduce((acc, order) => {
    // Prefer the already-computed date label (e.g. "Today" / "Yesterday"
    // from normalizeOrderForList). Only fall back to reformatting
    // createdAt if no date label exists at all.
    const dateLabel = order.date
      ? order.date
      : order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })
        : "Past Orders";

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

export const formatOrderTime = (timestamp, fallback = "-") => {
  if (!timestamp) return fallback;
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch (e) {
    console.error("Error formatting time:", e);
    return fallback;
  }
};