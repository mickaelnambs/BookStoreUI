import { Component, inject, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Order } from '../../../shared/models/order';
import { AdminService } from '../../../core/services/admin.service';
import { OrderParams } from '../../../shared/models/orderParams';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
    selector: 'app-admin-order',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIcon,
        MatSelectModule,
        DatePipe,
        CurrencyPipe,
        MatLabel,
        MatTooltipModule,
        MatTabsModule,
        RouterLink
    ],
    templateUrl: './admin-order.component.html',
    styleUrl: './admin-order.component.scss'
})
export class AdminOrderComponent implements OnInit {
    displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate', 'total', 'status', 'action'];
    dataSource = new MatTableDataSource<Order>([]);
    private adminService = inject(AdminService);
    private dialogService = inject(DialogService);

    orderParams = new OrderParams;
    totalItems = 0;

    statusOptions = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];

    ngOnInit(): void {
        this.loadOrders();
    }

    async openConfirmationDialog(id: number) {
        const confirmed = await this.dialogService.confirm(
            'Confirm Refund',
            'Are you sure you want to refund this order? This action cannot be undone.'
        );

        if (confirmed) this.refundOrder(id);
    }

    loadOrders() {
        this.adminService.getOrders(this.orderParams).subscribe({
            next: response => {
                if (response.data) {
                    this.dataSource.data = response.data;
                    this.totalItems = response.count;
                }
            }
        })
    }

    refundOrder(id: number) {
        this.adminService.refundOrder(id).subscribe({
            next: order => {
                this.dataSource.data = this.dataSource.data.map(o => o.id === id ? order : o)
            }
        })
    }

    onPageChange(event: PageEvent) {
        this.orderParams.pageNumber = event.pageIndex + 1;
        this.orderParams.pageSize = event.pageSize;
        this.loadOrders();
    }

    onFilterSelect(event: MatSelectChange) {
        this.orderParams.filter = event.value;
        this.orderParams.pageNumber = 1;
        this.loadOrders();
    }
}
