import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentinfoPage } from './paymentinfo.page';

describe('PaymentinfoPage', () => {
  let component: PaymentinfoPage;
  let fixture: ComponentFixture<PaymentinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
