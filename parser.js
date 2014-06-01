var fs = require('fs');
var jsonData;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fs.readFile('./CESsample.json', 'utf8', function (err,data){
  if(err) throw err

  else{
    //jsonData is the json object we're going to deal with to grab data from
    jsonData = JSON.parse(data);
    

    //this way we can more accurately make test data to play with, based on waste stream estimates from a weighted point, like stddev
    var business_type = jsonData.business_type
    var business_weight = 0;
    var max_weight = 0;
    var min_weight = 0;
    switch (business_type) {
    case "Retail":
        business_weight = 1.2;
        max_weight = 2000;
        min_weight = 0.2;
        break;
    case "Restaurant":
        business_weight = 0.7;
        max_weight = 500;
        min_weight = 0.2;
        break;
    case "Manufacturing":
        business_weight = 1.4;
        max_weight = 10000;
        min_weight = 0.2;
        break;
    }
    //that way we can weight how data is munged in a second

    //bin_length doesnt change through each loop, but contents_lenght does based on the spreadhseet
    var bin_length = jsonData.collection_bins.length

    //parse each collection_bin with j index
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      //parse each collection_bin separately
      for (var i = 0; i < contents_length; i++){
        var line = jsonData.collection_bins[j].contents[i].weight;
        //TODO take into account weights based on section of the jsonData object
        //if(jsonData.collection_bins[j].name == "Readily Recyclable") something like that
        line = getRandomInt(min_weight,max_weight);
      }

    }
    //end of filling in weight data, now we need to replace the total weight based on this data
    var total_weight;
    //for looop to add up all the weights
    

    var grand_total_weight = 0;

    //fix the total weights values
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      console.log("contents_length is", contents_length);
      var collection_bin_weight = 0;
      for (var i = 0; i < contents_length; i++){
          collection_bin_weight += jsonData.collection_bins[j].contents[i].weight;
          console.log("growing size....",collection_bin_weight);
      }
      //now set the collection_bin weight
      collection_bin_weight = Math.round(collection_bin_weight*100)/100; //get in terms of two sig figs, ie 24.56 NOT 24.566666666666666
      jsonData.collection_bins[j].total_weight = collection_bin_weight;
      grand_total_weight += collection_bin_weight; //keep adding up grant total weight
    }
    
    grand_total_weight = Math.round(grand_total_weight*100)/100; //fix to two decimal places
    jsonData.grand_total_weight = grand_total_weight;

    console.log(jsonData);
    
    //fix the percentages


    //write all the changes to a file, with a uuid
    
  }
});

