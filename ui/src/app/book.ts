export interface AtlasSection {
  id: string;
  title: string;
  text: string;
  kind: string;
  scriptureRefs: string[];
  sourceRefs: { label: string; url: string; kind: string }[];
}

export interface AtlasLevel {
  id: 'descubrir' | 'comprender' | 'investigar';
  title: string;
  subtitle: string;
  audience: string;
  sections: AtlasSection[];
}

export interface AtlasBook {
  slug: string;
  order: number;
  title: string;
  group: string;
  testament: 'Antiguo Testamento' | 'Nuevo Testamento';
  testamentShort: 'AT' | 'NT';
  status: string;
  summary: string;
  role: string;
  context: string;
  question: string;
  sourceUrl: string;
  reviewStatus: string;
  authorship: { claim: string; classification: string; certainty: string; sourceUrl: string };
  audience: { claim: string; classification: string; certainty: string; sourceUrl: string };
  sections: { id: string; title: string }[];
  levels: AtlasLevel[];
}

export interface Atlas {
  title: string;
  version: number;
  edition: string;
  disclaimer: string;
  counts: { total: number; oldTestament: number; newTestament: number };
  editorialCriteria: string[];
  sources: { id: string; title: string; url: string; kind: string; note: string }[];
  books: AtlasBook[];
}

