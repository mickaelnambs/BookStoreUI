import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        MatIcon,
        MatButton,
        RouterLink,
        RouterLinkActive,
        NgClass,
        MatProgressBar,
        MatMenu,
        MatMenuItem,
        MatDivider,
        MatMenuTrigger,
        IsAdminDirective
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    mobileMenuOpen = false;
    busyService = inject(BusyService);
    cartService = inject(CartService);
    accountService = inject(AccountService);
    private router = inject(Router);

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    logout() {
        this.accountService.logout().subscribe({
            next: () => {
                this.accountService.currentUser.set(null);
                this.router.navigateByUrl('/');
            }
        })
    }
}
