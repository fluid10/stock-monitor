import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Company } from './company';

import 'rxjs/add/operator/toPromise';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {
	constructor(private http: Http) {}

	// Search companies by symbol and company name
	search(term: string): Observable<Company[]> {
		return this.http
							 // .get(`../assets/data/companies.json`) // For local dev
							 .get(`./assets/data/companies.json`)
							 .map(response => {
								 	// filter companies by their symbol/name
								 	let result = response.json().filter(<Company>(x: any) => {
								 		if (x.symbol.toLowerCase().includes(term.toLowerCase()) || x.name.toLowerCase().includes(term.toLowerCase())) {
								 			return x;
								 		}
								 	});

								 	return result as Company[];
							 });
	}

	private handleError(error: any): Promise<any> {
	  console.error('An error occurred', error); // for demo purposes only
	  return Promise.reject(error.message || error);
	}
}