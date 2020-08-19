# Desmos Table Manipulation Toolkit (TMT)
A collection of functions for creating, manipulating and accessing values from [tables in the desmos online graphing calculator](https://support.desmos.com/hc/en-us/articles/202529219-Getting-Started-with-Tables-of-Data) using the [desmos API](https://www.desmos.com/api)

## "Installation"

The code is intended to be run in the console of a desmos page so the only step to set it up is to paste the code into the console (which can be opened with Ctrl + Shift + i) and run it.

## Concepts

Desmos stores expressions as objects in an array. Each object has an `id` property which must be unique. The `id` of an expression cannot be observed through the desmos user interface but its expression number is displayed next to the expression. TMT functions address expressions, including tables, using their `id`. The TMT function `expressionNumberToId` allows users to input the expression number visible in desmos and obtain the expression's `id` so it can then be manipulated using TMT functions.

Desmos stores tables as objects with a `columns` property, which is an array of expression objects - each representing a column - with their own properties including `id`, `latex` and `values`. 

* The `latex` property of a table column is the LaTeX string that represents that column's label
* The `values` property of a table column is an array of LaTeX strings representing the values stored in the array. If the value entered into a cell in a table is π, its corresponding entry in the `values` of that column will be `"\\pi"`, not `3.14159265359`. Even numbers are stored as strings (`"3.14"` not `3.14`).

## Usage

Follow [this desmos link](https://www.desmos.com/calculator/g7g5xzgjcn) for an example of how TMT can be used in desmos to create and modify tables.

Below is a summary of each TMT function, what arguments it takes, and what it does:


 
<details><summary><code>getTableColumns(tableId)</code></summary>

### What it does

Returns a 2D array of values stored in a table whose `id` matches `tableId` where the `i`th element in the output corresponds to the `i`th column in the table

### Notes

Table values are obtained as the raw LaTeX strings, not the numbers to which they evaluate (so if you enter 2\*3 in a cell in a table it'll give you `"2\cdot 3"`, not `6`

</details>


 
<details><summary><code>getTableColumnLabels(tableId)</code></summary>

### What it does



### Notes



</details>


 
<details><summary><code>getTableRows(tableId)</code></summary>

### What it does



### Notes



</details>


 
<details><summary><code>setTable(tableId, columnValues, {columnLabels=undefined, plot = true})</code></summary>

### What it does

Creates a table

### Notes

The `columnLabels` and `plot` optional arguments must be passed inside an object like this: `setTable("table1",[["1","4","7"],["2","5","8"],["3","6","9"]],{columnLabels: ["col1","col2","col3"],plot: true})`. As both of these arguments are optional, either or neither of them can be specified, and they can be specified in any order.

</details>


 
<details><summary><code>addTableRow(tableId,rowValues,index=-1)</code></summary>

### What it does

Adds a row to a table at a specified row `index` starting from `0` to insert at the start

### Notes

The default `index` value of `-1` means the row will be added to the end of the table. This can be extended to adding the row to the penultimate position by passing `index` the value `-2` and so on.

</details>


 
<details><summary><code>removeTableRow(tableId,index=-1)</code></summary>

### What it does

Removes a row from a table at a specified row `index`

### Notes

The default `index` value of `-1` means the row will be added to the end of the table. This can be extended to adding the row to the penultimate position by passing `index` the value `-2` and so on.

</details>


 
<details><summary><code>addTableColumn(tableId,columnLabel,columnValues,index=-1)</code></summary>

### What it does

Adds a column to a table at a specified column `index`

### Notes

The default `index` value of `-1` means the row will be added to the end of the table. This can be extended to adding the row to the penultimate position by passing `index` the value `-2` and so on.

</details>


 
<details><summary><code>removeTableColumn(tableId, index=-1)</code></summary>

### What it does

Removes a column from a table at a specified column `index`

### Notes

The default `index` value of `-1` means the row will be added to the end of the table. This can be extended to adding the row to the penultimate position by passing `index` the value `-2` and so on.

</details>


 
<details><summary><code>updateTableRow(tableId,newRowValues,index)</code></summary>

### What it does

Replaces the values in a row at a given `index` in a table with the`newRowValues`

### Notes



</details>


`updateTableColumn(tableId,newColumnValues,index)` 
 
<details><summary><code>applyToTableRow(tableId,func,index,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"})</code></summary>

### What it does



### Notes

See `applyTo` in the [Ancillary functions](#Ancillary-functions) section

</details>


 
<details><summary><code>applyToTableColumn(tableId,func,index,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"})</code></summary>

### What it does



### Notes

See `applyTo` in the [Ancillary functions](#Ancillary-functions) section

</details>


 
<details><summary><code>getColumnByLabel(targetColumnLabel)</code></summary>

### What it does

Returns an array of values stored in a table column whose `latex` property matches `targetColumnLabel`

### Notes



</details>


 
<details><summary><code>applyToColumnByLabel(targetColumnLabel,func,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"})</code></summary>

### What it does



### Notes

See `applyTo` in the [Ancillary functions](#Ancillary-functions) section

</details>


 
<details><summary><code>removeColumnByLabel(targetColumnLabel)</code></summary>

### What it does

Removes the column whose `latex` property matches `targetColumnLabel` from the table containing it

### Notes



</details>


 
<details><summary><code>updateColumnByLabel(targetColumnLabel,newColumnValues))</code></summary>

### What it does

Replaces the `values` in the column whose `latex` property matches `targetColumnLabel` with  `newColumnValues`

### Notes



</details>


 
<details><summary><code>printTable(tableId)</code></summary>

### What it does

`console.log`s a 2D array of values (all as strings - see [Concepts](#Concepts)) extracted from a table

### Notes

Rows in the output 2D array correspond to rows (rather than columns) of the table

</details>


## Ancillary functions

Below is a summary of functions defined in TMT which are used by other TMT functions but aren't themselves useful for manipulating desmos tables.

 
<details><summary><code>transpose(matrix)</code></summary>

### What it does

Returns the transpose of a 2D array/matrix

### Notes

Doesn't interact with desmos

</details>


 
<details><summary><code>expressionNumberToId(expressionNumber)</code></summary>

### What it does

Returns the `id` of an expression given its expression number

### Notes

Throws a `TypeError` if there is no expression with the given expression number

</details>


 
<details><summary><code>getExpressionIdsOfType(targetType)</code></summary>

### What it does

Returns an array of `id` properties of the expressions whose `type` property matches `targetType`

### Notes

Valid `type` values include `"expression"`, `"table"`, `"image"` and `"folder"` 

</details>


 
<details><summary><code>getExpressionById(expressionId)</code></summary>

### What it does

Returns the first item in the list of expressions that have the target `id` (`expressionId`)

### Notes

Desmos enforces id uniqueness so the first matching item will also be the only matching item 

</details>


 
<details><summary><code>applyTo(array,func,{requireNumericInput = true,ignoreNA = true,reportNonNumericInput = "default"})</code></summary>

### What it does

Returns an array that results from calling `array.map((x,i) => func(x,i))` except depending on the values of the optional arguments it will handle string inputs differently

### Notes

If `requireNumericInput` is `true`, it will return the orginal value if it cannot be coerced to a number, and if `ignoreNA` is true it will avoid coercing `""` to `0`

</details>
