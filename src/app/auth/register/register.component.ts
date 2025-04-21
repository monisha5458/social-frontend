import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importing CommonModule
import { FormsModule } from '@angular/forms';    // Importing FormsModule
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Adjust path as needed

@Component({
  selector: 'app-register',
  standalone: true,  // Allowing this component to be standalone
  imports: [CommonModule, FormsModule], // Importing CommonModule and FormsModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  isRegistering: boolean = true; // Set initial state to 'true' for registration form
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle between the register and login forms
  toggleForm(): void {
    this.isRegistering = !this.isRegistering;
  }

  onSubmit(): void {
    if (this.isRegistering) {
      // Registration form submission logic
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.authService.register(this.username, this.email, this.password).subscribe({
        next: () => {
          // On success, navigate to login or dashboard
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'User already exists. Please login.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        },
      });
    } else {
      // Login form submission logic
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          // On success, navigate to the dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Login failed. Please check your credentials.';
        },
      });
    }
  }
  
getUsernameFromLocalStorage(): string {
  const storedUsername = localStorage.getItem('username');
  return storedUsername ? storedUsername : 'Guest';  // Return stored username or 'Guest'
}
}
