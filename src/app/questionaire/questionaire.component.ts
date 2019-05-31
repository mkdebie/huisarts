import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material';
import { resetApplicationState } from '@angular/core/src/render3/instructions';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-questionaire',
  templateUrl: 'questionaire.component.html',
  styleUrls: ['questionaire.component.css'],
})
export class QuestionaireComponent implements OnInit {
  isLinear = false;
  reasons: string[] = [];
  vitalFormGroup: FormGroup;
  chestPainFormGroup: FormGroup;
  dyspnoeFormGroup:FormGroup;
  collapsFormGroup:FormGroup;


  // BasicVariables
  temps: string [] = ['<36 C', '36 C- 38.0 C', '> 38 C', 'Niet gemeten'];
  rrs: string [] = ['< 90mmhg', '90-140mmHg', '140-220mmHg', '>220mmHg'];
  oxygens: string[] = ['>95%', '90-95%', '<90%', 'Niet gemeten'];
  ecgs: string[] = ['STEMI', 'VT', 'Mobitz II/Totaal block', 'Anders of geen ECG'];
  janee: string[] = ['Ja', 'Nee'];

  // ChestpainVariables
  pobgehad: boolean = true;
  pobactief: boolean = true;
  pobverdacht: boolean = true;

  // DyspnoeVariables
  dyspnoeaanwezig: boolean = true;
  acaanwezig: boolean = true;

  // CollapsVariables
  collapsaanwezig: boolean = true;

  // final definitaions:
  formuliercompleet: boolean = false;
  verwijzingflank: boolean = true;
  verwijzingemmen: boolean = true;



  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.vitalFormGroup = this._formBuilder.group({
      birthCtrl: [''],
      huisartsCtrl: [''],
      cardioloogCtrl: [''],
      klachtCtrl: [''],
      plaatsCtrl: [''],

      rrCtrl: [''],
      tempCtrl: [''],
      oxygenCtrl:[''],
      ecgCtrl:[''],
    });
    this.chestPainFormGroup = this._formBuilder.group({
      pobCtrl: ['',],
      actiefCtrl: [''],
      duurCtrl: [''],
      verdachtCtrl: [''],
    });
    this.dyspnoeFormGroup = this._formBuilder.group({
      dyspnoeCtrl: [''],
      acCtrl: [''],
      ischemEcgCtrl: [''],
    });
    this.collapsFormGroup = this._formBuilder.group({
      collapsCtrl: [''],
    });
  }

  goForwardVitals (stepper: MatStepper, ecg) {
    const rr = this.vitalFormGroup.get('rrCtrl').value;
    if (rr === "< 90mmHg") {
      this.reasons.push('Te lage bloeddruk')
    }
    const oxygen = this.vitalFormGroup.get('oxygenCtrl').value;
    if (oxygen === "<90%") {
      this.reasons.push ('Te lage O2 saturatie')
    }
    const temp = this.vitalFormGroup.get('tempCtrl').value;
    if (temp === "> 38 C") {
      this.reasons.push ('Koorts');
    };
    if (ecg !== 'Anders of geen ECG') {
      this.reasons.push ('Afwijkend ECG');
    }
    stepper.next();
  }

  showDivPob (stepper: MatStepper, pobgehadcheck) {
    if (pobgehadcheck === 'Nee') {
      this.pobgehad = true;
      stepper.next();
    } else {
      this.pobgehad = false;
    }
  }

  showDivPobActief (stepper: MatStepper, pobactiefcheck) {
    if (pobactiefcheck ==='Ja') {
      this.pobactief = false;
    } else {
      this.pobactief = true;
      stepper.next();
    }
  }

  showDivPobDuur (stepper: MatStepper, pobactiefduur) {
    if (pobactiefduur === 'Ja') {
      this.pobverdacht = true;
      this.reasons.push ('Pijn op de Borst < 6 uur aanwezig');
      stepper.selectedIndex = 1;
    } else {
      this.pobverdacht = false;
    }
  }

  showDivPobVerdacht (stepper: MatStepper, pobverdachta) {
      if (pobverdachta === 'Ja') {
        this.reasons.push('Verdachte Anamnese');
        stepper.next();
      } else {
        stepper.next();
      }
    }

  showDivDyspnoe (stepper: MatStepper, dyspnoecheck) {
    if (dyspnoecheck === 'Ja') {
      this.dyspnoeaanwezig = false;
    } else {
      stepper.next();
    }
  }

  showDivAstmaCardiale (stepper: MatStepper, accheck) {
    if (accheck === 'Ja') {
      this.reasons.push('Sterke verdenking op Astma Cardiale');
      stepper.next();
    } else {
        this.acaanwezig = false;
      }
    }

  showDivEcgIschemisch (stepper: MatStepper, ecgischem) {
    if (ecgischem ==='Ja') {
      this.reasons.push('Dyspnoe en Ischemisch ECG')
      stepper.next();
    } else {
        stepper.next();
    }
  }

  showDivCollaps (stepper: MatStepper, collapscheck) {
    if (collapscheck ==='Ja') {
      this.collapsaanwezig = false;
    } else {
        this.formuliercompleet = true;
        this.checkVerwijzer();
        stepper.next();
      }
    }

  showDivTrauma (stepper: MatStepper, traumacheck) {
    if (traumacheck === 'Ja') {
      this.reasons.push('Patient is gecollabeerd met ernstig trauma.');
      this.formuliercompleet = true;
      this.checkVerwijzer();
      stepper.next ();
      } else {
      this.formuliercompleet = true;
      this.checkVerwijzer();
      stepper.next();
    }
  }

  checkVerwijzer () {
    if (this.reasons.length === 0) {
      if (this.formuliercompleet) {
        this.verwijzingflank = false;
        this.verwijzingemmen = true;
      }
    } else {
      this.verwijzingemmen = false;
      this.verwijzingflank = true;
    }
  }

  resetForm (stepper: MatStepper) {
    this.reasons = [];
    stepper.reset();
  }

}
