import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.group = new FormBuilder().group({});
    component.questionId = 'some-id';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function updateForm(input) {
    component.group.controls[component.questionId].setValue(input);
  }

  describe('isInvalid', () => {
    it('should return false when field is empty and not required', () => {
      component.required = false;
      component.type = 'text';
      fixture.detectChanges();

      let actual = component.isInvalid();

      expect(actual).toEqual(false);
    });

    it('should return true when field is empty, form is submitted, and is required', () => {
      component.required = true;
      component.formSubmitted = true;
      component.type = 'text';
      fixture.detectChanges();

      let actual = component.isInvalid();

      expect(actual).toEqual(true);
    });

    it('should return false when field has valid input, and is required', () => {
      component.required = true;
      component.formSubmitted = true;
      component.type = 'text';
      fixture.detectChanges();
      updateForm('My Name');

      let actual = component.isInvalid();

      expect(actual).toEqual(false);
    });

    it('should return false when field is empty, required, and form not submitted', () => {
      component.required = true;
      component.formSubmitted = false;
      component.type = 'text';
      fixture.detectChanges();

      let actual = component.isInvalid();

      expect(actual).toEqual(false);
    });

    it('should return true when field has some input removed, and is required, and form not submitted', () => {
      component.required = true;
      component.formSubmitted = false;
      component.type = 'text';
      fixture.detectChanges();
      component.group.controls[component.questionId].markAsTouched();

      let actual = component.isInvalid();

      expect(actual).toEqual(true);
    });
  });

  describe('hasDanger', () => {
    it('should return false when field is not empty', () => {
      component.required = true;
      component.type = 'text';
      fixture.detectChanges();
      updateForm('My %Name%');

      let actual = component.hasDanger();

      expect(actual).toEqual(false);
    });

    it('should call isInvalid when field is empty', () => {
      component.formSubmitted = false;
      fixture.detectChanges();
      spyOn(component, 'isInvalid');

      component.hasDanger();

      expect(component.isInvalid).toHaveBeenCalled();
    });
  });

  describe('hasWarning', () => {
    it('should call isInvalid when field is not empty', () => {
      component.required = true;
      component.type = 'text';
      fixture.detectChanges();
      updateForm('My %Name%');
      spyOn(component, 'isInvalid').and.callFake(() => {
        return true;
      });

      let actual = component.hasWarning();

      expect(component.isInvalid).toHaveBeenCalled();
      expect(actual).toEqual(true);
    });

    it('should return false when field is empty', () => {
      component.required = true;
      component.type = 'text';
      fixture.detectChanges();

      let actual = component.hasWarning();

      expect(actual).toEqual(false);
    });
  });
});
