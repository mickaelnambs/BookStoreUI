import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';
import { CurrencyPipe } from '@angular/common';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
    selector: 'app-admin-delivery-method',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatCardModule,
        MatSnackBarModule,
        RouterLink,
        CurrencyPipe,
    ],
    templateUrl: './admin-delivery-method.component.html',
    styleUrl: './admin-delivery-method.component.scss',
})
export class AdminDeliveryMethodComponent implements OnInit {
    private adminService = inject(AdminService);
    private snackBar = inject(SnackbarService);
    private dialogService = inject(DialogService);
    displayedColumns: string[] = [
        'id',
        'shortName',
        'deliveryTime',
        'description',
        'price',
        'actions',
    ];
    dataSource = new MatTableDataSource<DeliveryMethod>([]);
    loading = false; // You can use @Defer in html to show a spinner while loading

    ngOnInit(): void {
        this.loadDeliveryMethods();
    }

    loadDeliveryMethods(): void {
        this.loading = true;
        this.adminService.getDeliveryMethods().subscribe({
            next: (deliveryMethods) => {
                this.dataSource.data = deliveryMethods;
                this.loading = false;
            },
        });
    }

    async confirmDeliveryMethodDeletion(id: number) {
        const confirmed = await this.dialogService.confirm(
            'Confirm Deletion',
            'Are you sure you want to delete this delivery method? This action cannot be undone.'
        );
        if (confirmed) {
            this.adminService.deleteDeliveryMethod(id).subscribe({
                next: () => {
                    this.snackBar.success(
                        'Delivery method deleted successfully'
                    );
                    this.loadDeliveryMethods();
                },
            });
        }
    }
}
