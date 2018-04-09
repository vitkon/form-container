import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { connectForm } from '../FormContainer';
import * as validation from '../validate';
import { isRequired } from '../validators';

const setupTest = (formConfig = {}, validators = []) => {
    const MockComponent = ({ formMethods: { bindInput, bindNativeInput }, form }) => (
        <form>
            <input {...bindInput('foo')} />
            <input {...bindNativeInput('nativeFoo')} />
        </form>
    );
    const WrapperComponent = connectForm(validators, formConfig)(MockComponent);
    const wrapperComponent = mount(<WrapperComponent />);
    const wrappedComponent = wrapperComponent.find(MockComponent);
    const input = wrapperComponent.find('[name="foo"]');
    const nativeInput = wrapperComponent.find('[name="nativeFoo"]');

    return {
        input,
        nativeInput,
        wrappedComponent,
        wrapperComponent
    };
};

describe('Form container', () => {
    it('should export connectForm function by default', () => {
        expect(connectForm).toBeDefined;
    });

    it('should call validate function', () => {
        const mock = jest.fn(rules => component => component);
        (validation as any).validate = jest.fn(rules => component => component);
        const { wrappedComponent } = setupTest({}, [isRequired]);
        expect(validation.validate).toHaveBeenCalledTimes(1);
        expect(validation.validate).toHaveBeenCalledWith([isRequired]);
        mock.mockClear();
    });

    describe('render', () => {
        it('should render the wrapped component', () => {
            const { wrappedComponent } = setupTest();
            expect(wrappedComponent.length).toEqual(1);
        });

        it('should set initial state', () => {
            const { wrapperComponent } = setupTest();
            const state: any = wrapperComponent.state();

            expect(state.model).toEqual({});
            expect(state.touched).toEqual({});
            expect(Object.keys(state.inputs)).toEqual(['nativeFoo']);
        });

        it('should render the input', () => {
            const { input } = setupTest();
            expect(input.length).toEqual(1);
        });
    });

    describe('wrapper props', () => {
        it('should have required form props', () => {
            const { wrapperComponent, wrappedComponent, input } = setupTest();
            const requiredProps: ReadonlyArray<string> = ['model', 'inputs', 'touched'];

            expect(wrappedComponent.props()).toHaveProperty('form');
            requiredProps.forEach(prop =>
                expect(wrappedComponent.props().form).toHaveProperty(prop)
            );
        });

        it('should have required formMethods props', () => {
            const { wrapperComponent, wrappedComponent, input } = setupTest();
            const requiredProps: ReadonlyArray<string> = [
                'bindInput',
                'bindNativeInput',
                'bindToChangeEvent',
                'setFieldToTouched',
                'setModel',
                'setProperty'
            ];

            expect(wrappedComponent.props()).toHaveProperty('formMethods');
            requiredProps.forEach(prop =>
                expect(wrappedComponent.props().formMethods).toHaveProperty(prop)
            );
        });
    });

    describe('setModel', () => {
        it('should set the model and optionally set the touched field', () => {
            const { wrapperComponent, wrappedComponent } = setupTest();
            let state: any = wrapperComponent.state();

            const setModel = wrappedComponent.props().formMethods.setModel;

            let data = { foo: 2 };
            setModel(data);
            state = wrapperComponent.state();
            expect(state.model).toEqual(data);
            expect(state.touched).toEqual({});

            let data = { bar: 1234 };
            setModel(data, true);
            state = wrapperComponent.state();
            expect(state.model).toEqual(data);
            expect(state.touched).toEqual({ bar: true });
        });
    });

    describe('bindInput', () => {
        it('should have an input with a name and a value', () => {
            const { input } = setupTest();
            expect(input.prop('name')).toEqual('foo');
            expect(input.prop('value')).toEqual('');
        });

        it('should change the value of the input', () => {
            const { wrapperComponent, input } = setupTest();
            const newValue = 'apples';

            expect(input.prop('value')).toEqual('');
            input.simulate('change', { target: { name: input.prop('name'), value: newValue } });
            const updatedInput = wrapperComponent.find('[name="foo"]');
            expect(updatedInput.prop('value')).toEqual(newValue);
        });

        it('should set field to touched on blur', () => {
            const { wrapperComponent, input } = setupTest();

            expect(wrapperComponent.state('touched')).toEqual({});
            input.simulate('blur');
            expect(wrapperComponent.state('touched')).toEqual({ foo: true });
        });
    });

    describe('bindNativeInput', () => {
        it('should have an input with a name and a value', () => {
            const { nativeInput } = setupTest();
            expect(nativeInput.prop('name')).toEqual('nativeFoo');
            expect(nativeInput.prop('value')).toEqual('');
        });

        it('should change the value of the input', () => {
            const { wrapperComponent, nativeInput } = setupTest();
            const newValue = 'apples';

            expect(nativeInput.prop('value')).toEqual('');
            nativeInput.simulate('change', {
                target: { name: nativeInput.prop('name'), value: newValue }
            });
            const updatedInput = wrapperComponent.find('[name="nativeFoo"]');
            expect(updatedInput.prop('value')).toEqual(newValue);
        });

        it('should set field to touched on blur', () => {
            const { wrapperComponent, nativeInput } = setupTest();

            expect(wrapperComponent.state('touched')).toEqual({});
            nativeInput.simulate('blur');
            expect(wrapperComponent.state('touched')).toEqual({ nativeFoo: true });
        });
    });

    describe('formConfig', () => {
        it('should should set initial model when it is provided', () => {
            const foo = 'bananas';
            const initialModel = { foo };
            const { input } = setupTest({ initialModel });
            expect(input.prop('value')).toEqual(foo);
        });

        it('should call custom onInputBlur when it is provided', () => {
            const onInputBlur = jest.fn();
            const { wrapperComponent, input } = setupTest({ onInputBlur });
            input.simulate('blur');
            expect(onInputBlur).toHaveBeenCalled;
        });

        it('should call middleware when it is provided', () => {
            const middleware = (props: any) => ({ ...props, bar: 'baz' });
            const { wrappedComponent } = setupTest({ middleware });
            expect(wrappedComponent.props()).toHaveProperty('bar');
        });
    });
});
