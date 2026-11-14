import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Atlas, AtlasBook, AtlasLevel } from './book';
import { BibleApiService } from './bible-api.service';

type ReadingProgress = Record<string, boolean>;

@Component({
  selector: 'mb-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly api = inject(BibleApiService);
  readonly atlas = signal<Atlas | null>(null);
  readonly search = signal('');
  readonly group = signal('');
  readonly testament = signal('');
  readonly selectedBook = signal<AtlasBook | null>(null);
  readonly selectedLevelId = signal(this.readLevel());
  readonly selectedSectionId = signal('panorama');
  readonly progress = signal<ReadingProgress>(this.readProgress());
  readonly loading = signal(true);
  readonly error = signal('');
  readonly levels = computed(() => this.selectedBook()?.levels ?? []);
  readonly selectedLevel = computed(() => this.levels().find(level => level.id === this.selectedLevelId()) ?? this.levels()[0] ?? null);
  readonly groups = computed(() => [...new Set((this.atlas()?.books ?? []).map(book => book.group))]);
  readonly filteredBooks = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('es');
    return (this.atlas()?.books ?? []).filter(book =>
      (!query || `${book.title} ${book.group} ${book.summary} ${book.role}`.toLocaleLowerCase('es').includes(query)) &&
      (!this.group() || book.group === this.group()) &&
      (!this.testament() || book.testament === this.testament())
    );
  });
  readonly completedCount = computed(() => Object.values(this.progress()).filter(Boolean).length);
  readonly progressPercent = computed(() => Math.round(this.completedCount() / 219 * 100));

  constructor() {
    this.api.getAtlas().subscribe({
      next: atlas => { this.atlas.set(atlas); this.loading.set(false); },
      error: () => { this.error.set('No pudimos cargar el atlas. Comprueba tu conexión y vuelve a intentarlo.'); this.loading.set(false); }
    });
  }

  openBook(book: AtlasBook): void {
    this.selectedBook.set(book);
    this.selectedLevelId.set(book.levels.some(level => level.id === this.selectedLevelId()) ? this.selectedLevelId() : 'comprender');
    this.selectedSectionId.set('panorama');
  }

  closeBook(): void { this.selectedBook.set(null); }

  selectLevel(level: AtlasLevel): void {
    this.selectedLevelId.set(level.id);
    try { localStorage.setItem('atlas-biblico-level-v1', level.id); } catch { /* The level remains selected for this session. */ }
    const currentSection = this.selectedSectionId();
    if (!level.sections.some(section => section.id === currentSection)) this.selectedSectionId.set(level.sections[0]?.id ?? '');
  }

  goToSection(sectionId: string): void {
    this.selectedSectionId.set(sectionId);
    document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  progressKey(): string {
    return `${this.selectedBook()?.slug ?? ''}:${this.selectedLevelId()}`;
  }

  isComplete(): boolean { return this.progress()[this.progressKey()] === true; }

  toggleComplete(): void {
    const updated = { ...this.progress(), [this.progressKey()]: !this.isComplete() };
    this.progress.set(updated);
    try { localStorage.setItem('atlas-biblico-progress-v1', JSON.stringify(updated)); } catch { /* Storage may be disabled; the current session still works. */ }
  }

  printCurrent(): void { window.print(); }

  bookCompleted(book: AtlasBook): number {
    return book.levels.filter(level => this.progress()[`${book.slug}:${level.id}`]).length;
  }

  private readProgress(): ReadingProgress {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('atlas-biblico-progress-v1') ?? '{}');
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return Object.fromEntries(Object.entries(parsed).filter(([key, value]) => /^[a-z0-9-]+:(descubrir|comprender|investigar)$/.test(key) && value === true));
    } catch { return {}; }
  }

  private readLevel(): 'descubrir' | 'comprender' | 'investigar' {
    try {
      const value = localStorage.getItem('atlas-biblico-level-v1');
      return value === 'descubrir' || value === 'investigar' ? value : 'comprender';
    } catch { return 'comprender'; }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.closeBook(); }
}

