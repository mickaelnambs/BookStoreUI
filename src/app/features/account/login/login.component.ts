import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCard,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
        MatIcon,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    returnUrl = '/shop';

    constructor() {
        const url = this.activatedRoute.snapshot.queryParams['returnUrl'];
        if (url) this.returnUrl = url;
    }

    loginForm = this.fb.group({
        email: [''],
        password: ['']
    });

    onSubmit() {
        this.accountService.login(this.loginForm.value).subscribe({
            next: () => {
                this.accountService.getUserInfo().subscribe();
                this.router.navigateByUrl(this.returnUrl);
            }
        })
    }
}
