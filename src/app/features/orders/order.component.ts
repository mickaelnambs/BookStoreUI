import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../shared/models/order';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
    private orderService = inject(OrderService);
    orders$: Observable<Order[]> = this.orderService.getOrdersForUser();

    ngOnInit(): void {
        // this.orderService.getOrdersForUser().subscribe({
        //     next: orders => this.orders = orders
        // });
    }
}
