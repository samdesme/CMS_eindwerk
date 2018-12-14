import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']

  
})
export class NavComponent implements OnInit {

  @Input() myTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

}
