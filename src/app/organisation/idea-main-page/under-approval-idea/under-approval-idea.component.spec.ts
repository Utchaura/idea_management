import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderApprovalIdeaComponent } from './under-approval-idea.component';

describe('UnderApprovalIdeaComponent', () => {
  let component: UnderApprovalIdeaComponent;
  let fixture: ComponentFixture<UnderApprovalIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderApprovalIdeaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderApprovalIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
