export const ORDERS_DB_NAME="tStroreOrdersDB"

export const CANCELLED = 'cancelled'
export const CREATED = 'created'
export const SHIPPED = 'shipped'
export const OUT_FOR_DELIVERY = 'out for delivery'
export const DELIVERED = 'delivered'
export const RETURENED = 'returned'
export const REFUNDED  = 'refunded'
export const IN_TRANSIST = 'in transit'
export const PARTIALLY_SHIPPED = 'partially shipped'
export const ON_HOLD = 'on hold'
export const ORDER_STATUS_ENUM = [
    CREATED, CANCELLED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED,
    RETURENED, REFUNDED, IN_TRANSIST, PARTIALLY_SHIPPED, ON_HOLD
]