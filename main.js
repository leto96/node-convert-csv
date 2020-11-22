// Execution command 'node main.js <filename>'

const stream = require('stream');
const fs = require('fs');

var originalDelimiter = ',';
var newDelimiter = ';';

// Node recommends _transform to be called inside child classes
// https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback

// Node docs recommends to use class instead inherit
// https://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor
class myTransformer extends stream.Transform {
  constructor(){
    super();
  }

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
}


try {
  // -------- Checking input file --------
  const filename = process.argv.slice(2, 3)[0];
  if (filename == undefined) throw new Error('Filename is empty');

  const fullPathFile =  __dirname + '/' + filename;
  if(!fs.existsSync(fullPathFile)) throw new Error('File was not found');

  // -------- prepare to create output file --------
  // Get File extension
  var splitedFilename = filename.split('.');
  var filenameWithoutExtension = splitedFilename[0];
  var fileExtension = '.' + splitedFilename[1];
  
  // create a copy output file
  var copyNumber = 0;
  var outputfile = filenameWithoutExtension + '_Copy' + fileExtension;
  // If the file exist, then create another copy
  while(fs.existsSync(outputfile)){
    ++copyNumber;
    outputfile = filenameWithoutExtension + '_Copy_' + copyNumber + fileExtension;
  }
  
  const rs = fs.createReadStream(fullPathFile);
  const ws = fs.createWriteStream(outputfile);
  ws.on('finish', () => {
    console.log('finished succesfully');
  })
  const ts = new myTransformer();
  rs.pipe(ts).pipe(ws);
  
} catch (error) {
  console.log('something went wrong...');
  console.log(error);
}