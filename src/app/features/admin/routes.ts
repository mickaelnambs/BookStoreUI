import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { AdminBookFormComponent } from "./admin-book/admin-book-form/admin-book-form.component";
import { AdminBookDetailsComponent } from "./admin-book/admin-book-details/admin-book-details.component";
import { AdminDeliveryMethodFormComponent } from "./admin-delivery-method/admin-delivery-method-form/admin-delivery-method-form.component";
import { authGuard } from "../../core/guards/auth.guard";
import { adminGuard } from "../../core/guards/admin.guard";

export const adminRoutes: Route[] = [
    { path: '', component: AdminComponent, canActivate: [authGuard, adminGuard] },
    { path: 'books/new', component: AdminBookFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'books/edit/:id', component: AdminBookFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'books/:id', component: AdminBookDetailsComponent, canActivate: [authGuard, adminGuard] },
    { path: 'delivery-methods/new', component: AdminDeliveryMethodFormComponent, canActivate: [authGuard, adminGuard] },
    { path: 'delivery-methods/edit/:id', component: AdminDeliveryMethodFormComponent, canActivate: [authGuard, adminGuard] }
]
