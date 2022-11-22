import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VivViewComponent } from './viv-view.component';

describe('VivViewComponent', () => {
  let component: VivViewComponent;
  let fixture: ComponentFixture<VivViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VivViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VivViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
