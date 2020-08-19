//assume the code is being run in a desmos page and the Desmos calculator object is instantiated as Calc 
//use of "Table" in the name of a function indicates that it takes tableId as an argument
//desmos stores values in tables as strings, even if the values are numbers
//WARNING: if you try to perform a function that involves mathematical manipulation of its argument using the applyTo family of functions, do not set requireNumericInput = false (it is true by default) or this could result in NaN outputs which desmos will interpret as N*a*N
//don't set table labels as "x_1", instead name them as "x_{1}", otherwise desmos will convert the labels from the former to the later after the graph has been saved and the page refreshed, meaning, for example, getColumnByLabel("x_1") will work initially after you set that label but not after the you save the graph and access it a second time

//functions that use parameter destructuring and their corresponding optional arguments:
//setTable - columnLabels (array of LaTeX strings), plot (Boolean)
//applyTo - requireNumericInput (Boolean),ignoreNA (Boolean), reportNonNumericInput(Boolean, default = same value as requireNumericInput)
//applyToTableRow - see applyTo
//applyToTableColumn - see applyTo
//applyToColumnByLabel - see applyTo

class desmosTableError extends Error {
//https://javascript.info/custom-errors
  constructor(message) {
    super(message);
    this.name = "desmosTableError";
  }
}

transpose = function(matrix){
	//https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
	  return matrix[0].map((col, index) => matrix.map(row => row[index]))
	}

expressionNumberToId = function(expressionNumber){
	//expression number is the number displayed in the calculator next to an expression
	//columns of tables do have an id but do not have expression numbers
	//expressionNumber-1 is to account for list indexing starting from 0
	return Calc.getExpressions()[expressionNumber-1].id
}

getExpressionIdsOfType = function(targetType){
	expressions = Calc.getExpressions()
	tableIdList = []
	for (expression of expressions){
		if (expression.type == targetType){
			tableIdList.push(expression.id)
		}
	}
	return tableIdList
}

getExpressionById = function(expressionId){ //returns expression object
	//returns the first item in the list of expressions that have the target id
	//desmos enforces id uniqueness so the first item will also be the only item
	expression = Calc.getExpressions().filter(e => e.id == expressionId)[0]
	if (expression)return expression
	else throw new desmosTableError(`expression with id "${expressionId}" not found`)
}

getTableColumns = function(tableId){
	//each column in a table has an id (string), label (LaTeX string) and values list
	//this function extracts only the values of each column and returns them as a 2D array
	//throws an error if the target expression is not a table or does not exist
	expression = getExpressionById(tableId)
	if (expression.type == "table"){
		numColumns = expression.columns.length
		outputMatrix = []
		for (i = 0; i < numColumns; i++){
			columnValues = expression.columns[i].values
			outputMatrix.push(columnValues)
		}
		return outputMatrix
	}
	else throw new desmosTableError(`there is no table with id "${tableId}"`)
}

getTableColumnLabels = function(tableId){
	//each column in a table has an id (string), label (LaTeX string) and values list
	//this function extracts only the labels of each column and returns them as an array
	//throws an error if the target expression is not a table or does not exist
	expression = getExpressionById(tableId)
	if (expression.type == "table")return expression.columns.map(column => column.latex)
	else throw new desmosTableError(`expression with id ${tableId} is not a table`)
}

getTableRows = function(tableId){
	return transpose(getTableColumns(tableId))
}

setTable = function(tableId, columnValues, {columnLabels=undefined, plot = true}={}){
	//tableId : string, should either be a unique id or one shared with the table you wish to overwrite
	//setting tableId to the id of an expression that isn't a table will result in an error
	//columnValues : list of lists of LaTeX strings or numerical values e.g. [[1,2,3],[4,"a",6],[7,8,"\\sin\\left(\\pi\\right)"]]
	//columnLabels : list of LaTeX strings, must be the same length as columnValues, default=undefined
	//if the table already exists and is being overwritten, it will retain its previous properties that aren't overwritten
	//including column labels if the columnLabels argument is not specified
	tableExpression = {id:tableId,type:"table"}
	numColumns = columnValues.length
	columnsList = []
	for ( i = 0; i < numColumns; i++){
		columnExpression = {}
		columnId = tableId + "Column" + i.toString()
		columnExpression.id = columnId
		columnExpression.values = columnValues[i]
		columnExpression.hidden = !plot
		columnsList.push(columnExpression)
		if (columnLabels) columnExpression.latex = columnLabels[i]
	}
	tableExpression.columns = columnsList
	Calc.setExpression(tableExpression)	
}

