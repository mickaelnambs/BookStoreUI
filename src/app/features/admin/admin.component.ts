import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminBookComponent } from './admin-book/admin-book.component';
import { AdminDeliveryMethodComponent } from './admin-delivery-method/admin-delivery-method.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        MatTabsModule,
        AdminOrderComponent,
        AdminBookComponent,
        AdminDeliveryMethodComponent,
        AdminUsersComponent
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
