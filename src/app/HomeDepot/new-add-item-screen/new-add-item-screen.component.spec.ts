import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddItemScreenComponent } from './new-add-item-screen.component';

describe('NewAddItemScreenComponent', () => {
  let component: NewAddItemScreenComponent;
  let fixture: ComponentFixture<NewAddItemScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAddItemScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAddItemScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
