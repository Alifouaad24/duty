import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomSupplyItemsComponent } from './tom-supply-items.component';

describe('TomSupplyItemsComponent', () => {
  let component: TomSupplyItemsComponent;
  let fixture: ComponentFixture<TomSupplyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TomSupplyItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TomSupplyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
