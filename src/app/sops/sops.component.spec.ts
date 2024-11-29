import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopsComponent } from './sops.component';

describe('SopsComponent', () => {
  let component: SopsComponent;
  let fixture: ComponentFixture<SopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