{//notes about the array.splice() method
//it handles indices outside the range of the array by doing nothing instead of throwing an error
//it handles negative indices by moving backwards from the end of a list
//a = [1,2,3,4,5]
//a.splice(-1,deleteCount = 1,"*") removes 1 item from the last position and puts "*" in its place
//a becomes [1,2,3,4,"*"]
//if instead deleteCount had been set to 0, "*" would still have been inserted into the last index of the *original* array, not the new array
//so a.splice(-1,deleteCount=0,"*") will result in a=[1,2,3,4,"*",5] and not a=[1,2,3,4,5,"*"]
//a.splice(a.length,deleteCount=0,"*") is the only way to add an item to the end of an array using the .splice() method
}

addTableRow = function(tableId,rowValues,index=-1){
	columns = getTableColumns(tableId)
	numColumns = columns.length
	if (numColumns == rowValues.length){
		if (index < 0){
			columnLength = columns[0].length//all columns in a desmos table have the same length (unless tampered with using the API)
			index = columnLength+1+index //the +1 is to make .splice() work as one would expect
		}
		columns.map((column,i) => column.splice(index,deleteCount = 0, rowValues[i]))
		setTable(tableId,columns)	
	}
	else throw new desmosTableError(`length of row (${rowValues.length})does not match number of columns in target table (${numColumns})`)
}

removeTableRow = function(tableId,index=-1){
	columns = getTableColumns(tableId)
	columns.map(column => column.splice(index,1))//splice alters the columns matrix upon which it acts
	setTable(tableId,columns)
}

addTableColumn = function(tableId,columnLabel,columnValues,index=-1){
	columns = getTableColumns(tableId)
	labels = getTableColumnLabels(tableId)
	if (index < 0){
		columnLength = columns[0].length//all columns in a desmos table have the same length (unless tampered with using the API)
		index = columnLength+1+index //the +1 is to make .splice() work as one would expect
	}
	columns.splice(index,deleteCount = 0, columnValues)
	labels.splice(index, deleteCount = 0, columnLabel)
	setTable(tableId,columns,{columnLabels : labels})
}

removeTableColumn = function(tableId, index=-1){
	columns = getTableColumns(tableId)
	labels = getTableColumnLabels(tableId)
	columns.splice(index,deleteCount = 1)
	labels.splice(index,deleteCount = 1)
	setTable(tableId,columns,{columnLabels : labels})
}

updateTableRow = function(tableId,newRowValues,index){
	columns = getTableColumns(tableId)
	numColumns = columns.length
	if (numColumns == newRowValues.length){
		if (index < 0){
			columnLength = columns[0].length//all columns in a desmos table have the same length (unless tampered with using the API)
			index = columnLength+1+index //the +1 is to make .splice() work as one would expect
		}
		columns.map((column,i) => column.splice(index,deleteCount = 1, newRowValues[i]))
		setTable(tableId,columns)
	}
	else throw new desmosTableError(`length of updated row (${newRowValues.length}) does not match number of columns in target table (${numColumns})`)
}

updateTableColumn = function(tableId,newColumnValues,index){
	columns = getTableColumns(tableId)
	labels = getTableColumnLabels(tableId)
	columns.splice(index,deleteCount = 1,newColumnValues)
	setTable(tableId,columns)
}

{//notes about the applyTo family of functions
//applyTo() doesn't alter the original array it is given, instead returning a modified copy of it
//applyToColumnByLabel(), applyToTableColumn() and applyToTableRow(), which depend on applyTo(), all alter the table column with the target label passed to them as an argument and have no return value
//all three above functions will throw an error if given an invalid tableId, index or targetColumnLabel
}

applyTo = function(array,func,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"}={}){//reportNonNumericInput="default" sets it to have the same value as requireNumericInput
	if (reportNonNumericInput=="default")reportNonNumericInput = requireNumericInput
	if (requireNumericInput){ 
		oldFunc = func
		func = function(x,i){
			if (ignoreNA && x=="") return ""
			else{
				if (isNaN(Number(x))){
					if (reportNonNumericInput) console.log(`Item at index ${i} with value ${x} is not a number`)
					return x
				}
				else return oldFunc(Number(x))
			}
		}
	}
	return array.map((x,i) => func(x,i))
}

