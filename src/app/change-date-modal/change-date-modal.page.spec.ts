import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeDateModalPage } from './change-date-modal.page';

describe('ChangeDateModalPage', () => {
  let component: ChangeDateModalPage;
  let fixture: ComponentFixture<ChangeDateModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDateModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeDateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
