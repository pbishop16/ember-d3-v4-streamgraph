import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('streamgraph-visualization', 'Integration | Component | streamgraph visualization', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{streamgraph-visualization}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#streamgraph-visualization}}
      template block text
    {{/streamgraph-visualization}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
