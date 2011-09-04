Ext.ns('CompMeth');

CompMeth.SLEPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var config = {
      title: 'SLE',
      html: 'SLE Panel'
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.SLEPanel.superclass.initComponent.apply(this, arguments);
  }
});
