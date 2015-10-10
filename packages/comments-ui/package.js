Package.describe({
  name: 'comments-ui',
  summary: 'Simple templates for disqus-like comment functionality'
});

Package.onUse(function(api) {
  // Meteor Version
  api.versionsFrom('METEOR@1.0.1');

  // Meteor Core Dependencies
  api.use(['accounts-password@1.0.1'], { weak: true });
  api.use([
    'underscore', 'mongo-livedata', 'templating', 'jquery', 'check', 'less', 'tracker', 'check', 'session', 'random'
  ]);

  // Atmosphere Package Dependencies
  api.use([
    'aldeed:collection2@2.2.0', 'aldeed:simple-schema@1.2.0', 'dburles:collection-helpers@1.0.1',
    'flamparski:moment-locales@0.0.3', 'utilities:avatar@0.9.0', 'reywood:publish-composite@1.3.5',
    'aldeed:template-extension@3.1.1'
  ]);

  // Package specific globals and files
  api.addFiles('lib/model.js');
  api.addFiles(['lib/templates.html', 'lib/templates/commentsBox.less']);
  api.addFiles(['lib/ui.js', 'lib/templates/commentsBox.js'], 'client');
  api.export('Comments');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'accounts-password']);
  api.use('arkham:comments-ui');

  api.addFiles('tests/api-tests.js');
  api.addFiles('tests/ui-tests.js', 'client');
});
