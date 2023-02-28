import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGridComponent } from './department-grid.component';

describe('DepartmentGridComponent', () => {
  let component: DepartmentGridComponent;
  let fixture: ComponentFixture<DepartmentGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
