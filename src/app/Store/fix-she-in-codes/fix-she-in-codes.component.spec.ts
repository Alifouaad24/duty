import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixSheInCodesComponent } from './fix-she-in-codes.component';

describe('FixSheInCodesComponent', () => {
  let component: FixSheInCodesComponent;
  let fixture: ComponentFixture<FixSheInCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixSheInCodesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixSheInCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
