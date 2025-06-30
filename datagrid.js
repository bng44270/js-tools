/*

Simple Way to display/edit a two dimensional array

Usage:

    var data = [['a','b','c'],['d','e','f']];
    var grid = new DataGrid(data,{
        parent : 'sectionid'
        onCommit : function(d) {
            var j = JSON.stringify(d);
            console.log(j);
        }
    });

The second argument is an object containing options for the data grid.
This argument, along with both of the options within the object, are optional.

    parent - the ID of the DOM element to place the data grid inside
    onCommit - the function to execute when the "Save" button is clicked.  The function accepts the data array as an argument.

Stylesheets may be used to add style to the <tr> and <td> HTML tags along with the following classes:

    datadisp - non-editable data display
    dataedit - data editing input field

*/
class DataGrid {
    constructor(data,options={}) {
        if (this.validData(data)) {
            this.data = data;

            this.rows = data.length;
            this.cols = data[0].length;

            this.parentId = (Object.keys(options).indexOf('parent') > -1) ? options['parent'] : '';

            this.buildGrid();

            this.populateGrid();

            this.onCommit = (Object.keys(options).indexOf('onCommit') > -1) ? options['onCommit'] : function(d) { };
        }
    }

    buildGrid() {
        var tableDisp = document.createElement('div');
        var dataTable = document.createElement('table');

        this.data.forEach((row,rowIdx) => {
            var dataRow = document.createElement('tr');

            row.forEach((cell,cellIdx) => {
                var dataCell = document.createElement('td');

                var disp = document.createElement('span');
                disp.setAttribute('class','datadisp');
                disp.id = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                disp.style.display = 'inline';
                disp.ondblclick = function() {
                    var cellId = this.id.replace(/^datadisp/,'dataedit');
                    this.style.display = 'none';
                    var cell = document.getElementById(cellId);
                    cell.style.display = 'inline';
                    cell.value = this.innerText;
                };
                dataCell.appendChild(disp);

                var edit = document.createElement('input');
                edit.type = 'text';
                edit.setAttribute('class','dataedit');
                edit.id = 'dataedit_' + rowIdx.toString() + '_' + cellIdx.toString();
                edit.style.display = 'none';
                edit.onkeyup = function(e) {
                    if (e.code == 'Enter') {
                        var dispId = this.id.replace(/^dataedit/,'datadisp');
                        this.style.display = 'none';
                        var disp = document.getElementById(dispId);
                        disp.style.display = 'inline';
                        disp.innerText = this.value;
                    }
                };
                dataCell.appendChild(edit);

                dataRow.appendChild(dataCell);
            });

            dataTable.appendChild(dataRow);
        });

        tableDisp.appendChild(dataTable);

        var saveBtn = document.createElement('button');
        saveBtn.innerText = "Save";
        saveBtn.addEventListener('click',this.updateData.bind(this),false);
        tableDisp.appendChild(saveBtn);


        if (this.parentId == '') {
            document.body.appendChild(tableDisp);
        }
        else {
            document.getElemetById(this.parentId).appendChild(tableDisp);
        }
    }

    updateData() {
        this.data.forEach((row,rowIdx) => {
            row.forEach((cell,cellIdx) => {
                var cellId = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                this.data[rowIdx][cellIdx] = document.getElementById(cellId).innerText;
            });
        });

        this.onCommit(this.data);
    }

    populateGrid() {
        this.data.forEach((row,rowIdx) => {
            row.forEach((cell,cellIdx) => {
                var dispId = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                document.getElementById(dispId).innerText = cell.toString();
            });
        });
    }

    validData(d) {
        var valid = true;
        var numCols = -1;

        if (typeof d == 'object') {
            for (var i = 0; i < d.length; i++) {
                if (typeof d[i] != 'object') {
                    valid = false;
                    console.log("Invalid Type")
                    break;
                }

                //Validate column count
                if (i == 0) {
                    numCols = d[i].length;
                }
                else {
                    if (d[i].length != numCols) {
                        valid = false;
                        console.log("Invalid row Length (" + i.toString() + ")");
                        break;
                    }
                }
            }
        }
        else {
            valid = false;
        }

        return valid;
    }
}
