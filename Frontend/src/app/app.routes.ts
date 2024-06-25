import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LibrarianDashboardComponent } from './librarian-dashboard/librarian-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { AddNewBookComponent } from './add-new-book/add-new-book.component';
import { AllMembersComponent } from './all-members/all-members.component';
import { EditRemoveBookComponent } from './edit-remove-book/edit-remove-book.component';
import { LatestCheckoutsComponent } from './latest-checkouts/latest-checkouts.component';
import { OverdueCheckoutsComponent } from './overdue-checkouts/overdue-checkouts.component';

export const routes: Routes = [
    { path: '', component: HomeComponent } ,
    { path: 'librariandashboard' , component: LibrarianDashboardComponent},
    { path: 'customerdashboard' , component: CustomerDashboardComponent },
    { path: 'add-new-book', component: AddNewBookComponent },
    { path: 'edit-remove-book', component: EditRemoveBookComponent },
    { path: 'latest-checkouts', component: LatestCheckoutsComponent },
    { path: 'overdue-checkouts', component: OverdueCheckoutsComponent },
    { path: 'all-members', component: AllMembersComponent },
];
