import { render } from '@testing-library/react';

import VivViewer from './viv-viewer';

describe('VivViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VivViewer />);
    expect(baseElement).toBeTruthy();
  });
});
