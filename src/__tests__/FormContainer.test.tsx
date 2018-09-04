import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import { connectForm } from '../FormContainer';
import * as validation from '../validate';
import { ValidationRuleFactory } from '../validators';
import { Condition, IFormProps } from '../interfaces';
import { SubmissionError } from '../SubmissionError';

const isRequired: Condition = value => !!value;
const required = ValidationRuleFactory(isRequired, 'This field is required');

class MockComponent extends React.Component<IFormProps> {
    render() {
        const { formMethods: { bindInput, bindNativeInput, setProperty }, form } = this.props;

        return (
            <form>
                <input {...bindInput('foo')} />
                <input {...bindNativeInput('nativeFoo')} />
            </form>
        );
    }
}

const setupTest = (formConfig = {}, validators = []) => {
    ({ formMethods: { bindInput, bindNativeInput, setProperty }, form }) => (
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
            expect(state.submitErrors).toEqual({});
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
                'setProperty',
                'handleSubmit'
            ];

            expect(wrappedComponent.props()).toHaveProperty('formMethods');
            requiredProps.forEach(prop =>
                expect(wrappedComponent.props().formMethods).toHaveProperty(prop)
            );
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

    describe('setProperty', () => {
        it('should set property', () => {
            const foo = 'bananas';
            const bar = 'cherries';
            const baz = 'plums';
            const initialModel = { foo };
            const { wrappedComponent, wrapperComponent } = setupTest({ initialModel });
            const instance: any = wrapperComponent.instance();

            const formMethods = wrappedComponent.prop('formMethods');
            formMethods.setProperty('bar', bar);
            formMethods.setProperty('baz', baz);

            expect(wrapperComponent.state().model).toEqual({
                foo,
                bar,
                baz
            });
        });
    });

    describe('clearSubmitError', () => {
        it('should unset submissionError if one is present for property', () => {
            const foo = 'bananas';
            const bar = 'apples';
            const baz = 'pears';
            const initialModel = { foo, bar };
            const { wrappedComponent, wrapperComponent } = setupTest({ initialModel });

            const submitErrors = {
                foo: 'Failed',
                bar: 'Failed badly'
            };
            wrapperComponent.setState({ submitErrors });

            const formMethods = wrappedComponent.prop('formMethods');
            formMethods.clearSubmitError('foo');

            expect(wrapperComponent.state().submitErrors).toEqual({
                bar: 'Failed badly'
            });
        });
    });

    describe('handleSubmit', () => {
        it('should call provided submit function with form model', () => {
            const model = {
                foo: 'boo',
                bar: 'woo'
            };
            const { wrapperComponent, wrappedComponent } = setupTest({ initialModel: model });
            const submitResult = {
                foo: 'bar'
            };
            const mockSubmit = jest.fn().mockImplementation(() => Promise.resolve(submitResult));

            const formMethods = wrappedComponent.props().formMethods;
            formMethods.handleSubmit(mockSubmit)();

            expect(mockSubmit).toHaveBeenCalledTimes(1);
            expect(mockSubmit).toHaveBeenCalledWith(model);
        });

        it('should return result of submit', () => {
            const { wrapperComponent, wrappedComponent } = setupTest();
            const submitResult = {
                foo: 'bar'
            };
            const mockSubmit = jest.fn().mockImplementation(() => Promise.resolve(submitResult));

            const formMethods = wrappedComponent.props().formMethods;
            const handleSubmit = formMethods.handleSubmit(mockSubmit);

            return handleSubmit().then(result => {
                expect(result).toBe(submitResult);
            });
        });

        it('should throw errors', () => {
            const { wrapperComponent, wrappedComponent } = setupTest();
            const mockSubmit = jest.fn().mockImplementation(() => {
                throw new Error('Something went wrong!');
            });

            const formMethods = wrappedComponent.props().formMethods;
            const handleSubmit = formMethods.handleSubmit(mockSubmit);

            expect(() => handleSubmit()).toThrow('Something went wrong!');
        });

        it('should set submission errors if SubmissionError is thrown', () => {
            const { wrapperComponent, wrappedComponent } = setupTest();
            const submitErrors = {
                foo: 'Failed!'
            };
            const throwableError = new SubmissionError(submitErrors);
            const mockSubmit = jest.fn().mockImplementation(() => Promise.reject(throwableError));

            const formMethods = wrappedComponent.props().formMethods;
            const handleSubmit = formMethods.handleSubmit(mockSubmit);

            return handleSubmit().catch(error => {
                expect(error).toBe(throwableError);
                expect(wrapperComponent.state().submitErrors).toEqual(submitErrors);
            });
        });

        it('should not set submission errors if thrown error is not SubmissionError', () => {
            const { wrapperComponent, wrappedComponent } = setupTest();
            const submitErrors = {
                foo: 'Failed!'
            };
            const mockSubmit = jest.fn().mockImplementation(() => Promise.reject(submitErrors));

            const formMethods = wrappedComponent.props().formMethods;
            const handleSubmit = formMethods.handleSubmit(mockSubmit);

            return handleSubmit().catch(error => {
                expect(wrapperComponent.state().submitErrors).toEqual({});
            });
        });
    });
});
