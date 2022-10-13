import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-choose-align',
  templateUrl: './choose-align.component.html',
  styleUrls: ['./choose-align.component.css']
})
export class ChooseAlignComponent implements OnInit {

  public alignId: number = 1;
  @Output() changeMapAlignEvent: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  public changeMapAlign(alignId:number){
    this.alignId=alignId;
    this.changeMapAlignEvent.emit(alignId);
    
  }

}
