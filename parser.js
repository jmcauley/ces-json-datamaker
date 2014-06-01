var fs = require('fs');
var jsonData;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBusinessType(){
    var bizTypes = ["Office","Events","Hospitality","Retail","Residential"]
    return bizTypes[getRandomInt(0,4)];
}

fs.readFile('./CESsample.json', 'utf8', function (err,data){
  if(err) throw err

  else{
    //jsonData is the json object we're going to deal with to grab data from
    jsonData = JSON.parse(data);
    

    //this way we can more accurately make test data to play with, based on waste stream estimates from a weighted point, like stddev
    var business_type = getRandomBusinessType();
    var business_weight = 0;
    var max_weight = 0;
    var min_weight = 0;
    switch (business_type) {
    case "Retail":
        business_weight = 1.2;
        max_weight = 2000;
        min_weight = 0.2;
        break;
    case "Office":
        business_weight = 0.7;
        max_weight = 500;
        min_weight = 0.2;
        break;
    case "Hospitality":
        business_weight = 1.4;
        max_weight = 10000;
        min_weight = 0.2;
        break;
    case "Events":
        business_weight = 1.0;
        max_weight = 2000;
        min_weight = 0.2;
        break;
    case "Residential":
        business_weight = 1.0;
        max_weight = 2000;
        min_weight = 0.2;
        break;
    }
    //that way we can weight how data is munged in a second

    //Set the business type


    //bin_length doesn't change through each loop, but contents_length does based on the spreadsheet
    var bin_length = jsonData.collection_bins.length

    //parse each collection_bin with j index
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      //parse each collection_bin separately
      for (var i = 0; i < contents_length; i++){
        var line = jsonData.collection_bins[j].contents[i].weight = getRandomInt(min_weight,max_weight);
        //TODO take into account weights based on section of the jsonData object
        //if(jsonData.collection_bins[j].name == "Readily Recyclable") something like that
      }

    }
    //end of filling in weight data, now we need to replace the total weight based on this data
    var total_weight;
    //for looop to add up all the weights
    

    var grand_total_weight = 0;

    //fix the total weights values
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      var collection_bin_weight = 0;
      for (var i = 0; i < contents_length; i++){
          collection_bin_weight += jsonData.collection_bins[j].contents[i].weight;
      }
      //now set the collection_bin weight
      collection_bin_weight = Math.round(collection_bin_weight*100)/100; //get in terms of two sig figs, ie 24.56 NOT 24.566666666666666
      jsonData.collection_bins[j].total_weight = collection_bin_weight;
      grand_total_weight += collection_bin_weight; //keep adding up grant total weight
    }
    
    grand_total_weight = Math.round(grand_total_weight*100)/100; //fix to two decimal places
    jsonData.grand_total_weight = grand_total_weight;
    
    //fix the percentages
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      for (var i = 0; i < contents_length; i++){
        jsonData.collection_bins[j].contents[i].percentage = Math.round(jsonData.collection_bins[j].contents[i].weight/grand_total_weight*100)/100; //fix percentages on a per object basis
      }
      jsonData.collection_bins[j].total_weight = Math.round(jsonData.collection_bins[j].total_weight*100)/100; //fix percentages on collection_bin basis
    }

    //now we HAVE NICE DATA!
    //yay!

    //write all the changes to a file, with a uuid
    var filename = 'output1.json'
    var directory = './created_data/'

    var outputData = JSON.stringify(jsonData, null, 4);
    
    fs.writeFile(directory+filename, outputData, 'utf8', function(err){
      if(err) return console.log(err);
      console.log("writing new json data to file", directory+filename);
    });

    //the end
  } //end else block
});

