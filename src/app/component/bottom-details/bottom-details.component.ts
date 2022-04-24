import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-bottom-details',
  templateUrl: './bottom-details.component.html',
  styleUrls: ['./bottom-details.component.scss']
})
export class BottomDetailsComponent {
  @Input() element: any
}
