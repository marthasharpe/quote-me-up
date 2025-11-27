export interface Figure {
  id: string;
  slug: string;
  display_name: string;
  short_label: string | null;
  avatar_url: string | null;
  era: string | null;
  category: string | null;
  bio: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  figure_id: string;
  text: string;
  source_title: string | null;
  source_reference: string | null;
  language: string;
  is_public_domain: boolean;
  created_at: string;
}

export interface QuoteWithFigure extends Quote {
  figures: Figure;
}
