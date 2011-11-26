Ext.ns('CompMeth');

CompMeth.ConditionalMinimizationPanel = Ext.extend(Ext.Panel, {
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
          readOnly: true,
          value: '100*(x[1]+x[0]**2)**2 + (1-x[0])**2'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Precision',
          name: 'input[precision]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'x0',
          name: 'input[x0]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'x1',
          name: 'input[x1]',
          allowBlank: false
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
          fieldLabel: 'Step width',
          name: 'input[step]',
          allowBlank: false
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Fibonacci iterations number',
          name: 'input[fib_iter_num]',
          allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Condition 0 > ',
          name: 'input[less_than_fine]',
          allowBlank: false,
          readOnly: true,
          value: '2 - x[0]'
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Condition multiplier',
          name: 'input[less_than_fine_coeff]',
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: 'find minimum point',
          handler: function() {
            form.getForm().submit({
              url: 'input/conditional_multiple_minimization.json',
              success: function(basicForm, action) {
                var str = ""
                    point = action.result.point;
                for(var i = 0; i != point.length; i++) {
                  str += 'x' + i + ' = ' + point[i] + '<br/>';
                }
                Ext.Msg.alert('Found point', str);
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
      title: 'Conditional minimization',
      items: [ form ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.ConditionalMinimizationPanel.superclass.initComponent.apply(this, arguments);
  }
});
