import { SoftwarePage } from './app.po';

describe('software App', () => {
  let page: SoftwarePage;

  beforeEach(() => {
    page = new SoftwarePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
