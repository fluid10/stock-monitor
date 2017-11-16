import { Component, OnInit } from '@angular/core';



import { DynamicStylerService } from '../dynamic-styler.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dynamicStylerService: DynamicStylerService) { }

  ngOnInit() {

    this.dynamicStylerService.unselectWatchlist(); // Unselect any currently selected watchlist

  }

}
