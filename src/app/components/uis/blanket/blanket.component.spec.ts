import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketComponent } from './blanket.component';

describe('BlanketComponent', () => {
  let component: BlanketComponent;
  let fixture: ComponentFixture<BlanketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlanketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
