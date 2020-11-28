import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentsuccessPage } from './paymentsuccess.page';

describe('PaymentsuccessPage', () => {
  let component: PaymentsuccessPage;
  let fixture: ComponentFixture<PaymentsuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
