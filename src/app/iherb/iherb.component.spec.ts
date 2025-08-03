import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IHerbComponent } from './iherb.component';

describe('IHerbComponent', () => {
  let component: IHerbComponent;
  let fixture: ComponentFixture<IHerbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IHerbComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IHerbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
