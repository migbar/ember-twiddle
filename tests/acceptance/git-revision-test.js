import { test } from 'qunit';
import moduleForAcceptance from 'ember-twiddle/tests/helpers/module-for-acceptance';
import { stubValidSession } from 'ember-twiddle/tests/helpers/torii';

moduleForAcceptance('Acceptance | gist-revision', {
  beforeEach: function() {
    this.cacheConfirm = window.confirm;
    window.confirm = () => true;
  },

  afterEach: function() {
    window.confirm = this.cacheConfirm;
  }
});

test('Able to load a previous revision of a gist', function(assert) {

  const files = [
    {
      filename: "application.template.hbs",
      content: "Hello, World!"
    }
  ];

  runRevision(files);

  andThen(function() {
    const outputDiv = 'div';

    assert.equal(outputContents(outputDiv), 'Hello, World!', 'Previous version of a gist is displayed');
  });
});

test('Able to copy a revision into new gist', function(assert) {
  // set owner of gist as currently logged in user
  stubValidSession(this.application, {
    currentUser: { login: "Gaurav0" },
    "github-oauth2": {}
  });

  runRevision([
    {
      filename: 'application.template.hbs',
      content: 'hello world!'
    }
  ]);

  andThen(function() {
    assert.equal(find('.test-unsaved-indicator').length, 0, "No unsaved indicator shown");
  });

  fillIn('.title input', "my twiddle");
  andThen(function() {
    assert.equal(find('.title input').val(), "my twiddle");
  });

  click('.test-copy-action');

  andThen(function() {
    waitForLoadedIFrame();
  });

  andThen(function() {
    assert.equal(find('.title input').val(), "New Twiddle", "Description is reset");
    assert.equal(find('.test-unsaved-indicator').length, 0, "Unsaved indicator does not appear when gist is copied");
    assert.equal(find('.test-copy-action').length, 0, "Menu item to copy gist is not shown anymore");
    assert.equal(outputContents('div'), 'hello world!');
  });
});
