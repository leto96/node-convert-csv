# NodeJS Convert Auxiliar

This is a helper Script with NodeJS to convert the delimiter from a csv (or any plain text file)

I had a case, in which I needed to treat the data and change the delimiter from a CSV value

File from:
```
Field1,Field2,Field3
Value1,Value2,Value3
Value4,Value5,Value6
```

To:
```
Field1;Field2;Field3
Value1;Value2;Value3
Value4;Value5;Value6
``` 
---
## Why using NodeJS and Stream?

### 1. Was Working in Scenarios with limitation

* :warning: I wasn't able to use any module from NPM (**secutiry reasons**)
* :warning: I need to perform this change with really big files, so only load the file and try to replace every delimiter could lead to a [memory leak](https://nodejs.org/api/buffer.html#buffer_buffer_constants). **It was necessary to use Streams** to avoid a memory leak



### 2. Test/Study Streams :memo:

It always good to learn a new "resource" in which can help to accomplish the objective and also can be useful to solve (or help with) another problems :thumbsup:

---

## How to use this?

1. Download the code
1. Put you file inside the same folder
1. Run the command 

```
node main.js <your_file_name>
```

### The code also do

* Check if the input file exists
* Generate an ouput file with the name `<your_file_name>_Copy.csv` (with the same extension in the input filename)
* In order to avoid overwrite one created file, if the output file already exists (if the name), try to append `_<number>`, until the name is unique (`<your_file_name>_Copy_1.csv`, `<your_file_name>_Copy_2.csv`, ...)
* You can change the delimiter in the source code

## Improve

If wish to change what to do with the data, it is possible to do inside the `transform` function

```javascript
_transform(data, encoding, callback) {
    var transformedFields = [];
    var lines = data.toString("utf8").split(/\r?\n/g);
    for(var i = 0; i < lines.length; i++){
      var fields = lines[i].split(originalDelimiter);
      transformedFields.push(fields.join(newDelimiter));
    }
    var transformedChunk = transformedFields.join('\r\n');
    callback(null, transformedChunk);
  };
```