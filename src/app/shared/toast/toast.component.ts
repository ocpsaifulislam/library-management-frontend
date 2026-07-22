import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toasts$ = this.toastService.toasts$;

  constructor(private toastService: ToastService) {}

  remove(id: number): void {
    this.toastService.remove(id);
  }
}

