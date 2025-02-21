/*

    CsvFile - Parse CSV file with column headers
    
    Usage:
    
        //Parse comma-delimited text
        var csv = "name,age\nbob,43\nzeke,76";
        var data = new CsvFile(csv);
        
        //Parse tab-delimited text
        var text = "name\tage\nbob\t43\nzeke\t76";
        var data = new CsvFile(csv,'\t');
        
        //Access the name in the first record in the CSV file
        var nameValue = data[0].name;
        
*/
class CsvFile extends Array{
    constructor(csvtext,delim=',') {
        super();
        this.raw = csvtext;
        this.delimiter = delim;
        this.parseCsv();
    }
 
    parseCsv() {
        var fieldNames = [];
        var lines = this.raw.split('\n');
 
        for (var l = 0; l < lines.length; l++) {
            var fields = lines[l].split(this.delimiter);
 
            if (l == 0) {
                fieldNames = fields;
            }
            else {
                var ob = {};
                for (var f = 0; f < fields.length; f++) {
                    ob[fieldNames[f]] = fields[f];
                }
                this.push(ob);
            }
        }
    }
}
