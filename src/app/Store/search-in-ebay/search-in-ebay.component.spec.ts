import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInEbayComponent } from './search-in-ebay.component';

describe('SearchInEbayComponent', () => {
  let component: SearchInEbayComponent;
  let fixture: ComponentFixture<SearchInEbayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInEbayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchInEbayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
