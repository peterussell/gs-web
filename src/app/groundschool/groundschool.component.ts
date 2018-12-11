import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from '../../globals';

@Component({
  selector: 'app-groundschool',
  templateUrl: './groundschool.component.html',
  styleUrls: ['./groundschool.component.scss']
})
export class GroundschoolComponent implements OnInit {
  public facebookUrl: string = GlobalVariables.FACEBOOK_URL;
  
  constructor() { }

  ngOnInit() {
  }

}
