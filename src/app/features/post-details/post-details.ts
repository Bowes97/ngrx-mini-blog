import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostStore} from '@core/stores/post.store';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'app-post-details',
  imports: [
    Card,
    Tag,
    DatePipe,
    DecimalPipe,
    Badge,
  ],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostDetails implements OnInit {
  public postId: number;

  constructor(public postStore: PostStore, private readonly route: ActivatedRoute, private readonly router: Router) {}

  public ngOnInit(): void {
    this.loadPost();
    this.getPostId();
  }

  public goBack() {
    this.router.navigate(['/home']);
  }

  private getPostId(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
  }

  private loadPost(): void {
    this.postStore.loadPosts();
  }
}
