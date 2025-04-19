import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../shared/models/book';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getWishlist() {
        return this.http.get<Book[]>(this.baseUrl + 'wishlists');
    }

    addToWishlist(bookId: number) {
        return this.http.post<{message: string}>(this.baseUrl + 'wishlists/' + bookId, {});
    }

    removeFromWishlist(bookId: number) {
        return this.http.delete<{message: string}>(this.baseUrl + 'wishlists/' + bookId);
    }

    checkBookInWishlist(bookId: number) {
        return this.http.get<boolean>(this.baseUrl + 'wishlists/contains/' + bookId);
    }
}
