import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import { PostStore } from '@core/stores/post.store';
import { SharedModule } from '@shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-filters',
  imports: [SharedModule],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilters implements OnInit {
  public filterForm: FormGroup = new FormGroup({
    searchTerm: new FormControl<string | null>(null, { nonNullable: true }),
    dateFrom: new FormControl<string>(''),
    dateTo: new FormControl<string>(''),
    viewers: new FormControl<number | null>(null)
  });

  private destroyRef = inject(DestroyRef);

  constructor(public postStore: PostStore) {}

  public ngOnInit(): void {
    this.subscribeToControls();
  }

  public onTagSelected(tag: string) {
    this.postStore.setSelectedTags(tag);
  }

  public clearFilters(): void {
    this.filterForm.reset();
    this.postStore.clearFilters();
  }

  private subscribeToControls(): void {
    this.subscribeToSearchTermControl();
    this.subscribeToDateFromControl();
    this.subscribeToDateToControl();
    this.subscribeToViewersControl();
  }

  private subscribeToSearchTermControl(): void {
    this.filterForm.controls['searchTerm'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        this.postStore.searchByTitle(value)
      }
    })
  }

  private subscribeToDateFromControl(): void {
    this.filterForm.controls['dateFrom'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        this.postStore.searchByTitle(value)
      }
    })
  }

  private subscribeToDateToControl(): void {
    this.filterForm.controls['dateTo'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (date) => {
        this.postStore.setDateTo(date);
      }
    })
  }

  private subscribeToViewersControl(): void {
    this.filterForm.controls['viewers'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (viewers) => {
        this.postStore.searchByViewers(viewers);
      }
    })
  }
}
