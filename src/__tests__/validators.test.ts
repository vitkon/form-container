import { ValidationRuleFactory } from '../validators';

describe('Validators', () => {
  
  describe('ValidationRuleFactory', () => {
    let validationFn, rule;
    
    beforeEach(() => {
      validationFn = jest.fn((value: any, allProps: any) => !!value);
      rule = ValidationRuleFactory(validationFn, 'Error');     
    });
    
    it('should return a result of validationFn execution', () => {
      const scenarios = [
        {model: {foo: ''}, result: false},
        {model: {foo: 'bar'}, result: true}
      ];

      scenarios.forEach(scenario => {
        const [validate, error] = rule('foo');
        const allProps = {form: {}};
        const isValid = validate(scenario.model, allProps);
        expect(validationFn).toBeCalledWith(scenario.model.foo, allProps);
        expect(isValid).toBe(scenario.result);
      });
    });

    it('should return default error message', () => { 
      const [validate, error] = rule('foo');
      expect(error).toEqual({foo: 'Error'});
    });

    it('should return custom error message', () => { 
      const [validate, error] = rule('foo', 'custom error');
      expect(error).toEqual({foo: 'custom error'});
    });
  });
})