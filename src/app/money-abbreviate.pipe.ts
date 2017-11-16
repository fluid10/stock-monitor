import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyAbbreviate'
})
export class MoneyAbbreviatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args) {
      let currencySymbol = args;
      return "$" + parseFloat(value.split("$")[1].replace(/,/g,'')).toFixed(2) + currencySymbol;
    }
    else {
      let currencySymbol = value.split('')[0];
      if (value.includes("$")) {
        var moneyValue = parseFloat(value.split("$")[1].replace(/,/g,'')).toFixed(2);
      } else {
        var moneyValue = parseFloat(value.replace(/,/g,'')).toFixed(2);
      }
      return currencySymbol + this.abbreviateNumber(parseFloat(moneyValue));
    }

  }

	private abbreviateNumber(value: any): any {
    var newValue = value;
    value = Math.floor(value);
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        // Instead of displaying 0.59T, display 587.6B - when trillion is at least 1, then display in trillions
        if ((value >= 100000000000) && (value <= 1000000000000)) {
        	var suffixNum = Math.floor( (""+value).length/4 );
        } else {
	        var suffixNum = Math.floor( (""+value).length/3 );
        }
        var shortValue;
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toFixed(2));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        let shortNum;
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
	}

  private commarize(value: any): string
  {
    // 1e6 = 1 Million, begin with number to word after 1e6.
    if (value >= 1e6)
    {
      var units =
      [
        "M",
        "B",
        "T",
        "Q",
        "Q",
        "S",
        "S",
        "O"
        // ... Put others here, you can look them up here:
        // http://bmanolov.free.fr/numbers_names.php
        // If you prefer to automate the set of numbers, look at the number vocabulary:
        // https://gist.github.com/MartinMuzatko/1b468b7596c71e83838c
        // Javascript allows plain numbers to a maximum of ~1.79e308
      ]

      // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
      var unit = Math.floor((value / 1000).toFixed(0).toString().length)
      // Calculate the remainder. 1,000,000 = 1.000 Mill
      let un1 = parseFloat(('1e'+(unit+2)));
      var num = (value / (un1)).toFixed(3)
      var unitname = units[Math.floor(unit / 3) - 1]
      // output number remainder + unitname
      return num + unitname
    }

    // Split floating number
    var parts = value.toString().split(".")
    // Only manipulate first part (not the float number)
    // If you prefer europe style numbers, you can replace . with ,
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".")
  }

}
