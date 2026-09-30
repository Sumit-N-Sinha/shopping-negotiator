import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-composer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-composer.component.html',
  styleUrls: ['./search-composer.component.scss']
})
export class SearchComposerComponent {
  @Output() searchRequested = new EventEmitter<{ query: string; image?: string }>();

  query = '';
  imagePreview: string | null = null;
  imageName = '';
  attachmentError = '';

  submit(): void {
    this.searchRequested.emit({ query: this.query, image: this.imagePreview ?? undefined });
  }

  trySearch(value: string): void {
    this.query = value;
    this.submit();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.attachmentError = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.attachmentError = 'Choose an image file to attach.';
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.attachmentError = 'Image must be 10 MB or smaller.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
      this.imageName = file.name;
    };
    reader.readAsDataURL(file);
  }

  removeImage(input: HTMLInputElement): void {
    this.imagePreview = null;
    this.imageName = '';
    this.attachmentError = '';
    input.value = '';
  }
}