module.exports = {
  /*
   * If true, include a test runner <script> which will run our 
   * tests on page load. Test will run in the browser, and can 
   * be seen in DevTools/Firebug, or on the command line when 
   * you run `npm test` (using PhantomJS).
   */
  test: false,

  /*
   * Default lorem ipsum values to be inserted into page/templates.
   */
  author: {
    name:     'Your Name Here',
    email:    'name [at] email.com',
    twitter:  '@authorshandle',
    url:      'http://mysite.com/author',
  },
  org: {
    name:     'Beeb',
    url:      'http://mysite.com/',
    twitter:  '@orgshandle',
  },
  meta: {
    title:    'My Article Title',
    desc:     'A description of...',
    keywords: 'space separated list of key words',
    date:     '2017-01-31',
    author:   'Your Name Here',
    url:      'http://mysite.com/demo/',
    topic:    'News',
    keywords: 'news, article, news article,',
  },
  hero: {
    title:    'My Page Heading',
    subtitle: 'A sub-title for this page goes here.',
    name:     'Your Name Here',
    date:     '1st January, 2017',
    image:    'placeholders/800x600.png',
  },
  article: {
    heading:  'Heading',
    para:     'Lorem ipsum thing dolor sit amet, consectetur adipiscing elit. Mauris pharetra erat sit amet orci auctor finibus. Sed at aliquet enim, vel tincidunt mauris.',
  },
  imageCenter: {
    caption:  'Image-center caption goes here',
  },
  imageFixed: {
    title:    'Fade-In Text Over Image',
  },
  inlineImage: {
    src:      'images/placeholders/550x550.png',
  },
};