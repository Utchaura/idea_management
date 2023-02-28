import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReviewedIdeaComponent } from './my-reviewed-idea.component';

describe('MyReviewedIdeaComponent', () => {
  let component: MyReviewedIdeaComponent;
  let fixture: ComponentFixture<MyReviewedIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyReviewedIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReviewedIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
