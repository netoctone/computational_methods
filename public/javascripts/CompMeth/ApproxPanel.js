Ext.ns('CompMeth');

CompMeth.ApproxPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var form = new Ext.FormPanel({
      border: false,
      width: 275,
      labelWidth: 75,
      items: [
        {
          xtype: 'numberfield',
          fieldLabel: 'Polynom degree',
          name: 'input[degree]',
          allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Function',
          name: 'input[func]',
          allowBlank: false,
          readOnly: true,
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
          fieldLabel: 'Initial points num',
          name: 'input[pts]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Determine points num',
          name: 'input[det_pts]',
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: 'Determine values and inaccuracies',
          handler: function() {
            form.getForm().submit({
              url: 'input/approximate_func.json',
              success: function(basicForm, action) {
                var poly     = 'Polynom: ' + action.result.polynom,
                    indep    = action.result.independent,
                    depend   = action.result.dependent,
                    approxed = action.result.approxed,
                    inaccur  = action.result.inaccuracies;
                new Ext.Window({
                  title: poly,
                  layout: 'fit',
                  items: [
                    new Ext.grid.GridPanel({
                      autoWidth: true,
                      height: 400,
                      ds: new Ext.data.ArrayStore({
                        fields: ['x', 'y', 'approx', 'diff'],
                        data: function() {
                          var data = [];
                          for(var i = 0; i < depend.length; i++) {
                            data.push([
                              indep[i], depend[i], approxed[i], inaccur[i]
                            ]);
                          }
                          return data;
                        }()
                      }),
                      cm: new Ext.grid.ColumnModel({
                        defaultSortable: false,
                        columns: [
                          {
                            header: 'x',
                            dataIndex: 'x'
                          },
                          {
                            header: 'y',
                            dataIndex: 'y'
                          },
                          {
                            header: 'approx',
                            dataIndex: 'approx'
                          },
                          {
                            header: 'diff = y - approx',
                            dataIndex: 'diff'
                          }
                        ]
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
      title: 'Func approx',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.ApproxPanel.superclass.initComponent.apply(this, arguments);
  }
});
