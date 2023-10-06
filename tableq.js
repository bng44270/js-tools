/*
  Functions for mapipulating an array of object with a common schema

  Usage:

      var dataTable = [{.
                    ...
                    }];

      dataTable.select('field1,field2');      //Return field1 and field2 values for all rows
      dataTable.whereIs('field1','value1');   //Return all rows where field1 equals "value1"
      dataTable.whereLike('field1',/value[123]/);    //Returns all rows where field1 contains "value1", "value2", or "value3" substring
      dataTable.getUniqueValues('field1');    //Return an array of all unique value of the field1 field

      Other methods include:
        Object.whereIsNot(field,value)
        Object.whereNotLike(field,pattern)
*/


Array.prototype.select = function(fieldList) {
	return this.map(row => {
		var ob = {};
		fieldList.split(',').forEach(f => {
			ob[f] = row[f];
		});
		return ob;
	});
};


Array.prototype.whereIs = function(field,value) {
	return this.filter(row => {
		return (row[field] == value) ? true : false;
	});
};

Array.prototype.whereIsNot = function(field,value) {
	return this.filter(row => {
		return (row[field] != value) ? true : false;
	});
};

Array.prototype.whereLike = function(field,pattern) {
	return this.filter(row => {
		return (row[field].match(pattern)) ? true : false;
	});
};

Array.prototype.whereNotLike = function(field,pattern) {
	return this.filter(row => {
		return (!(row[field].match(pattern))) ? true : false;
	});
};

Array.prototype.getUniqueValues = function(field) {
	var ar = [];
	this.forEach(row => {
		if (ar.indexOf(row[field]) == -1) {
			ar.push(row[field]);
		}
	});
	return ar;

};
