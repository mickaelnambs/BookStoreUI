import { Component, inject, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ShopParams } from '../../../shared/models/shopParams';
import { ShopService } from '../../../core/services/shop.service';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../../shared/models/book';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { DialogService } from '../../../core/services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewDialogComponent } from '../../../shared/components/image-preview-dialog/image-preview-dialog.component';

@Component({
    selector: 'app-admin-book',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIcon,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        CurrencyPipe,
        MatLabel,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './admin-book.component.html',
    styleUrl: './admin-book.component.scss'
})
export class AdminBookComponent implements OnInit {
    displayedColumns: string[] = ['id', 'image', 'title', 'author', 'price', 'genre', 'publisher', 'quantityInStock', 'action'];
    dataSource = new MatTableDataSource<Book>([]);
    private adminService = inject(AdminService);
    private shopService = inject(ShopService);
    private snack = inject(SnackbarService);
    private dialogService = inject(DialogService);
    dialog = inject(MatDialog);

    shopParams = new ShopParams();
    totalItems = 0;

    filterType: 'genre' | 'publisher' = 'genre';
    selectedGenre: string = 'All';
    selectedPublisher: string = 'All';

    get genres(): string[] {
        return this.shopService.genres;
    }

    get publishers(): string[] {
        return this.shopService.publishers;
    }

    ngOnInit(): void {
        this.loadFilterOptions();
        this.loadBooks();
    }

    showImagePreview(imageUrl: string, imageTitle: string) {
        this.dialog.open(ImagePreviewDialogComponent, {
            data: { imageUrl, imageTitle },
            width: '90vh',
            height: '90vh'
        });
    }

    loadFilterOptions() {
        if (this.genres.length === 0) {
            this.shopService.getGenres();
        }

        if (this.publishers.length === 0) {
            this.shopService.getPublishers();
        }
    }

    loadBooks() {
        this.adminService.getBooks(this.shopParams).subscribe({
            next: response => {
                if (response.data) {
                    this.dataSource.data = response.data;
                    this.totalItems = response.count;
                }
            }
        });
    }

    onPageChange(event: PageEvent) {
        this.shopParams.pageNumber = event.pageIndex + 1;
        this.shopParams.pageSize = event.pageSize;
        this.loadBooks();
    }

    onFilterTypeChange(type: 'genre' | 'publisher') {
        this.filterType = type;
        this.shopParams.genres = [];
        this.shopParams.publishers = [];
        this.selectedGenre = 'All';
        this.selectedPublisher = 'All';
    }

    onFilterSelect(event: MatSelectChange) {
        if (this.filterType === 'genre') {
            this.selectedGenre = event.value;
            this.shopParams.genres = event.value !== 'All' ? [event.value] : [];
            this.shopParams.publishers = [];
        } else {
            this.selectedPublisher = event.value;
            this.shopParams.publishers = event.value !== 'All' ? [event.value] : [];
            this.shopParams.genres = [];
        }

        this.shopParams.pageNumber = 1;
        this.loadBooks();
    }

    onSearchChange(searchTerm: string) {
        this.shopParams.search = searchTerm;
        this.shopParams.pageNumber = 1;
        this.loadBooks();
    }

    async confirmBookDeletion(id: number) {
        const confirmed = await this.dialogService.confirm(
            'Confirm Delete',
            'Are you sure you want to delete this book? This action cannot be undone.'
        );

        if (confirmed) {
            this.adminService.deleteBook(id).subscribe({
                next: () => {
                    this.loadBooks();
                    this.snack.success('Book deleted successfully');
                }
            });
        }
    }
}
