import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from '@core/models/post.model';
import {SharedModule} from '@shared/shared.module';
import {fadeInOutAnimation} from '@core/constants/animations';

@Component({
  selector: 'app-post-card',
  imports: [SharedModule],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
  animations: [fadeInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCard {
  @Input() public post: Post;
  @Output() likedPost = new EventEmitter<number>();

  public toggleLike(event: MouseEvent): void {
    event.stopPropagation();
    this.post.liked = !this.post.liked;
    this.likedPost.emit(this.post.id);
  }
}
