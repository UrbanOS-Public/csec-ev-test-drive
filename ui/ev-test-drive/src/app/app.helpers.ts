import { Validators } from '@angular/forms';


class Helpers {
  validators = {
    text: Validators.pattern(/^[a-z0-9,._'\s!?@%$()=\/\-]*$/i),
    tel: Validators.pattern(/^[(]{0,1}[2-9]{1}\d{2}[)]{0,1}[-\s\.]{0,1}\d{3}[-\s\.]{0,1}\d{4}$/),
    name: Validators.pattern(/^[a-z ,.'\-]+$/i),
    number: Validators.pattern(/^[0-9,.$\-]+$/),
    email: Validators.email
  };

  getWindowWidth() {
    return window.innerWidth;
  }

  getValidators(required, type) {
    let validatorList: any[] = [];
    if (required) validatorList.push(Validators.required);

    if (type in this.validators) {
      validatorList.push(this.validators[type]);
    }

    return validatorList;
  }

  encodeSpecialCharacters (text) {
    return encodeURIComponent(text);
  }

  formatAMPM(time: string) {
    let hours = Number(time.substring(0,2));
    let minutes = time.substring(3,5);;
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let strMinutes = minutes;
    const strTime = hours + ':' + strMinutes + ' ' + ampm;
    return strTime;
  }
}
export { Helpers };
