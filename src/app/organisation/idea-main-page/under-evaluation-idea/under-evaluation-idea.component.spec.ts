import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderEvaluationIdeaComponent } from './under-evaluation-idea.component';

describe('UnderEvaluationIdeaComponent', () => {
  let component: UnderEvaluationIdeaComponent;
  let fixture: ComponentFixture<UnderEvaluationIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderEvaluationIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderEvaluationIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
