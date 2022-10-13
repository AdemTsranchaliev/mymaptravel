import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-choose-align',
  templateUrl: './choose-align.component.html',
  styleUrls: ['./choose-align.component.css']
})
export class ChooseAlignComponent implements OnInit {

  @Output() changeMapAlignEvent: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  public changeMapAlign(alignId:number){
    console.log(alignId);
    this.changeMapAlignEvent.emit(alignId);
  }

}
