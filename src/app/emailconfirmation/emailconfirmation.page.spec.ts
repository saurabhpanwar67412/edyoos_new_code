import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailconfirmationPage } from './emailconfirmation.page';

describe('EmailconfirmationPage', () => {
  let component: EmailconfirmationPage;
  let fixture: ComponentFixture<EmailconfirmationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailconfirmationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailconfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
