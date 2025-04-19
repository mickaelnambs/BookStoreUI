import { Component, inject } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-filter-dialog',
    standalone: true,
    imports: [
        MatDivider,
        MatListOption,
        MatSelectionList,
        MatButton,
        FormsModule
    ],
    templateUrl: './filters-dialog.component.html',
    styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
    shopService = inject(ShopService);
    private dialogRef = inject(MatDialogRef<FiltersDialogComponent>);
    data = inject(MAT_DIALOG_DATA);

    selectedGenres: string[] = this.data.selectedGenres;
    selectedPublishers: string[] = this.data.selectedPublishers;

    applyFilters() {
        this.dialogRef.close({
            selectedGenres: this.selectedGenres,
            selectedPublishers: this.selectedPublishers
        })
    }
}
