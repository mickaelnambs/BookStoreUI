import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { OrderParams } from '../../shared/models/orderParams';
import { Order } from '../../shared/models/order';
import { BookParams } from '../../shared/models/bookParams';
import { Book } from '../../shared/models/book';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { User } from '../../shared/models/user';
import { Account } from '../../shared/models/account';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getOrders(orderParams: OrderParams) {
        let params = new HttpParams();
        if (orderParams.filter && orderParams.filter !== 'All') {
            params = params.append('status', orderParams.filter);
        }

        params = params.append('pageIndex', orderParams.pageNumber);
        params = params.append('pageSize', orderParams.pageSize);
        return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', { params });
    }

    getOrder(id: number) {
        return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id);
    }

    refundOrder(id: number) {
        return this.http.post<Order>(this.baseUrl + 'admin/orders/refund/' + id, {});
    }

    getBooks(bookParams: BookParams) {
        let params = new HttpParams();
        if (bookParams.genres.length > 0) {
            params = params.append('genres', bookParams.genres.toString());
        }
        if (bookParams.publishers.length > 0) {
            params = params.append('publishers', bookParams.publishers.toString());
        }
        if (bookParams.search) {
            params = params.append('search', bookParams.search);
        }
        if (bookParams.sort) {
            params = params.append('sort', bookParams.sort);
        }
        params = params.append('pageIndex', bookParams.pageNumber);
        params = params.append('pageSize', bookParams.pageSize);

        return this.http.get<Pagination<Book>>(this.baseUrl + 'books', { params });
    }

    getBookById(id: number) {
        return this.http.get<Book>(this.baseUrl + 'books/' + id);
    }

    createBook(book: Book, coverImage: File | null) {
        if (!coverImage) {
            throw new Error('Cover image is required.');
        }

        const formData = new FormData();

        formData.append('title', book.title);
        formData.append('author', book.author);
        formData.append('isbn', book.isbn);
        formData.append('description', book.description);
        formData.append('price', book.price.toString());
        formData.append('genre', book.genre);
        formData.append('publisher', book.publisher);
        formData.append('quantityInStock', book.quantityInStock.toString());
        formData.append('coverImageUrl', coverImage.name);

        formData.append('coverImage', coverImage, coverImage.name);

        return this.http.post<Book>(this.baseUrl + 'books', formData);
    }

    updateBook(book: Book, coverImage: File | null) {
        const formData = new FormData();

        formData.append('id', book.id.toString());
        formData.append('title', book.title);
        formData.append('author', book.author);
        formData.append('isbn', book.isbn);
        formData.append('description', book.description);
        formData.append('price', book.price.toString());
        formData.append('genre', book.genre);
        formData.append('publisher', book.publisher);
        formData.append('quantityInStock', book.quantityInStock.toString());

        if (book.coverImageUrl) {
            formData.append('coverImageUrl', book.coverImageUrl);
        } else if (coverImage) {
            formData.append('coverImageUrl', coverImage.name);
        }

        if (coverImage) {
            formData.append('coverImage', coverImage, coverImage.name);
        }

        return this.http.put<Book>(this.baseUrl + 'books/' + book.id, formData);
    }

    deleteBook(id: number) {
        return this.http.delete(this.baseUrl + 'books/' + id);
    }

    getDeliveryMethods() {
        return this.http.get<DeliveryMethod[]>(this.baseUrl + 'admin/delivery-methods');
    }

    getDeliveryMethod(id: number) {
        return this.http.get<DeliveryMethod>(this.baseUrl + 'admin/delivery-methods/' + id);
    }

    createDeliveryMethod(deliveryMethod: DeliveryMethod) {
        return this.http.post<DeliveryMethod>(this.baseUrl + 'admin/delivery-methods', deliveryMethod);
    }

    updateDeliveryMethod(deliveryMethod: DeliveryMethod) {
        return this.http.put<DeliveryMethod>(this.baseUrl + 'admin/delivery-methods/' + deliveryMethod.id, deliveryMethod);
    }

    deleteDeliveryMethod(id: number) {
        return this.http.delete(this.baseUrl + 'admin/delivery-methods/' + id);
    }

    getUsers() {
        return this.http.get<Account[]>(this.baseUrl + 'account');
    }

    lockUser(id: string, days: number = 30) {
        const params = new HttpParams().set('days', days.toString());

        return this.http.post<void>(`${this.baseUrl}account/${id}/lock`, {}, { params });
    }

    unlockUser(id: string) {
        return this.http.post<void>(`${this.baseUrl}account/${id}/unlock`, {});
    }
}
