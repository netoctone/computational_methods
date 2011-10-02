Ext.ns('CompMeth');

CompMeth.DerivatIntegPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var form = new Ext.FormPanel({
      border: false,
      width: 275,
      labelWidth: 75,
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'Function',
          name: 'input[func]',
          allowBlank: false,
          disabled: true,
          value: '4*x - 7*sin(x)'
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Left border',
          name: 'input[left]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Right border',
          name: 'input[right]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Number of steps',
          name: 'input[step_num]',
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: 'Determine derivatives and interal',
          handler: function() {
            form.getForm().submit({
              url: 'input/derivat_integ.json',
              success: function(basicForm, action) {
                var pts             = action.result.pts,
                    vals            = action.result.vals,
                    derivs          = action.result.derivs,
                    derivs_2        = action.result.derivs_2,
                    approx_derivs   = action.result.approx_derivs,
                    approx_derivs_2 = action.result.approx_derivs_2,
                    integ           = action.result.integ;

                var diff = [],
                    diff_2 = [];
                for(var i = 0; i != pts.length; i++) {
                  diff.push(derivs[i] - approx_derivs[i]);
                  diff_2.push(derivs_2[i] - approx_derivs_2[i]);
                }

                var fields = ['x', 'f',
                              'f\'', '^1f', 'f\' - ^1f',
                              'f\'\'', '^2f', 'f\'\' - ^2f'];
                new Ext.Window({
                  title: 'Integral value: ' + integ,
                  layout: 'fit',
                  items: [
                    new Ext.grid.GridPanel({
                      autoWidth: true,
                      height: 400,
                      ds: new Ext.data.ArrayStore({
                        fields: fields,
                        data: function() {
                          var data = [];
                          for(var i = 0; i < pts.length; i++) {
                            data.push([
                              pts[i], vals[i],
                              derivs[i], approx_derivs[i], diff[i],
                              derivs_2[i], approx_derivs_2[i], diff_2[i]
                            ]);
                          }
                          return data;
                        }()
                      }),
                      cm: new Ext.grid.ColumnModel({
                        defaultSortable: false,
                        columns: function() {
                          var res = [];
                          Ext.each(fields, function(f) {
                            res.push({ header: f, dataIndex: f });
                          });
                          return res;
                        }()
                      })
                    })
                  ]
                }).show();
              },
              failure: function(basicForm, action) {
                switch (action.failureType) {
                  case Ext.form.Action.CLIENT_INVALID:
                    Ext.Msg.alert('Failure', 'Can\'t submit invalid data');
                    break;
                  case Ext.form.Action.CONNECT_FAILURE:
                    Ext.Msg.alert('Failure', 'Can\'t connect to server');
                    break;
                  case Ext.form.Action.SERVER_INVALID:
                    Ext.Msg.alert('Failure', action.result.msg);
                  }
                }
            });
          }
        }
      ]
    });

    var config = {
      title: 'Dervatives integrals',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.DerivatIntegPanel.superclass.initComponent.apply(this, arguments);
  }
});
