import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule,NgIf,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  successMessage: string = '';
  failMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.failMessage = 'Please fill out all required fields correctly.';
      setTimeout(() => (this.failMessage = ''), 3000);
      return;
    }

    // Example endpoint for sending contact messages
    this.http.post('http://localhost:5000/contact', this.contactForm.value).subscribe(
      () => {
        this.successMessage = 'Your message has been sent successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
        this.contactForm.reset();
      },
      (error) => {
        this.failMessage = 'Failed to send your message. Please try again.';
        setTimeout(() => (this.failMessage = ''), 3000);
      }
    );
  }
}
