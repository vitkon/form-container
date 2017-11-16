import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import connectForm from '../FormContainer';


describe('Form container', () => {
  it('should export connectForm function by default', () => {
    expect(connectForm).toBeDefined;
  });
});