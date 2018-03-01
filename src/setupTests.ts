import React from 'react';
import Enzyme, { shallow, render, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import raf from 'raf';

// Enzyme adapter
configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
(global as any).shallow = shallow;
(global as any).render = render;
(global as any).mount = mount;
