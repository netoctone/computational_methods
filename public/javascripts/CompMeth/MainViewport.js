Ext.ns('CompMeth');

CompMeth.MainViewport = Ext.extend(Ext.Viewport, {
  initComponent: function() {
    var centerTabPanel = new Ext.TabPanel({
      region: 'center',
      activeItem: 0,
      items: [
        new CompMeth.SLEPanel(),
        new CompMeth.ApproxPanel(),
        new CompMeth.DerivatIntegPanel(),
        new CompMeth.NonlinearPanel(),
        new CompMeth.DifferentialPanel(),
        new CompMeth.MinimizationPanel(),
        new CompMeth.ConditionalMinimizationPanel()
      ]
    });

    var config = {
      layout: 'border',
      items: [
        centerTabPanel
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.MainViewport.superclass.initComponent.apply(this, arguments);
  }
});
