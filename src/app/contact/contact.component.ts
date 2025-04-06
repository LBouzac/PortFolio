import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  loading = false;
  success = false;
  error = false;

  constructor() {}

  async handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    this.loading = true;
    this.error = false;

    try {
      const result = await emailjs.sendForm(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        form,
        environment.emailjs.publicKey
      );

      if (result.text === 'OK') {
        this.success = true;
        form.reset();
      }
    } catch (error) {
      this.error = true;
      console.error('Erreur d\'envoi:', error);
    } finally {
      this.loading = false;
    }
  }
}
