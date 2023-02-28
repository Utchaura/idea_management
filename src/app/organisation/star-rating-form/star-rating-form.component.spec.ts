import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingFormComponent } from './star-rating-form.component';

describe('StarRatingFormComponent', () => {
  let component: StarRatingFormComponent;
  let fixture: ComponentFixture<StarRatingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarRatingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarRatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
