import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCard,
        MatButton,
        MatIcon,
        RouterLink,
        MatButton,
        TextInputComponent
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private snack = inject(SnackbarService);
    private router = inject(Router);
    validationErrors?: string[];

    registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    onSubmit() {
        this.accountService.register(this.registerForm.value).subscribe({
            next: () => {
                this.snack.success('Registration successfull - you can now login');
                this.router.navigateByUrl('/account/login');
            },
            error: errors => this.validationErrors = errors
        })
    }
}
