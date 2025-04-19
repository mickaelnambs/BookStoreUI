import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../../core/services/admin.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { DeliveryMethod } from '../../../../shared/models/deliveryMethod';

@Component({
    selector: 'app-admin-delivery-method-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSnackBarModule,
        RouterLink
    ],
    templateUrl: './admin-delivery-method-form.component.html',
    styleUrl: './admin-delivery-method-form.component.scss'
})
export class AdminDeliveryMethodFormComponent implements OnInit {
    deliveryMethodForm: FormGroup;
    isEditMode = false;
    deliveryMethodId: number | null = null;
    loading = false;

    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snackBar = inject(SnackbarService);

    constructor() {
        this.deliveryMethodForm = this.fb.group({
            shortName: ['', [Validators.required]],
            deliveryTime: ['', [Validators.required]],
            description: ['', [Validators.required]],
            price: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.checkEditMode();
    }

    checkEditMode(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id && id !== 'new') {
                this.isEditMode = true;
                this.deliveryMethodId = +id;
                this.loadDeliveryMethod(+id);
            }
        });
    }

    loadDeliveryMethod(id: number): void {
        this.loading = true;
        this.adminService.getDeliveryMethod(id).subscribe({
            next: (deliveryMethod) => {
                this.deliveryMethodForm.patchValue({
                    shortName: deliveryMethod.shortName,
                    deliveryTime: deliveryMethod.deliveryTime,
                    description: deliveryMethod.description,
                    price: deliveryMethod.price
                });
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.deliveryMethodForm.invalid) {
            this.markFormGroupTouched(this.deliveryMethodForm);
            return;
        }

        this.loading = true;

        const deliveryMethod: DeliveryMethod = {
            ...this.deliveryMethodForm.value,
            id: this.isEditMode && this.deliveryMethodId ? this.deliveryMethodId : 0
        };

        if (this.isEditMode && this.deliveryMethodId) {
            this.updateDeliveryMethod(deliveryMethod);
        } else {
            this.createDeliveryMethod(deliveryMethod);
        }
    }

    createDeliveryMethod(deliveryMethod: DeliveryMethod): void {
        this.adminService.createDeliveryMethod(deliveryMethod).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.success('Delivery method created successfully');
                this.router.navigate(['/admin']);
            },
            error: (error) => {
                console.error(error);
                this.loading = false;
                this.snackBar.error('Error creating delivery method');
            }
        });
    }

    updateDeliveryMethod(deliveryMethod: DeliveryMethod): void {
        this.adminService.updateDeliveryMethod(deliveryMethod).subscribe({
            next: () => {
                this.loading = false;
                this.snackBar.success('Delivery method updated successfully');
                this.router.navigate(['/admin']);
            },
            error: (error) => {
                console.error(error);
                this.loading = false;
                this.snackBar.error('Error updating delivery method');
            }
        });
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
