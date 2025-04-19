import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { BookDetailsComponent } from './features/shop/book-details/book-details.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { CartComponent } from './features/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';
import { WishlistComponent } from './features/wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:id', component: BookDetailsComponent },
    { path: 'cart', component: CartComponent },
    {
        path: 'checkout', loadChildren: () => import('./features/checkout/routes')
            .then(r => r.checkoutRoutes)
    },
    {
        path: 'orders', loadChildren: () => import('./features/orders/routes')
            .then(r => r.orderRoutes)
    },
    { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard] },
    {
        path: 'account', loadChildren: () => import('./features/account/routes')
            .then(r => r.accountRoutes)
    },
    {
        path: 'admin', loadChildren: () => import('./features/admin/routes')
            .then(r => r.adminRoutes)
    },
    { path: '**', component: NotFoundComponent }
];
