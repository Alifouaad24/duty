import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMerchantComponent } from './show-merchant.component';

describe('ShowMerchantComponent', () => {
  let component: ShowMerchantComponent;
  let fixture: ComponentFixture<ShowMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMerchantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
