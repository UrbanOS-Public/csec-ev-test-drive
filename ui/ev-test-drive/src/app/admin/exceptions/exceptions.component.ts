import { Component, OnInit, Input } from '@angular/core';
import { EVService } from 'src/app/common/ev.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment'

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {
  sourceData;
  
  ngOnInit() {
    this.getExceptions();
  }

  constructor(private evService: EVService) { }

  getExceptions() {
    this.evService.getExceptions().subscribe(
      response => this.handleExceptionsResponse(response), 
      error => this.handleError(error)
    );
  }

  onSubmit(exception) {
    this.evService.postAddException({date:exception.date}).subscribe(
      response => this.handleAddExceptionsResponse(response), 
      error => this.handleError(error)
    );
  }

  handleExceptionsResponse(response) {
    this.sourceData = response;
  }

  handleAddExceptionsResponse(response) {
    console.log('added exception', response);
    this.getExceptions();
  }

  handleError(error){
    console.log(error);
  }

}
