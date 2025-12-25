import { inject, Injectable, computed } from "@angular/core";
import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { Post } from "../models/post.model";
import { PostService } from "../services/post.service";
import { delay } from "rxjs";

interface PostState {
  posts: Post[];
  selectedTags: string[];
  filteredTitle: string | null;
  loading: boolean;
  error: string | null;
  first: number;
  rows: number;
  dateFrom: string | null;
  dateTo: string | null;
  viewers: number | null;
  likedPosts: number[];
}

const LIKED_POSTS_KEY = 'likedPosts';

const initialState: PostState = {
  posts: [],
  selectedTags: [],
  filteredTitle: null,
  loading: false,
  error: null,
  first: 0,
  rows: 10,
  dateFrom: null,
  dateTo: null,
  viewers: null,
  likedPosts: JSON.parse(localStorage.getItem(LIKED_POSTS_KEY) || '[]'),
};

@Injectable({ providedIn: 'root' })
export class PostStore extends signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((state) => {
    const allTags = computed(() => {
      const tags = state.posts().flatMap(post => post.tags);
      return Array.from(new Set(tags));
    });

    const allCategories = computed(() => {
      const categories = state.posts().map(post => post.category);
      return Array.from(new Set(categories));
    });

    const filteredPosts = computed(() => {
      const posts = state.posts();
      const selectedTags = state.selectedTags();
      const filteredTitle = state.filteredTitle();
      const dateFrom = state.dateFrom();
      const dateTo = state.dateTo();
      const viewers = state.viewers();

      const matchesTitle = (post: Post): boolean =>
        !filteredTitle ||
        post.title.toLowerCase().includes(filteredTitle.toLowerCase().trim()) ||
        post.category.toLowerCase().includes(filteredTitle.toLowerCase().trim());

      const matchesTags = (post: Post): boolean =>
        selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag));

      const matchesDateRange = (post: Post): boolean => {
        const postDate = new Date(post.date);
        return (
          (!dateFrom || postDate >= new Date(dateFrom)) &&
          (!dateTo || postDate <= new Date(dateTo))
        );
      };

      const matchesViewers = (post: Post): boolean =>
        viewers == null || post.views <= viewers;

      return posts.filter(
        post =>
          matchesTitle(post) &&
          matchesTags(post) &&
          matchesDateRange(post) &&
          matchesViewers(post)
      )
    });

    const pagedPosts = computed(() => {
      const first = state.first();
      const rows = state.rows();
      return filteredPosts().slice(first, first + rows);
    });

    return {
      allTags,
      allCategories,
      filteredPosts,
      pagedPosts
    };
  }),

  withMethods((state, postService = inject(PostService)) => ({
    loadPosts(): void {
      if (!state.posts().length) {
        patchState(state, { loading: true, error: null });

        postService.getPosts().pipe(delay(1000)).subscribe({
          next: (posts) => {
            const likedPosts = state.likedPosts() || [];
            const postsWithLikes = posts.map(post => ({
              ...post,
              liked: likedPosts.includes(post.id),
            }));
            patchState(state, { posts: postsWithLikes, loading: false });
          },
          error: (err) => {
            patchState(state, { loading: false, error: err.message ?? 'Failed to load posts' });
          }
        });
      }
    },

    getPostById(id: number): Post | null {
      return state.posts().find(post => post.id === id) || null;
    },

    toggleLike(postId: number): void {
      const likedPosts = new Set(state.likedPosts());
      likedPosts.has(postId) ? likedPosts.delete(postId) : likedPosts.add(postId);

      const likedArray = Array.from(likedPosts);
      patchState(state, { likedPosts: likedArray });
      localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedArray));
    },

    setSelectedTags(tag: string): void {
      const currentTags = new Set(state.selectedTags());
      currentTags.has(tag) ? currentTags.delete(tag) : currentTags.add(tag);
      patchState(state, { selectedTags: Array.from(currentTags) });
      patchState(state, { first: 0 });
    },

    setPage(first: number, rows: number): void {
      patchState(state, { first, rows });
    },

    searchByTitle(title: string | null): void {
      patchState(state, { filteredTitle: title, first: 0 });
    },

    searchByViewers(number: number): void {
      patchState(state, { viewers: number, first: 0 });
    },

    setDateFrom(date: string | null): void {
      patchState(state, { dateFrom: date, first: 0 });
    },

    setDateTo(date: string | null): void {
      patchState(state, { dateTo: date, first: 0 });
    },

    clearFilters(): void {
      patchState(state, { selectedTags: [], filteredTitle: null, first: 0 });
    }
  }))
) {}
