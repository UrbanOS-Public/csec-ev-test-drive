import { Component, OnInit, Input } from '@angular/core';
import { EVService } from 'src/app/common/ev.service';
import { ModalService } from '../../common/modal.service';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {
  sourceData;
  isSubmitting = false;
  showPinError = false;
  exception;
  pin;
  pinConfirm;

  ngOnInit() {
    this.getExceptions();
  }

  constructor(private evService: EVService, private modalService: ModalService) { }

  getExceptions() {
    this.evService.getExceptions().subscribe(
      response => this.handleExceptionsResponse(response), 
      error => this.handleError(error)
    );
  }

  onSubmit(exception) {
    this.exception = exception;
    this.pinConfirm = this.doAddException;
    this.openModal('pin-modal');
  }

  onDelete(exception) {
    this.exception = exception;
    this.pinConfirm = this.doDeleteException;
    this.openModal('pin-modal');
  }

  doAddException(){
    this.isSubmitting = true;
    this.evService.postAddException({date:this.exception.date, pin:this.pin}).subscribe(
      response => this.handleAddExceptionsResponse(response), 
      error => this.handlePinError(error)
    );
  }

  doDeleteException(){
    this.isSubmitting = true;
    this.evService.postAddException({id:this.exception.id, pin:this.pin}).subscribe(
      response => this.handleAddExceptionsResponse(response), 
      error => this.handlePinError(error)
    );
  }

  handleExceptionsResponse(response) {
    this.sourceData = response;
  }

  handleAddExceptionsResponse(response) {
    this.isSubmitting = false;
    this.exception = null;
    this.closeModal('pin-modal');
    this.getExceptions();
  }

  handleError(error){
    this.isSubmitting = false;
    console.log(error);
  }

  handlePinError(error) {
    this.showPinError = true;
    this.isSubmitting = false;
  }

  openModal(id) {
    this.showPinError = false;
    this.modalService.open(id);
  }

  closeModal(id) {
    this.showPinError = false;
    this.modalService.close(id);
  }

}
