Ext.ns('CompMeth');

CompMeth.MainFooter = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var config = {
      html: 'style is @%^*%, i know, but i\'m not a designer',
      style: {
        'font-size': '0.8em',
        'text-align': 'center'
      }
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.MainFooter.superclass.initComponent.apply(this, arguments);
  }
});
