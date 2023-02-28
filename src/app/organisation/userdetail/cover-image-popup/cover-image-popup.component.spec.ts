import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverImagePopupComponent } from './cover-image-popup.component';

describe('CoverImagePopupComponent', () => {
  let component: CoverImagePopupComponent;
  let fixture: ComponentFixture<CoverImagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverImagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
