Ext.ns('CompMeth');

CompMeth.SLEPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    var form = new Ext.FormPanel({
      border: false,
      width: 275,
      labelWidth: 75,
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'Dimension',
          name: 'dim'
        }
      ],
      buttons: [
        {
          text: 'Fill matrix',
          handler: function() {
            var dim = form.getForm().findField('dim').getValue();
            var fields = new Array();
            var data = new Array();
            for(var i = 0; i < dim; i++) {
              fields.push(i.toString());
              var record = new Array();
              for(var j = 0; j < dim; j++) {
                if(i == j) {
                  record.push(1);
                } else {
                  record.push(0);
                }
              }
              record.push(1);
              data.push(record);
            }
            fields.push('free');

            var store = new Ext.data.ArrayStore({
              fields: fields,
              data: data
            });

            var gridConf = {
              xtype: 'editorgrid',
              width: 60*dim + 64,
              autoHeight: true,
              store: store,
              cm: new Ext.grid.ColumnModel({
                defaultSortable: false,
                columns: function() {
                  var commonColConf = {
                    width: 60,
                    menuDisabled: true,
                    editor: {
                      xtype: 'textfield',
                      regex: /^(0|-?[1-9][0-9]*)((\/[1-9]|\.)[0-9]*)?$/,
                      regexText: 'only integers ("9"), floats ("9.5") ' +
                                 'or rationals ("5/9")'
                    }
                  }
                  var columns = new Array();
                  for(var i = 0; i < dim; i++) {
                    columns.push(
                      Ext.apply({ header: 'a*' + (i + 1), dataIndex: i },
                                commonColConf)
                    );
                  }
                  columns.push(
                    Ext.apply({ header: 'b*', dataIndex: 'free' },
                              commonColConf)
                  );
                  return columns;
                }()
              }),
              clicksToEdit: 1,
              enableColumnMove: false,
              listeners: {
                afteredit: function(evt) {
                  evt.record.commit();
                }
              }
            };

            new Ext.Window({
              title: 'Fill matrix A and vector B',
              layout: 'fit',
              items: [
                gridConf
              ],
              buttons: [
                {
                  text: 'Find roots',
                  handler: function() {
                    var coeffs = new Array();
                    var free = new Array();
                    for(var i = 0; i < dim; i++) {
                      var row = new Array();
                      var record = store.getAt(i);
                      for(var j = 0; j < dim; j++) {
                        row.push(record.get(j.toString()));
                      }
                      coeffs.push(row);
                      free.push(record.get('free'));
                    }
                    Ext.Ajax.request({
                      url: 'input/solve_sle.json',
                      method: 'put',
                      params: {
                        coeffs: Ext.encode(coeffs),
                        free: Ext.encode(free)
                      },
                      waitMsg: 'Solving ...',
                      success: function(resp) {
                        var respObj = Ext.decode(resp.responseText);
                        if(respObj.success) {
                          var roots = respObj.roots;
                          var str = "";
                          for(var i = 0; i < dim; i++) {
                            str += 'x' + (i + 1) + ' = ' + roots[i] + '<br/>';
                          }
                          Ext.Msg.alert('Roots found', str);
                        } else {
                          Ext.Msg.alert('Error', respObj.errormsg);
                        }
                      },
                      failure: function() {
                        Ext.Msg.alert('Error', 'Server not responding');
                      }
                    });
                  }
                }
              ]
            }).show();
          }
        }
      ]
    });

    var config = {
      title: 'SLE',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.SLEPanel.superclass.initComponent.apply(this, arguments);
  }
});
