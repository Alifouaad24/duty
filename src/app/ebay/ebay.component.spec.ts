import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayComponent } from './ebay.component';

describe('EbayComponent', () => {
  let component: EbayComponent;
  let fixture: ComponentFixture<EbayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EbayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
