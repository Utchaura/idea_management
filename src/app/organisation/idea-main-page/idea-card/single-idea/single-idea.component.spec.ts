import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleIdeaComponent } from './single-idea.component';

describe('SingleIdeaComponent', () => {
  let component: SingleIdeaComponent;
  let fixture: ComponentFixture<SingleIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
