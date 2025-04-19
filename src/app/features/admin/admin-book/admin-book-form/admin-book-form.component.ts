import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../../core/services/admin.service';
import { ShopService } from '../../../../core/services/shop.service';
import { Book } from '../../../../shared/models/book';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
    selector: 'app-admin-book-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatDividerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        RouterLink
    ],
    templateUrl: './admin-book-form.component.html',
    styleUrl: './admin-book-form.component.scss'
})
export class AdminBookFormComponent implements OnInit {
    bookForm: FormGroup;
    isEditMode = false;
    bookId: number | null = null;
    loading = false;
    imagePreview: string | null = null;
    imageError = false;

    selectedFile: File | null = null;

    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);
    private shopService = inject(ShopService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snack = inject(SnackbarService);

    get genres(): string[] {
        return this.shopService.genres;
    }

    get publishers(): string[] {
        return this.shopService.publishers;
    }

    constructor() {
        this.bookForm = this.fb.group({
            title: ['', [Validators.required]],
            author: ['', [Validators.required]],
            isbn: ['', [
                Validators.required,
                Validators.pattern(/^(?:\d{10}|\d{13})$/)
            ]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            genre: ['', [Validators.required]],
            publisher: ['', [Validators.required]],
            quantityInStock: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.loadGenresAndPublishers();
        this.checkEditMode();
    }

    loadGenresAndPublishers(): void {
        if (this.genres.length === 0) {
            this.shopService.getGenres();
        }

        if (this.publishers.length === 0) {
            this.shopService.getPublishers();
        }
    }

    checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.isEditMode = true;
                this.bookId = +id;
                this.loadBookData(+id);
            }
        });
    }

    loadBookData(id: number): void {
        this.loading = true;
        this.adminService.getBookById(id).subscribe({
            next: (book) => {
                this.bookForm.patchValue({
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    description: book.description,
                    price: book.price,
                    genre: book.genre,
                    publisher: book.publisher,
                    quantityInStock: book.quantityInStock
                });

                this.imagePreview = book.coverImageUrl;
                this.loading = false;
            },
            error: (error) => {
                console.error(error);
                this.loading = false;
                this.snack.error('Error loading book data.');
            }
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.imageError = false;

            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    clearImage(): void {
        if (this.isEditMode) {
            this.imagePreview = null;
            this.selectedFile = null;
        } else {
            this.imageError = true;
        }
    }

    onSubmit(): void {
        if (this.bookForm.invalid) {
            this.markFormGroupTouched(this.bookForm);
            return;
        }

        if (!this.isEditMode && !this.selectedFile && !this.imagePreview) {
            this.imageError = true;
            this.snack.error('Cover image is required for new books.');
            return;
        }

        this.loading = true;

        const book: Book = {
            ...this.bookForm.value
        };

        book.id = this.isEditMode && this.bookId ? this.bookId : 0;

        if (this.isEditMode && this.imagePreview && !this.selectedFile) {
            book.coverImageUrl = this.imagePreview;
        }

        try {
            if (this.isEditMode && this.bookId) {
                this.adminService.updateBook(book, this.selectedFile).subscribe({
                    next: () => {
                        this.loading = false;
                        this.snack.success('Book updated successfully.');
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        console.error('Error updating book:', error);
                        this.loading = false;
                        this.snack.error('Error updating book.');
                    }
                });
            } else {
                if (!this.selectedFile) {
                    throw new Error('Cover image is required for new books');
                }

                this.adminService.createBook(book, this.selectedFile).subscribe({
                    next: () => {
                        this.loading = false;
                        this.snack.success('Book created successfully.');
                        this.router.navigate(['/admin']);
                    },
                    error: (error) => {
                        console.error('Error creating book:', error);
                        this.loading = false;
                    }
                });
            }
        } catch (error: any) {
            console.error('Error creating book (unhandled):', error);
            this.loading = false;
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }
}
