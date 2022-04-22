import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bottom-details',
  templateUrl: './bottom-details.component.html',
  styleUrls: ['./bottom-details.component.css']
})
export class BottomDetailsComponent implements OnInit {
  @Input() element: any

  constructor() { }

  ngOnInit(): void {
  }

}
