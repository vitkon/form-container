import { ValidationRuleFactory } from 'form-container';
import * as isEmail from 'validator/lib/isEmail';
import * as isAlphanumeric from 'validator/lib/isAlphanumeric';

type Condition = (value: string, allProps?: any) => boolean;

const isValidEmail: Condition = value => (value ? isEmail(value) : true);
const isRequired: Condition = value => !!value;
const isAlphaNumeric: Condition = value => (value ? isAlphanumeric(value) : true);
const hasMoreThan6Chars: Condition = value => (value ? value.length > 6 : true);

export const email = ValidationRuleFactory(isValidEmail, 'Please enter a valid email');

export const required = ValidationRuleFactory(isRequired, 'This field is required');

export const alphaNumeric = ValidationRuleFactory(
    isAlphaNumeric,
    'This field needs to be alphanumeric'
);

export const strongPassword = ValidationRuleFactory(
    hasMoreThan6Chars,
    'We recommend password to contain more than 6 characters for security purposes',
    'warning'
);
