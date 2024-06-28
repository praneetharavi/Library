import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LibrarianDashboardComponent } from './librarian-dashboard/librarian-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { AddNewBookComponent } from './add-new-book/add-new-book.component';
import { AllMembersComponent } from './all-members/all-members.component';
import { EditRemoveBookComponent } from './edit-remove-book/edit-remove-book.component';
import { LatestCheckoutsComponent } from './latest-checkouts/latest-checkouts.component';
import { OverdueCheckoutsComponent } from './overdue-checkouts/overdue-checkouts.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { MyBooksComponent } from './my-books/my-books.component';

export const routes: Routes = [
    { path: '', component: HomeComponent } ,
    { path: 'librariandashboard' , component: LibrarianDashboardComponent},
    { path: 'customerdashboard' , component: CustomerDashboardComponent },
    { path: 'add-new-book', component: AddNewBookComponent },
    { path: 'edit-remove-book', component: EditRemoveBookComponent },
    { path: 'latest-checkouts', component: LatestCheckoutsComponent },
    { path: 'overdue-checkouts', component: OverdueCheckoutsComponent },
    { path: 'all-members', component: AllMembersComponent },
    { path: 'book/:id', component: BookDetailsComponent },
    { path: 'search-results', component: SearchPageComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'cart', component: CartComponent},
    { path: 'past-checkouts' , component: MyBooksComponent}


];
