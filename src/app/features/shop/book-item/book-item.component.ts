import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Book } from '../../../shared/models/book';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-book-item',
    standalone: true,
    imports: [
        MatCard,
        MatCardContent,
        CurrencyPipe,
        MatCardActions,
        MatButton,
        MatIcon,
        RouterLink
    ],
    templateUrl: './book-item.component.html',
    styleUrl: './book-item.component.scss'
})
export class BookItemComponent {
    @Input() book?: Book;
    cartService = inject(CartService);
}
