import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { connectForm } from '../FormContainer';

describe('Form container', () => {
  it('should export connectForm function by default', () => {
    expect(connectForm).toBeDefined;
  });

  describe('render', () => {
    let wrapperComponent;
    let wrappedComponent;
    let input;

    beforeEach(() => {
      const MockComponent = ({ formMethods: { bindInput } }) => (
        <div>
          <input {...bindInput('foo') } />
        </div>
      );

      const initialModel = {
        foo: 'bananas'
      }

      const formConfig = {
        initialModel: {
          foo: 'bananas'
        },
        middleware: (props: any) => ({ ...props, bar: 'baz' })
      }
      const WrapperComponent = connectForm([], formConfig)(MockComponent);
      wrapperComponent = mount(
        <WrapperComponent />
      );
      wrappedComponent = wrapperComponent.find(MockComponent);
      input = wrapperComponent.find('input');
    });

    it('should render the wrapped component', () => {
      expect(wrappedComponent.length).toEqual(1);
    });

    it('should render the input', () => {
      expect(input.length).toEqual(1);
    });

    describe('wrapper props', () => {
      it('should have form prop', () => {
        expect(wrappedComponent.props()).toHaveProperty('form');
      });

      it('should have form model prop', () => {
        expect(wrappedComponent.props().form).toHaveProperty('model');
      });

      it('should have form inputs prop', () => {
        expect(wrappedComponent.props().form).toHaveProperty('inputs');
      });

      it('should have form touched prop', () => {
        expect(wrappedComponent.props().form).toHaveProperty('touched');
      });

      it('should have formMethods prop', () => {
        expect(wrappedComponent.props()).toHaveProperty('formMethods');
      });

      it('should have formMethods bindInput prop', () => {
        expect(wrappedComponent.props().formMethods).toHaveProperty('bindInput');
      });

      it('should have formMethods bindToChangeEvent prop', () => {
        expect(wrappedComponent.props().formMethods).toHaveProperty('bindToChangeEvent');
      });

      it('should have formMethods setProperty prop', () => {
        expect(wrappedComponent.props().formMethods).toHaveProperty('setProperty');
      });

      it('should have formMethods setModel prop', () => {
        expect(wrappedComponent.props().formMethods).toHaveProperty('setModel');
      });

      it('should have formMethods setFieldToTouched prop', () => {
        expect(wrappedComponent.props().formMethods).toHaveProperty('setFieldToTouched');
      });

      it('should get run provided middleware', () => {
        expect(wrappedComponent.props()).toHaveProperty('bar');
      });
    });

    describe('bindInput', () => {
      it('should have an input with a name', () => {
        expect(input.prop('name')).toEqual('foo');
      });

      it('should get the value of the input', () => {
        expect(input.prop('value')).toEqual('bananas');
      });

      it('should get the value of the input', () => {
        expect(input.prop('value')).toEqual('bananas');
        input.simulate('change', { target: { name: input.prop('name'), value: 'apples' } });
        const updatedInput = wrapperComponent.find('input');
        expect(updatedInput.prop('value')).toEqual('apples');
      });

      it('should set field to touched on blur', () => {
        expect(wrapperComponent.state('touched')).toEqual({});
        input.simulate('blur');
        expect(wrapperComponent.state('touched')).toEqual({ foo: true });
      });
    });
  })
});