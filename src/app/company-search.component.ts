import { Component, OnInit } from '@angular/core';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
 
// Observable class extensions
import 'rxjs/add/observable/of';
 
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Company } from './company';
import { CompanyService } from './company.service';
import { StockService } from './stock.service';

import { Stock } from './stock';

import * as $ from 'jquery';

@Component({
	selector: 'company-search',
	templateUrl: './company-search.html'
})
export class CompanySearchComponent implements OnInit {
	newstock: any;
	companies: Observable<Company[]>;
	company: string = '';
	private searchTerms = new Subject<string>();

	constructor(private companyService: CompanyService, private stockService: StockService) { }
	

	// Push a search term into the observable stream.
	search(term: string): void {
		this.searchTerms.next(term);
	}
	
	/*
		Selects a company from autocomplete list by placing its acronym inside search bar
		@param companySymbol: a symbol of a company
	*/
	selectCompany(companySymbol: string): void {
		$('#search-box').val(companySymbol);
		$('#selected-company').html(companySymbol); // log selected company value to HTML
		this.search(''); // clear autocomplete list when we select a company
	}

	addStock(stockSymbol: string, stockShares: string): Promise<boolean> {
		let watchlistId = $('#watchlist-id').val();

		if (watchlistId) {
			watchlistId = watchlistId as string;

			return this.stockService.addStock(watchlistId, stockSymbol, stockShares)
			.then((stock) => {
				this.newstock = stock;
				return true;
			});
		}

	}

	ngOnInit(): void {
		this.companies = this.searchTerms
			.debounceTime(300) // wait 300ms after each keystroke before considering the term
			.distinctUntilChanged() // ignore if next search term is same as previous
			.switchMap(term => term.length > 1 // show terms only when input has more than 1 character to prevent lag due to excessive results
				// return http search observable
				? this.companyService.search(term)
				// or observable of empty companies if there was no search term
				: Observable.of<Company[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<Company[]>([]);
			});
	}


}