//each instruction is logged to the console along with the state of the table after its execution
displayTable = function(tableId){console.table(getTableRows(tableId))}

console.log('tableData = [[1,2,3],[4,"\\pi",6],[7,9,"\\sin(\\frac{\\pi}{2})"]]\r\nsetTable("table1",tableData,{columnLabels : ["x_{1}","y_{1}","z_{1}"]})')
tableData = [[1,2,3],[4,"\\pi",6],[7,9,"\\sin(\\frac{\\pi}{2})"]]
setTable("table1",tableData,{columnLabels : ["x_{1}","y_{1}","z_{1}"]})
displayTable("table1")

console.log('setTable("table2",tableData,{columnLabels : ["x_{2}","y_{2}","z_{2}"],plot : false})')
setTable("table2",tableData,{columnLabels : ["x_{2}","y_{2}","z_{2}"],plot : false})
displayTable("table2")

console.log('addTableRow(tableId = "table1",rowValues = [3,"e",0.5],index=-2)')
addTableRow(tableId = "table1",rowValues = [3,"e",0.5],index=-2)
displayTable("table1")

console.log('addTableColumn("table1","n_{ewCol}",[1,2,"\\operatorname{random}\\left(\\left[1,2,3,4,5\\right]\\right)",4,5,6],index=0)')
addTableColumn("table1","n_{ewCol}",[1,2,"\\operatorname{random}\\left(\\left[1,2,3,4,5\\right]\\right)",4,5,6],index=0)
displayTable("table1")

console.log('updateTableRow("table1",[1,2,3,4],0)')
updateTableRow("table1",[1,2,3,4],0)
displayTable("table1")

console.log('applyToTableColumn("table1",x=>x/2,index = 2, {requireNumericInput : true,reportNonNumericInput : true,ignoreNA : true})')
applyToTableColumn("table1",x=>x/2,index = 2, {requireNumericInput : true,reportNonNumericInput : true,ignoreNA : true})
displayTable("table1")

console.log('In the "applyTo" family of functions, the argument "reportNonNumericInput" is set equal to the Boolean value of "requireNumericInput" by default')
console.log('applyToColumnByLabel("x_{1}",x=>x-1,{requireNumericInput : true, ignoreNA : true, reportNonNumericInput : "default"})')
applyToColumnByLabel("x_{1}",x=>x-1,{requireNumericInput : true, ignoreNA : true, reportNonNumericInput : "default"})
displayTable("table1")

console.log('applyToColumnByLabel("z_{1}",x=>x-1,{requireNumericInput : true,ignoreNA : false, reportNonNumericInput : false})')
applyToColumnByLabel("z_{1}",x=>x-1,{requireNumericInput : true,ignoreNA : false, reportNonNumericInput : false})
displayTable("table1")
console.log('Note that the item in the last column (column z_{1} on which the function was acting) at index 3 was not a number but this was not reported as the optional argument "reportNonNumericInput" was set to false')

console.log('console.log(getColumnByLabel("y_{1}"))')
console.log(getColumnByLabel("y_{1}"))
console.log('updateColumnByLabel("y_{1}",[3,1,4,1,5,9])')
updateColumnByLabel("y_{1}",[3,1,4,1,5,9])
console.log('console.log(getColumnByLabel("y_{1}"))')
console.log(getColumnByLabel("y_{1}"))

console.log('The following line intentionally throws an error to demonstrate the use of the custom error the code defines')
console.log('console.log(getColumnByLabel("iDontExist"))')
console.log(getColumnByLabel("iDontExist"))
