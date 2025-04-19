import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin.service';
import { Account } from '../../../shared/models/account';
import { DialogService } from '../../../core/services/dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    templateUrl: './admin-users.component.html',
    styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
    private adminService = inject(AdminService);
    private snackBar = inject(MatSnackBar);
    private dialogService = inject(DialogService);
    private snackService = inject(SnackbarService);
    displayedColumns: string[] = ['id', 'email', 'firstName', 'lastName', 'status', 'actions'];
    dataSource = new MatTableDataSource<Account>([]);
    loading = false;

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.adminService.getUsers().subscribe({
            next: (users) => {
                this.dataSource.data = users;
                this.loading = false;
            }
        });
    }

    lockUser(id: string): void {
        const days = prompt('Lock user for how many days?', '30');
        if (days === null) return;

        const lockDays = parseInt(days, 10);
        if (isNaN(lockDays) || lockDays <= 0) {
            this.snackBar.open('Please enter a valid number of days', 'Close', { duration: 3000 });
            return;
        }

        this.adminService.lockUser(id, lockDays).subscribe({
            next: () => {
                this.snackService.success(`User locked for ${lockDays} days`);
                this.loadUsers();
            },
            error: (error) => {
                console.error(error);
                this.snackService.error('Error locking user');
            }
        });
    }

    async unlockUser(id: string) {
        const confirmed = await this.dialogService.confirm(
            'Unlock User',
            'Are you sure you want to unlock this user?'
        );

        if (!confirmed) return;

        this.adminService.unlockUser(id).subscribe({
            next: () => {
                this.snackService.success('User unlocked successfully');
                this.loadUsers();
            },
            error: (error) => {
                console.error(error);
                this.snackService.error('Error unlocking user');
            }
        });
    }

    isUserLocked(user: Account): boolean {
        if (!user.lockoutEnd) return false;
        return new Date(user.lockoutEnd) > new Date();
    }

    getUserStatus(user: Account): string {
        return this.isUserLocked(user) ? 'Locked' : 'Active';
    }
}
