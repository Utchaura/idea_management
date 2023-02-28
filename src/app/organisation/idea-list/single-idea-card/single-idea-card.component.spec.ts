import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleIdeaCardComponent } from './single-idea-card.component';

describe('SingleIdeaCardComponent', () => {
  let component: SingleIdeaCardComponent;
  let fixture: ComponentFixture<SingleIdeaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleIdeaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleIdeaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
