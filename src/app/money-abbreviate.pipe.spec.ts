import { MoneyAbbreviatePipe } from './money-abbreviate.pipe';

describe('MoneyAbbreviatePipe', () => {
  it('create an instance', () => {
    const pipe = new MoneyAbbreviatePipe();
    expect(pipe).toBeTruthy();

  });

  it('should summarize $100000000000 to $100B', () => {
    const pipe = new MoneyAbbreviatePipe();
    
    expect(pipe.transform('$100000000000')).toEqual('$100B');
  });

});
