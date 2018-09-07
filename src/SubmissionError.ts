import ExtendableError from 'es6-error';

export class SubmissionError<T = any> extends ExtendableError {
    errors: { [key in keyof T]: string };

    constructor(errors: { [key in keyof T]: string }) {
        super('Submit validation failed');
        this.errors = errors;
    }
}

export default SubmissionError;
