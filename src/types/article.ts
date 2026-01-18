export interface Article {
  id: number;
  title: string;
  description: string;
  author_id: number;
}

export interface ArticleWithAuthor {
  id: number;
  title: string;
  description: string;
  author_id: number;
  author_name: string;
  author_email: string;
}

export interface NewArticle {
  title: string;
  description: string;
  author_id: number;
}
