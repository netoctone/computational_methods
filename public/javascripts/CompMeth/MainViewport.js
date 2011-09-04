Ext.ns('CompMeth');

CompMeth.MainViewport = Ext.extend(Ext.Viewport, {
  initComponent: function() {
    var centerTabPanel = new Ext.TabPanel({
      region: 'center',
      activeItem: 0,
      items: [
        new CompMeth.SLEPanel()
      ]
    });

    var config = {
      layout: 'border',
      items: [
        new Ext.Panel({
          region: 'center',
          title: 'Computational methods',
          border: false,
          layout: 'fit',
          items: [ centerTabPanel ]
        }),
        new CompMeth.MainFooter({ region: 'south' })
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.MainViewport.superclass.initComponent.apply(this, arguments);
  }
});
