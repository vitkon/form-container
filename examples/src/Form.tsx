import * as React from 'react';
import { connectForm, IFormProps } from 'form-container';
import { email, required, alphaNumeric, strongPassword } from './validators';
import { TextField, Button, CardActions, CardHeader, CardContent } from 'material-ui-next';

interface IProps extends IFormProps {}

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
        const { formMethods: { bindInput }, form } = this.props;

        return (
            <form name="login" onSubmit={this.handleSubmit}>
                <CardHeader title="Sign in" subheader="form-container example" />
                <CardContent>
                    <TextField
                        style={{ marginBottom: '20px' }}
                        label="Enter your email"
                        fullWidth={true}
                        error={!!this.dirtyInputError('email')}
                        helperText={this.dirtyInputError('email')}
                        {...bindInput('email')}
                    />
                    <TextField
                        type="password"
                        style={{ marginBottom: '20px' }}
                        label="Enter your password"
                        fullWidth={true}
                        error={!!this.dirtyInputError('password')}
                        helperText={
                            this.dirtyInputError('password') || form.validationWarnings.password
                        }
                        {...bindInput('password')}
                    />
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

export const ConnectedForm = connectForm(validators)(Form);
