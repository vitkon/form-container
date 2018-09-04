import { SubmissionError } from '../SubmissionError';

describe('SubmissionError', () => {
    it('should be populated with errors', () => {
        const errors = {
            foo: 'Failed'
        };
        const submissionError = new SubmissionError(errors);

        expect(submissionError.errors).toEqual(errors);
    });
});
