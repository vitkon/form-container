import * as React from 'react';
import { connectForm, IFormProps } from '../../src/main';
import * as styles from './form.module.css';
import JsonView from 'react-pretty-json';
import 'react-pretty-json/assets/json-view.css';
import { isRequired } from '../../src/validators';

export interface IProps extends IFormProps {}

export const Form: React.SFC<IProps> = props => {
    const { bindInput } = props.formMethods;
    return (
        <div className={styles.view}>
            <div className={styles.form}>
                <h1>Login Form</h1>
                <form name="login-form">
                    <label className={styles.label}>
                        Username:
                        <input {...bindInput('username')} />
                        <span className={styles.error}>
                            {props.form.validationErrors['username']}
                        </span>
                    </label>
                    <label className={styles.label}>
                        Password:
                        <input type="password" {...bindInput('password')} />
                        <span className={styles.error}>
                            {props.form.validationErrors['password']}
                        </span>
                    </label>
                </form>
            </div>
            <div className={styles.json}>
                <JsonView json={props.form} />
            </div>
        </div>
    );
};

export const ConnectedForm = connectForm([isRequired('username', 'please enter your username')])(
    Form
);
