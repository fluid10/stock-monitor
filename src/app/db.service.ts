import { Injectable } from '@angular/core';

import { Stock } from './stock';

import * as Datastore from 'nedb';

/*

  Create one instance of DB

*/

@Injectable()
export class DbService {
  db: Datastore = new Datastore({filename: 'watchlists.db', autoload: true});

  constructor() { }

  getDb(): Datastore {
    return this.db;
  }

}