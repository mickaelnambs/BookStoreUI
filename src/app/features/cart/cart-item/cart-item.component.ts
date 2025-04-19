import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../shared/models/cart';
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-cart-item',
    standalone: true,
    imports: [
        RouterLink,
        MatButton,
        MatIcon,
        CurrencyPipe
    ],
    templateUrl: './cart-item.component.html',
    styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
    item = input.required<CartItem>();
    cartService = inject(CartService);

    incrementQuantity() {
        this.cartService.addItemToCart(this.item());
    }

    decrementQuantity() {
        this.cartService.removeItemFromCart(this.item().bookId);
    }

    removeItemFromCart() {
        this.cartService.removeItemFromCart(this.item().bookId, this.item().quantity);
    }
}
