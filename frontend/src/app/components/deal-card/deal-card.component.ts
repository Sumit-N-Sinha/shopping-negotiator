import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deal } from '../../models/deal';

@Component({
  selector: 'app-deal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deal-card.component.html'
})
export class DealCardComponent {
  @Input({ required: true }) deal!: Deal;
}