import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../../../shared/models/book';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { switchMap } from 'rxjs';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
    selector: 'app-admin-book-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatTooltipModule,
        RouterLink
      ],
    templateUrl: './admin-book-details.component.html',
    styleUrl: './admin-book-details.component.scss'
})
export class AdminBookDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private adminService = inject(AdminService);
    private snack = inject(SnackbarService);
    private dialogService = inject(DialogService);
    book: Book | null = null;
    loading = true;
    error = false;


    ngOnInit(): void {
        this.loadBook();
    }

    loadBook(): void {
        this.route.paramMap.pipe(
            switchMap(params => {
                const id = Number(params.get('id'));
                if (isNaN(id)) {
                    throw new Error('Invalid book ID');
                }
                return this.adminService.getBookById(id);
            })
        ).subscribe({
            next: (book) => {
                this.book = book;
                this.loading = false;
            },
            error: (error) => {
                console.error(error);
                this.error = true;
                this.loading = false;
            }
        });
    }

    async confirmBookDeletion(id: number) {
        const confirmed = await this.dialogService.confirm(
            'Confirm Delete',
            'Are you sure you want to delete this book? This action cannot be undone.'
        );

        if (confirmed) {
            this.adminService.deleteBook(id).subscribe({
                next: () => {
                    this.router.navigateByUrl('/admin');
                    this.snack.success('Book deleted successfully');
                }
            });
        }
    }
}
