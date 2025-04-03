import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeilleComponent } from './veille.component';

describe('VeilleComponent', () => {
  let component: VeilleComponent;
  let fixture: ComponentFixture<VeilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
