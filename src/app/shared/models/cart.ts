import {nanoid} from 'nanoid';

export type CartType = {
    id: string;
    items: CartItem[];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
    coupon?: Coupon;
}

export type CartItem = {
    bookId: number;
    bookTitle: string;
    price: number;
    quantity: number;
    coverImageUrl: string;
    genre: string;
    publisher: string;
}


export class Cart implements CartType {
    id = nanoid();
    items: CartItem[] = [];
    deliveryMethodId?: number;
    paymentIntentId?: string;
    clientSecret?: string;
    coupon?: Coupon;
}

export type Coupon = {
    name: string;
    amoutOff?: number;
    percentOff?: number;
    promotionCode: string;
    couponId: string;
}
