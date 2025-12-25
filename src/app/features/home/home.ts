import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { PostStore } from '@core/stores/post.store';
import { PostCard } from './components/post-card/post-card';
import { SharedModule } from '@shared/shared.module'
import { ProductFilters } from "./components/product-filters/product-filters";
import { PaginatorState } from 'primeng/paginator';
import { Router } from '@angular/router';
import { Post } from '@core/models/post.model';

@Component({
  selector: 'app-home',
  imports: [PostCard, SharedModule, ProductFilters],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  constructor(public postStore: PostStore, public router: Router) {}

  public ngOnInit(): void {
    this.postStore.loadPosts();
  }

  public onPageChange(event: PaginatorState): void {
    this.postStore.setPage(event.first ?? 0, event.rows ?? 10);
  }

  public openPost(post: Post): void {
    this.router.navigate(['/posts', post.id]);
  }

  public saveLikedPost(postId: number): void {
    this.postStore.toggleLike(postId);
  }
}
