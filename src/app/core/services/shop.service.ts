import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { Book } from '../../shared/models/book';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);
    genres: string[] = [];
    publishers: string[] = [];

    getBooks(shopParams: ShopParams) {
        let params = new HttpParams();

        if (shopParams.genres.length > 0) {
            params = params.append('genres', shopParams.genres.join(','));
        }

        if (shopParams.publishers.length > 0) {
            params = params.append('publishers', shopParams.publishers.join(','));
        }

        if (shopParams.sort) {
            params = params.append('sort', shopParams.sort);
        }

        if (shopParams.search) {
            params = params.append('search', shopParams.search);
        }

        params = params.append('pageSize', shopParams.pageSize);
        params = params.append('pageIndex', shopParams.pageNumber);

        return this.http.get<Pagination<Book>>(this.baseUrl + 'books', {params});
    }

    getBook(id: number) {
        return this.http.get<Book>(this.baseUrl + 'books/' + id);
    }

    getGenres() {
        if (this.genres.length > 0) return;
        return this.http.get<string[]>(this.baseUrl + 'books/genres').subscribe({
            next: response => this.genres = response
        })
    }

    getPublishers() {
        if (this.publishers.length > 0) return;
        return this.http.get<string[]>(this.baseUrl + 'books/publishers').subscribe({
            next: response => this.publishers = response
        })
    }
}
