import { Injectable } from '@angular/core';

import * as $ from 'jquery';

@Injectable()
export class DynamicStylerService {

  constructor() { }

  /* Unselect any selected watchlist
  */
  unselectWatchlist(): void {
    // Unselect watchlist if one is selected
    $('.watchlist-sidebar-item').children().each((index, element) => {
      $(element).removeClass('active');
    });
  }

  /* Style active css to watchlist we click on
     @param elementId: id number of an element we want to select
  */
  activateList(elementId): void {
    
    this.unselectWatchlist();

    // Select current watchlist
    $('#sidebar-item-' + elementId).children().each((index, element) => {
      $(element).addClass('active');
    })

  }

}
