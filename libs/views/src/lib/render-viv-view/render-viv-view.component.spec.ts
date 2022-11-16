import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderVivViewComponent } from './render-viv-view.component';

describe('RenderVivViewComponent', () => {
  let component: RenderVivViewComponent;
  let fixture: ComponentFixture<RenderVivViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderVivViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderVivViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
