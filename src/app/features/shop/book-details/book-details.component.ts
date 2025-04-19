import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../shared/models/book';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AccountService } from '../../../core/services/account.service';

@Component({
    selector: 'app-book-details',
    standalone: true,
    imports: [
        CurrencyPipe,
        MatButton,
        MatIcon,
        MatFormField,
        MatInput,
        MatLabel,
        MatDivider,
        FormsModule,
        NgIf
    ],
    templateUrl: './book-details.component.html',
    styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
    private shopService = inject(ShopService);
    private activatedRoute = inject(ActivatedRoute);
    private cartService = inject(CartService);
    private wishlistService = inject(WishlistService);
    private snackService = inject(SnackbarService);
    private accountService = inject(AccountService);
    book?: Book;
    quantityInCart = 0;
    quantity = 1;
    isInWishlist = false;

    ngOnInit(): void {
        this.loadBook();
    }

    loadBook() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) return;
        this.shopService.getBook(+id).subscribe({
            next: book => {
                this.book = book;
                if (this.accountService.currentUser()) {
                    this.checkIfBookInWishlist();
                }
                this.updateQuantityInCart();
            },
            error: error => console.log(error)
        });
    }

    updateCart() {
        if (!this.book) return;
        if (this.quantity > this.quantityInCart) {
            const itemsToAdd = this.quantity - this.quantityInCart;
            this.quantityInCart += itemsToAdd;
            this.cartService.addItemToCart(this.book, itemsToAdd);
        } else {
            const itemsToRemove = this.quantityInCart - this.quantity;
            this.quantityInCart -= itemsToRemove;
            this.cartService.removeItemFromCart(this.book.id, itemsToRemove);
        }
    }

    updateQuantityInCart() {
        this.quantityInCart = this.cartService.cart()?.items
            .find(x => x.bookId === this.book?.id)?.quantity || 0;
        this.quantity = this.quantityInCart || 1;
    }

    getButtonText() {
        return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
    }

    checkIfBookInWishlist() {
        if (!this.book) return;
        this.wishlistService.checkBookInWishlist(this.book.id).subscribe({
            next: result => this.isInWishlist = result
        })
    }

    addToWishlist() {
        if (!this.book) return;

        if (!this.accountService.currentUser()) {
            this.snackService.info('You must be logged in to add books to wishlist');
            return;
        }

        this.wishlistService.addToWishlist(this.book.id).subscribe({
            next: response => {
                this.isInWishlist = true;
                this.snackService.success(response.message);
            }
        })
    }
}
