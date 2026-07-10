import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service'; // Ensure this relative path is correct

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  // Exposes the streaming observable array to the html loop
  toasts$ = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  // Allows manual dismiss button interactions (click)="close(toast.id)"
  close(id: number): void {
    this.toastService.remove(id);
  }
}