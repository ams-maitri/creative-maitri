export type Document = {
  path: string;
  label: string;
};

export type Presentation = {
  slug: string;
  presenter: string;
  email: string;
  topic: string;
  title: string;
  date: string;
  tools: string[];
  description: string;
  photos: string[];
  documents: Document[];
  links: string[];
};
