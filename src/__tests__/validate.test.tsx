import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import * as validation from '../validate';
import { isRequired } from '../validators';
const hoistNonReactStatics = require('hoist-non-react-statics');

describe('Validation', () => {
  
  describe('validate', () => {
    
    it('should return a valid result of validationFn execution', () => {
      const MockComponent = ({ formMethods: { bindInput }, form }) => (
        <form>
        <input {...bindInput('foo') } />
        </form>
      );
      const props = {
        form: {
          model: {
            foo: 'test'
          }
        }
      };
      const result = validation.validate([])(MockComponent as any)(props);
      expect(result.props).toEqual({
        form: {
          isValid: true,
          model: {
            foo: 'test'
          },
          validationErrors: {}
        }
      });
    });

    it('should return a invalid result of validationFn execution', () => {
      const MockComponent = ({ formMethods: { bindInput }, form }) => (
        <form>
        <input {...bindInput('foo') } />
        </form>
      );
      const props = {
        form: {
          model: {
            foo: ''
          }
        }
      };
      const result = validation.validate([ isRequired('foo', 'Required field') ])(MockComponent as any)(props);
      expect(result.props).toEqual({
        form: {
          isValid: false,
          model: {
            foo: ''
          },
          validationErrors: {
            foo: 'Required field'
          }
        }
      });
    });
  });
})