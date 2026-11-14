import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Book, SourceItem, TimelineItem } from './book';
import { BibleApiService } from './bible-api.service';

@Component({
  selector: 'mb-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly api = inject(BibleApiService);
  readonly books = signal<Book[]>([]);
  readonly timeline = signal<TimelineItem[]>([]);
  readonly sources = signal<SourceItem[]>([]);
  readonly search = signal('');
  readonly group = signal('');
  readonly testament = signal('');
  readonly selectedBook = signal<Book | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly groups = computed(() => [...new Set(this.books().map(book => book.group))]);
  readonly filteredBooks = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('es');
    return this.books().filter(book =>
      (!query || `${book.title} ${book.group} ${book.summary} ${book.role}`.toLocaleLowerCase('es').includes(query)) &&
      (!this.group() || book.group === this.group()) &&
      (!this.testament() || book.testament === this.testament())
    );
  });

  constructor() {
    this.api.getBooks().subscribe({
      next: books => { this.books.set(books); this.loading.set(false); },
      error: () => { this.error.set('No pudimos cargar el catálogo. Comprueba que el API esté disponible y vuelve a intentar.'); this.loading.set(false); }
    });
    this.api.getTimeline().subscribe({ next: items => this.timeline.set(items) });
    this.api.getSources().subscribe({ next: items => this.sources.set(items) });
  }

  openBook(book: Book): void { this.selectedBook.set(book); }
  closeBook(): void { this.selectedBook.set(null); }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeBook(); }
}
