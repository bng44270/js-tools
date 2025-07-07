/*

Requires datadef.js

Simple UI for interacting wtih DataDef objects

Usage:

    var editor = new DataDefEditor('<EDITOR_ID>',{
        fields : <SCHEMA-OBJECT>,
        data : <DATA-OBJECT>,
        onLoad : <LOAD-FUNCTION>
        onCommit : <COMMIT-FUNCTION>
    });

    document.body.appendChild(editor);

<EDITOR-ID> - ID of DOM container of the editor
<SCHEMA-OBJECT> - Schema object (same as DataDef)
<DATA-OBJECT> - Data to pre-populate in object (same as DataDef) - optional
<LOAD-FUNCTION> - function to exeute when the editor interface loads (requires 1 argument representing the DataDef object) - optional
<COMMIT-FUNCTION> - function to exeute when the "Commit" button is clicked (requires 1 argument representing the DataDef object) - optional


Example:

    var editor = new DataDefEditor('mydataedit',{
        fields : {
            name : DataDef.StringType,
            age : DataDef.NumberType,
            active : DataDef.BooleanType
        },
        data : [
            { name : "Bob", age : 34, active : true},
            { name : "Jim", age : 54, active : false}
        ],

        //Save data in DataDef object to Local Storage
        onCommit : function(d) {
            localStorage['datastorage'] = JSON.stringify(d);
        },

        //Load data into DataDef object from Local Storage
        onLoad : function(d) {
            var localStorageExists = Object.keys(localStorage).indexOf('datastorage') > -1;

            if (localStorageExists) {
                JSON.parse(localStorage['datastorage']).forEach(row => {
                    d.insert(row);
                });
            }
        }
    })
*/

class DataDefEditor extends DataDef {
    constructor(id,options) {
        if (Object.keys(options).indexOf('fields') > -1) {
            if (Object.keys(options).indexOf('data') > -1) {
                super(options.fields,options.data);
            }
            else {
                super(options.fields);
            }

            this.onCommit = (Object.keys(options).indexOf('onCommit') > -1) ? options.onCommit : function() { };

            this.onLoad = (Object.keys(options).indexOf('onLoad') > -1) ? options.onLoad : function() { };

            this.TABLEID = id + '_datatable';

            this.container = document.createElement('div');
            this.container.id = id;

            this.onLoad(this);

            this.buildUI();

            return this.container;
        }
    }

    buildUI() {
        var addButton = document.createElement('button');
        addButton.innerText = "Add record";
        addButton.addEventListener('click',this.addRecord.bind(this),false);

        this.container.appendChild(addButton);

        var commitButton = document.createElement('button');
        commitButton.innerText = 'Commit';
        commitButton.addEventListener('click',this.commit.bind(this),false);

        this.container.appendChild(commitButton);

        var table = document.createElement('table');
        table.id = this.TABLEID;

        var tableHeader = document.createElement('tr');

        Object.keys(this.SCHEMA).forEach(thisField => {
            var thisColumn = document.createElement('td');
            thisColumn.innerText = thisField;
            thisColumn.style.fontWeight = 'bold';
            tableHeader.appendChild(thisColumn);
        });

        table.appendChild(tableHeader);

        this.forEach(record => {
            var newRow = this.addRow(record);

            table.appendChild(newRow);
        });

        this.container.appendChild(table);
    }

    commit() {
        var tmpAr = [];

        var rows = Array.prototype.slice.call(document.querySelectorAll('tr.datarow'));

        rows.forEach(tableRow => {
            var dataRow = {};

            Object.keys(this.SCHEMA).forEach(thisField => {
                dataRow[thisField] = "";
            });

            Object.keys(dataRow).forEach(thisField => {
                if (this.SCHEMA[thisField] == DataDef.BooleanType) {
                    dataRow[thisField] = tableRow.querySelector('input.field_' + thisField).checked;
                }
                else if (this.SCHEMA[thisField] == DataDef.NumberType){
                    dataRow[thisField] = parseFloat(tableRow.querySelector('input.field_' + thisField).value);
                }
                else if (this.SCHEMA[thisField] == DataDef.StringType) {
                    dataRow[thisField] = tableRow.querySelector('input.field_' + thisField).value.toString();
                }
                else {
                    throw new SchemaError("Invalid field type (" + this.SCHEMA[thisField] + ")");
                }
            });

            tmpAr.push(dataRow);
        });

        this.deleteAll();
        this.bulkInsert(tmpAr);

        this.onCommit(this);
    }

    focusNewRow() {
        var firstField = document.querySelectorAll('input.field_' + Object.keys(this.SCHEMA)[0]);
        firstField[firstField.length - 1].focus();
    }

    addRow(thisRecord = false) {
        var dataRow = document.createElement('tr');
        dataRow.className = "datarow";

        if (!thisRecord) {
            thisRecord = {};

            Object.keys(this.SCHEMA).forEach(thisField => {
                if (this.SCHEMA[thisField] == DataDef.NumberType) {
                    thisRecord[thisField] = 0;
                }
                else if (this.SCHEMA[thisField] == DataDef.StringType) {
                    thisRecord[thisField] = "";
                }
                else if (this.SCHEMA[thisField] == DataDef.BooleanType) {
                    thisRecord[thisField] = false;
                }
                else {
                    throw new SchemaError("Invalid data type (" + thisField + ")");
                }
            });
        }

        Object.keys(thisRecord).forEach(thisField => {
            var dataColumn = document.createElement('td');

            var type = this.SCHEMA[thisField];
            var inputField = document.createElement('input');
            inputField.className = "field_" + thisField;

            if (type == DataDef.StringType) {
                inputField.type = 'text';
                inputField.value = thisRecord[thisField];

                inputField.addEventListener('focus',function() {
                    inputField.select();
                });
            }
            else if (type == DataDef.NumberType) {
                inputField.type = 'number';
                inputField.value = thisRecord[thisField];

                inputField.addEventListener('input', function()  {
                    if (inputField.value.toString().length == 0) {
                        inputField.value = 0;
                        inputField.select();
                    }
                });

                inputField.addEventListener('focus',function() {
                    inputField.select();
                });
            }
            else if (type == DataDef.BooleanType) {
                inputField.type = 'checkbox';
                inputField.checked = thisRecord[thisField];
            }

            dataColumn.appendChild(inputField);

            dataRow.appendChild(dataColumn);
        });

        var deleteBtn = document.createElement('button');
        deleteBtn.innerText = "X"
        deleteBtn.onclick = function() {
            dataRow.remove();
        };

        dataRow.append(deleteBtn);

        return dataRow;
    }

    addRecord() {
        var table = document.getElementById(this.TABLEID);

        var newRow = this.addRow();

        table.appendChild(newRow);

        this.focusNewRow()
    }
}
