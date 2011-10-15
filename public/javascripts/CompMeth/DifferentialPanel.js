Ext.ns('CompMeth');

CompMeth.DifferentialPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var form = new Ext.FormPanel({
      border: false,
      width: 275,
      labelWidth: 75,
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'du1/dx',
          name: 'input[deriv_u1]',
          allowBlank: false,
          readOnly: true,
          value: 'u[0]/x - u[1]/(E**x) + 1'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'du2/dx',
          name: 'input[deriv_u2]',
          allowBlank: false,
          readOnly: true,
          value: 'u[0]/(2*x) + u[1] - 1'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'u1',
          name: 'input[u1]',
          allowBlank: false,
          readOnly: true,
          value: '2*x'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'u2',
          name: 'input[u2]',
          allowBlank: false,
          readOnly: true,
          value: 'E**x'
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
          fieldLabel: 'u1(left)',
          name: 'input[u1_left]',
          allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: 'u2(left)',
          name: 'input[u2_left]',
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
          text: 'find functions',
          handler: function() {
            form.getForm().submit({
              url: 'input/ordinary_differential_equations.json',
              success: function(basicForm, action) {
                var pts           = action.result.pts,
                    u_vals        = action.result.u_vals,
                    u_approx_vals = action.result.u_approx_vals;

                /*
                var diff = [],
                    diff_2 = [];
                for(var i = 0; i != pts.length; i++) {
                  diff.push(derivs[i] - approx_derivs[i]);
                  diff_2.push(derivs_2[i] - approx_derivs_2[i]);
                }
                */

                var fields = ['x'];
                for(var i = 1; i <= u_vals[0].length; i++) {
                  fields.push('y' + i);
                  fields.push('u' + i);
                }

                new Ext.Window({
                  title: 'Approxed functions',
                  layout: 'fit',
                  items: [
                    new Ext.grid.GridPanel({
                      autoWidth: true,
                      height: 400,
                      ds: new Ext.data.ArrayStore({
                        fields: fields,
                        data: function() {
                          var data = [];
                          for(var i = 0; i < u_vals.length; i++) {
                            var u_approx_row = u_approx_vals[i];
                            var u_row = u_vals[i];
                            var row = [ pts[i] ];
                            for(var j = 0; j < u_vals[0].length; j++) {
                              row.push(u_approx_row[j]);
                              row.push(u_row[j]);
                            }
                            data.push(row);
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
                }).show();              },
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
      title: 'Differential equations',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.DifferentialPanel.superclass.initComponent.apply(this, arguments);
  }
});
