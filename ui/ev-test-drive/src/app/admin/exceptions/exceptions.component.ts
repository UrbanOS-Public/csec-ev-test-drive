import { Component, OnInit, Input } from '@angular/core';
import { EVService } from 'src/app/common/ev.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    console.log(exception);
  }

  handleExceptionsResponse(response) {
    this.sourceData = response;
    console.log('we got the data', response);
  }

  handleError(error){
    console.log(error);
  }

}
