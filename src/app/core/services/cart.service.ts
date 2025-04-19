import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem, Coupon } from '../../shared/models/cart';
import { Book } from '../../shared/models/book';
import { map } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);
    cart = signal<Cart | null>(null);
    itemCount = computed(() => {
        return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0);
    })

    selectedDelivery = signal<DeliveryMethod | null>(null);

    totals = computed(() => {
        const cart = this.cart();
        const delivery = this.selectedDelivery();
        if (!cart) return null;
        const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountValue = 0;

        if (cart.coupon) {
            if (cart.coupon.amoutOff) {
                discountValue = cart.coupon.amoutOff;
            } else if (cart.coupon.percentOff) {
                discountValue = subtotal * (cart.coupon.percentOff / 100);
            }
        }

        const shipping = delivery ? delivery.price : 0;
        const total = subtotal + shipping - discountValue;

        return {
            subtotal,
            shipping,
            discount: discountValue,
            total
        }
    })

    getCart(id: string) {
        return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
            map(cart => {
                this.cart.set(cart);
                return cart;
            })
        )
    }

    setCart(cart: Cart) {
        return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
            next: cart => this.cart.set(cart)
        })
    }

    addItemToCart(item: CartItem | Book, quantity = 1) {
        const cart = this.cart() ?? this.createCart();
        if (this.isBook(item)) {
            item = this.mapBookToCartItem(item);
        }
        cart.items = this.addOrUpdateItem(cart.items, item, quantity);
        this.setCart(cart);
    }

    removeItemFromCart(bookId: number, quantity = 1) {
        const cart = this.cart();
        if (!cart) return;
        const index = cart.items.findIndex(x => x.bookId === bookId);
        if (index !== -1) {
            if (cart.items[index].quantity > quantity) {
                cart.items[index].quantity -= quantity;
            } else {
                cart.items.splice(index, 1);
            }

            if (cart.items.length == 0) {
                this.deleteCart();
            } else {
                this.setCart(cart);
            }
        }
    }

    deleteCart() {
        this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
            next: () => {
                localStorage.removeItem('cart_id');
                this.cart.set(null);
            }
        })
    }

    applyDiscount(code: string) {
        return this.http.get<Coupon>(this.baseUrl + 'coupons/' + code);
    }

    private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
        const index = items.findIndex(x => x.bookId === item.bookId);

        if (index === -1) {
            item.quantity = quantity;
            items.push(item);
        } else {
            items[index].quantity += quantity;
        }
        return items;
    }

    private mapBookToCartItem(item: Book): CartItem {
        return {
            bookId: item.id,
            bookTitle: item.title,
            price: item.price,
            quantity: 0,
            coverImageUrl: item.coverImageUrl,
            genre: item.genre,
            publisher: item.publisher
        }
    }

    private isBook(item: CartItem | Book): item is Book {
        return (item as Book).id !== undefined;
    }

    private createCart(): Cart {
        const cart = new Cart();
        localStorage.setItem('cart_id', cart.id);
        return cart;
    }
}
