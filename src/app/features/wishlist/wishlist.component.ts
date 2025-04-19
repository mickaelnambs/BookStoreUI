import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Book } from '../../shared/models/book';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { BusyService } from '../../core/services/busy.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [
        MatCardModule,
        MatButton,
        MatIcon,
        RouterLink,
        CurrencyPipe
    ],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
    private wishlistService = inject(WishlistService);
    private cartService = inject(CartService);
    private snackService = inject(SnackbarService);
    busyService = inject(BusyService);
    wishlistBooks: Book[] = [];

    ngOnInit(): void {
        this.loadWishlist();
    }

    loadWishlist(): void {
        this.busyService.busy();
        this.wishlistService.getWishlist().subscribe({
            next: books => {
                this.wishlistBooks = books;
                this.busyService.idle();
            },
            error: error => {
                console.error(error);
                this.busyService.idle();
                this.snackService.error('Error loading your wishlist. Please try again.');
            }
        })
    }

    removeFromWishlist(bookId: number): void {
        this.wishlistService.removeFromWishlist(bookId).subscribe({
            next: response => {
                this.wishlistBooks = this.wishlistBooks.filter(book => book.id !== bookId);
                this.snackService.success(response.message);
            },
            error: error => {
                console.error(error);
                this.snackService.error('Error removing book from wishlist');
            }
        })
    }

    addToCart(book: Book): void {
        this.cartService.addItemToCart(book);
        this.snackService.info(`${book.title} added to cart`);
    }
}
