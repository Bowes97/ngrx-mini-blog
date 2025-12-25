export interface Post {
    id: number;
    title: string;
    category: string;
    authors: string[];
    date: string;
    tags: string[];
    views: number;
    featured: boolean
    liked?: boolean;
};
