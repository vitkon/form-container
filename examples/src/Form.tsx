import * as React from 'react';
import { connectForm, IFormProps } from '../../src/main';
import JSONTree from 'react-json-tree';
import * as styles from './form.module.css';

import { isRequired } from '../../src/validators';
import { ValidationType, ValidationRule } from '../../src/interfaces';

export interface IProps extends IFormProps {}

export const Form: React.SFC<IProps> = ({
    form,
    form: { validationErrors, validationWarnings },
    formMethods: { bindInput }
}) => (
    <div className={styles.view}>
        <div className={styles.form}>
            <h1>Login Form</h1>
            <form name="login-form">
                <label className={styles.label}>
                    Username:
                    <input {...bindInput('username')} />
                    <span className={styles.error}>{validationErrors['username']}</span>
                    <span className={styles.warning}>{validationWarnings['username']}</span>
                </label>
                <label className={styles.label}>
                    Password:
                    <input type="password" {...bindInput('password')} />
                    <span className={styles.error}>{validationErrors['password']}</span>
                    <span className={styles.warning}>{validationWarnings['password']}</span>
                </label>
            </form>
        </div>
        <div className={styles.json}>
            <JSONTree data={form} />
        </div>
    </div>
);

const hasMoreThanFiveChars: ValidationRule = (
    prop,
    errorMessage = `${prop} is less than 5 chars`,
    type: ValidationType = ValidationType.Error
) => [model => (model[prop] ? model[prop].length >= 5 : true), { [prop]: errorMessage }, type];

export const ConnectedForm = connectForm<IProps>(
    [
        isRequired('username', 'please enter your username'), // error by default
        isRequired('password', 'please enter your password', ValidationType.Error),
        hasMoreThanFiveChars(
            'password',
            'you might want to enter a longer password',
            ValidationType.Warning
        )
    ],
    {
        middleware: props => ({
            ...props
        })
    }
)(Form);
