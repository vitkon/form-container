import * as React from 'react';
import { connectForm, IFormProps } from 'form-container';
import { email, required, alphaNumeric, strongPassword } from './validators';
import { Button, CardActions, CardHeader, CardContent } from 'material-ui-next';
import { IBoundInputs } from 'form-container/interfaces';

interface IProps extends IFormProps {}

const Addresses = (bound: IBoundInputs) => {
    const { fields, ...rest } = bound;

    console.log({ fields });

    return (
        <div>
            {fields.map(({ name, values }, index) => {
                return (
                    <div key={index}>
                        <div>
                            <label>
                                <span>Address line 1:</span>
                                <input
                                    name={`${name}.addressLine1`}
                                    value={values.addressLine1}
                                    {...rest}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>Address line 2:</span>
                                <input
                                    name={`${name}.addressLine2`}
                                    value={values.addressLine2}
                                    {...rest}
                                />
                            </label>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

class Form extends React.Component<IProps, {}> {
    handleSubmit = (e: React.SyntheticEvent<any>) => {
        e.preventDefault();

        if (!this.props.form.isValid) {
            console.error('Please fix all errors on the form before submission');
            return;
        }

        const { model } = this.props.form;
        console.log(model);
    };

    dirtyInputError = (prop: string) =>
        this.props.form.touched[prop] && this.props.form.validationErrors[prop];

    render() {
        const { formMethods: { bindInputArray }, form } = this.props;

        return (
            <form name="login" onSubmit={this.handleSubmit}>
                <CardHeader title="Sign in" subheader="form-container example" />
                <CardContent>
                    <Addresses {...bindInputArray('addresses')} />
                    <div style={{ marginTop: '20px' }}>{JSON.stringify(form.model)}</div>
                </CardContent>
                <CardActions>
                    <Button fullWidth={true} type="submit" color="primary" disabled={!form.isValid}>
                        Sign in
                    </Button>
                </CardActions>
            </form>
        );
    }
}

const validators = [
    required('email'),
    required('password'),
    email('email'),
    alphaNumeric('password'),
    strongPassword('password')
];

export const ConnectedForm = connectForm(validators, {
    initialModel: {
        addresses: [
            {
                addressLine1: '1 Buckingham Palace'
            },
            {
                addressLine1: 'My awesome company',
                addressLine2: '1 Main Street'
            }
        ]
    }
})(Form);
