import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // for routing
import { CommonModule } from '@angular/common'; // for common Angular directives
import { FormsModule } from '@angular/forms'; // required for ngModel
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true, // making it standalone
  imports: [
    RouterModule,   // necessary for routing
    CommonModule,   // includes common directives like ngIf, ngFor
    FormsModule, 
    HeaderComponent,  // required for ngModel (two-way data binding)
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'linkedin-clone-frontend';
}
