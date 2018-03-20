import * as React from 'react';
import { connectForm, IFormProps } from '../../src/main';
import JSONTree from 'react-json-tree';
import * as styles from './form.module.css';

import { isRequired } from '../../src/validators';

export interface IProps extends IFormProps {}

export const Form: React.SFC<IProps> = ({ form, form: { errors }, formMethods: { bindInput } }) => {
    return (
        <div className={styles.view}>
            <div className={styles.form}>
                <h1>Login Form</h1>
                <form name="login-form">
                    <label className={styles.label}>
                        Username:
                        <input {...bindInput('username')} />
                        <span className={styles.error}>{errors['username']}</span>
                    </label>
                    <label className={styles.label}>
                        Password:
                        <input type="password" {...bindInput('password')} />
                        <span className={styles.error}>{errors['password']}</span>
                    </label>
                </form>
            </div>
            <div className={styles.json}>
                <JSONTree data={form} />
            </div>
        </div>
    );
};

export const ConnectedForm = connectForm<IProps>({
    errors: [isRequired('username', 'please enter your username')],
    middleware: props => ({
        ...props,
        test: 'one'
    })
})(Form);
