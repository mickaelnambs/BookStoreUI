export interface Order {
    id: number
    orderDate: string
    buyerEmail: string
    shippingAddress: ShippingAddress
    deliveryMethod: string
    shippingPrice: number
    paymentSummary: PaymentSummary
    orderItems: OrderItem[]
    subtotal: number
    discount?: number;
    status: string
    total: number
    paymentIntentId: string
}

export interface ShippingAddress {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
}

export interface PaymentSummary {
    last4: number
    brand: string
    expMonth: number
    expYear: number
}

export interface OrderItem {
    bookId: number
    bookTitle: string
    coverImageUrl: string
    price: number
    quantity: number
}

export interface OrderToCreate {
    cartId: string;
    deliveryMethodId: number;
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
    discount?: number;
}
