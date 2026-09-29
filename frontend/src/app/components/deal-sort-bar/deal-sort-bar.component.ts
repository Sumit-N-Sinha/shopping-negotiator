import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deal-sort-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deal-sort-bar.component.html'
})
export class DealSortBarComponent {
  @Input() options: string[] = [];
  @Input() active = '';
  @Output() activeChange = new EventEmitter<string>();
}