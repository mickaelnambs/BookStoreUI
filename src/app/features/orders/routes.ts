import { Route } from "@angular/router";
import { OrderComponent } from "./order.component";
import { OrderDetailedComponent } from "./order-detailed/order-detailed.component";
import { authGuard } from "../../core/guards/auth.guard";

export const orderRoutes: Route[] = [
    { path: '', component: OrderComponent, canActivate: [authGuard] },
    { path: ':id', component: OrderDetailedComponent, canActivate: [authGuard] },
]
