export interface Book {
  slug: string;
  title: string;
  group: string;
  testament: 'Antiguo Testamento' | 'Nuevo Testamento';
  summary: string;
  role: string;
  context: string;
  question: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

export interface SourceItem {
  title: string;
  url: string;
  description: string;
}
