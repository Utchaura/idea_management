import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverFormComponent } from './approver-form.component';

describe('ApproverFormComponent', () => {
  let component: ApproverFormComponent;
  let fixture: ComponentFixture<ApproverFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
