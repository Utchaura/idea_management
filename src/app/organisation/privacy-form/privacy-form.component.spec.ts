import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyFormComponent } from './privacy-form.component';

describe('PrivacyFormComponent', () => {
  let component: PrivacyFormComponent;
  let fixture: ComponentFixture<PrivacyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
