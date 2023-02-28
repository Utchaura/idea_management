import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpmRedirectionComponent } from './spm-redirection.component';

describe('SpmRedirectionComponent', () => {
  let component: SpmRedirectionComponent;
  let fixture: ComponentFixture<SpmRedirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpmRedirectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpmRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
