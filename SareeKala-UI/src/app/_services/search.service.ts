import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  clearSearchQuery() {
    this.searchQuerySubject.next('');
  }
}
