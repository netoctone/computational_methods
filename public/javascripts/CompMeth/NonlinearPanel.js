Ext.ns('CompMeth');

CompMeth.NonlinearPanel = Ext.extend(Ext.Panel, {
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
          value: '4*x - cos(x)'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Function',
          name: 'input[rec_func]',
          allowBlank: false,
          readOnly: true,
          value: 'cos(x)/4'
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
          fieldLabel: 'Epsilon',
          name: 'input[eps]',
          allowBlank: false
        }
      ],
      buttons: [
        {
          text: 'find roots',
          handler: function() {
            form.getForm().submit({
              url: 'input/nonlinear_equations.json',
              success: function(basicForm, action) {
                var str = ""
                    roots = action.result.roots;
                for(var i = 0; i != roots.length; i++) {
                  str += 'x' + (i + 1) + ' = ' + roots[i] + '<br/>';
                }
                Ext.Msg.alert('Found roots', str);
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
      title: 'Nonlinear equations',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.NonlinearPanel.superclass.initComponent.apply(this, arguments);
  }
});
