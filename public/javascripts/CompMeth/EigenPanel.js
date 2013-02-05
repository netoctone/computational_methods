Ext.ns('CompMeth');

CompMeth.EigenPanel = Ext.extend(Ext.Panel, {
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
              data.push(record);
            }

            var store = new Ext.data.ArrayStore({
              fields: fields,
              data: data
            });

            var gridConf = {
              xtype: 'editorgrid',
              border: false,
              width: 60*dim + 4,
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

            var inputForm = new Ext.FormPanel({
              border: false,
              width: 275,
              labelWidth: 75,
              items: [
                {
                  xtype: 'numberfield',
                  fieldLabel: 'Left',
                  name: 'left'
                },
                {
                  xtype: 'numberfield',
                  fieldLabel: 'Right',
                  name: 'right'
                }
              ]
            });

            new Ext.Window({
              title: 'Fill matrix A and vector B',
              layout: 'vbox',
              layoutConfig: {
                align: 'stretch'
              },
              items: [
                gridConf,
                inputForm
              ],
              buttons: [
                {
                  text: 'Find eigen',
                  handler: function() {
                    var inpForm = inputForm.getForm();
                    if (inputForm.getForm) {
                      var coeffs = new Array();
                      for(var i = 0; i < dim; i++) {
                        var row = new Array();
                        var record = store.getAt(i);
                        for(var j = 0; j < dim; j++) {
                          row.push(record.get(j.toString()));
                        }
                        coeffs.push(row);
                      }

                      var left = inpForm.findField('left').getValue(),
                          right = inpForm.findField('right').getValue();

                      Ext.Ajax.request({
                        url: 'input/eigen_values_and_vectors.json',
                        method: 'put',
                        params: {
                          'input[coeffs]': Ext.encode(coeffs),
                          'input[left]': left,
                          'input[right]': right
                        },
                        waitMsg: 'Finding ...',
                        success: function(resp) {
                          var respObj = Ext.decode(resp.responseText);
                          if(respObj.success) {
                            var eigen = respObj.eigen;
                            var str = "";

                            var i = 1;
                            for(var val in eigen) {
                              var vect = eigen[val];
                              str += 'l' + (i++) + ' = ' + val + '<br/>';
                              for(var j = 0; j < vect.length; j++) {
                                str += 'x' + (j + 1) + ' = ' +
                                       vect[j] + '<br/>';
                              }
                              str += '<br/>';
                            }
                            Ext.Msg.alert('Eigen found', str);
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
                }
              ]
            }).show();
          }
        }
      ]
    });

    var config = {
      title: 'Eigen values and vectors',
      items: [
        form
      ]
    };

    Ext.apply(this, Ext.apply(this.initialConfig, config));

    CompMeth.EigenPanel.superclass.initComponent.apply(this, arguments);
  }
});