applyToTableRow = function(tableId,func,index,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"}={}){
	opts = {requireNumericInput:requireNumericInput,ignoreNA:ignoreNA,reportNonNumericInput:reportNonNumericInput}
	row = getTableRows(tableId)[index]
	newRowValues = applyTo(row,func,opts)
	updateTableRow(tableId,newRowValues,index)
}

applyToTableColumn = function(tableId,func,index,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"}={}){
	opts = {requireNumericInput:requireNumericInput,ignoreNA:ignoreNA,reportNonNumericInput:reportNonNumericInput}
	column = getTableColumns(tableId)[index]
	newColumnValues = applyTo(column,func,opts)
	updateTableColumn(tableId,newColumnValues,index)
}

getColumnByLabel = function(targetColumnLabel){//targetColumnLabel: LaTeX string
	// returns the values of the first table column whose label matches the target labels
	// table column labels should be unique for desmos to work properly but this uniqueness is not enforced
	tableIds = getExpressionIdsOfType("table")
	for (i = 0; i < tableIds.length; i++){//iterate through each table
		tableExpression = getExpressionById(tableIds[i])
		numColumns = tableExpression.columns.length
		for (j = 0; j < numColumns; j++){//iterate through each column of the current table
			columnExpression = tableExpression.columns[j]
			if( columnExpression.latex == targetColumnLabel){//if the label of the current column matches the target label, return its values
				return columnExpression.values
			}
		}
	}
	throw new desmosTableError(`column with target label "${targetColumnLabel}" not found`)
}

applyToColumnByLabel = function(targetColumnLabel,func,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"}={}){//targetColumnLabel: LaTeX string
	opts = {requireNumericInput:requireNumericInput,ignoreNA:ignoreNA,reportNonNumericInput:reportNonNumericInput}
	tableIds = getExpressionIdsOfType("table")
	for (i = 0; i < tableIds.length; i++){//iterate through each table
		columns = getExpressionById(tableIds[i]).columns
		for (columnIndex in columns){//iterate through each column of the current table
			if( columns[columnIndex].latex == targetColumnLabel){//if the label of the current column matches the target label, apply the function to the column
				newColumnValues = applyTo(columns[columnIndex].values,func,opts)
				columns[columnIndex].values = newColumnValues
				Calc.setExpression({id:tableIds[i],type:"table",columns:columns})
				return
			}
		}
	}
	throw new desmosTableError(`column with target label "${targetColumnLabel}" not found`)
}

removeColumnByLabel = function(targetColumnLabel){//targetColumnLabel: LaTeX string
	tableIds = getExpressionIdsOfType("table")
	for (i = 0; i < tableIds.length; i++){//iterate through each table
		columns = getExpressionById(tableIds[i]).columns
		for (columnIndex in columns){//iterate through each column of the current table
			if( columns[columnIndex].latex == targetColumnLabel){//if the label of the current column matches the target label, remove the column
				removeTableColumn(tableId,columnIndex)
				return
			}
		}
	}
	throw new desmosTableError(`column with target label "${targetColumnLabel}" not found`)
}

updateColumnByLabel = function(targetColumnLabel,newColumnValues){//targetColumnLabel: LaTeX string
	tableIds = getExpressionIdsOfType("table")
	for (i = 0; i < tableIds.length; i++){//iterate through each table
		columns = getExpressionById(tableIds[i]).columns
		for (columnIndex in columns){//iterate through each column of the current table
			if( columns[columnIndex].latex == targetColumnLabel){//if the label of the current column matches the target label, update the column with the new values
				columns[columnIndex].values = newColumnValues
				Calc.setExpression({id:tableIds[i],type:"table",columns:columns})
				return
			}
		}
	}
	throw new desmosTableError(`column with target label "${targetColumnLabel}" not found`)
}

printTable = function(tableId){//prints "2.72" as 2.72 and "e" as "e"
	matrixToString = function(matrix){
		outputString = "["
		for (row of matrix){
			rowString = "["
				for (item of row){
					itemAsNumber = Number(item)
					if (isNaN(itemAsNumber))itemString = '"'+item.toString()+'"'
					else itemString = item.toString()
					rowString = rowString + itemString + ","
				}
				rowString = rowString.slice(0,-1)//remove extra comma at the end
				rowString = rowString+"]"
			outputString = outputString + rowString + ","
		}
		outputString = outputString.slice(0,-1)//remove extra comma at the end
		outputString = outputString+"]"
		return outputString
	}
	console.log(matrixToString(getTableRows(tableId)))
}
