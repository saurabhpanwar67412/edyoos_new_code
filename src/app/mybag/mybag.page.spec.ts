import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MybagPage } from './mybag.page';

describe('MybagPage', () => {
  let component: MybagPage;
  let fixture: ComponentFixture<MybagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybagPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MybagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
