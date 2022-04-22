import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomDetailsComponent } from './bottom-details.component';

describe('BottomDetailsComponent', () => {
  let component: BottomDetailsComponent;
  let fixture: ComponentFixture<BottomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
