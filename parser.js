var fs = require('fs');
var jsonData;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function makeRandomJSON(filename, business_type){

fs.readFile('./CESsample.json', 'utf8', function (err,data){
  if(err) throw err

  else{
    //jsonData is the json object we're going to deal with to grab data from
    jsonData = JSON.parse(data);

    jsonData.business_type = business_type; //set the business type based on args

    //Set the date of the sample to sometime in the last year or so
    jsonData.collected_on = getRandomDate(new Date(2013,0,1),new Date());

    //Randomize the location info within a business type
    var biz_locations = {
        retail : [{
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "H. Dumpty"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Megalomart"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Strickland Propane"
        }],
        hospitality : [{
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Bob's Burgers"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Froyo Yolo"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Tacky Tiki"
        }],
        residential : [{
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "House 1"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "House 2"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "House 3"
        }],
        office : [{
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Temps n' More"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Dewey Cheat & Howe, LLP"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Far Far Away Travel"
        }],
        events : [{
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Greek Festival"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Polish Festival"
        }, {
            "latitude": 123, "longitude": 123, "region": "Lloyd Eco District", "zip_code": 97214,
            "zip_nine": "97214+1234", "is_location_approximate": true, "business_name": "Norse Festival"
        }]
    }

    //this way we can more accurately make test data to play with, based on waste stream estimates from a weighted point, like stddev
    var readily_recyclable_weight, compostable_weight, other_recoverable_weight, non_recoverable_weight = 0;
    var max_weight = 0;
    var min_weight = 0;
    var location_info = {};
    var biznum = getRandomInt(0,2);

    switch (business_type) {
    case "Retail":
        readily_recyclable_weight = 5.0;
        compostable_weight = 0.8;
        other_recoverable_weight = 2.0;
        non_recoverable_weight = 2.0;
        max_weight = 100;
        min_weight = 0.2;
        location_info = biz_locations.retail[biznum];
        break;
    case "Hospitality":
        readily_recyclable_weight = 1.0;
        compostable_weight = 1.0;
        other_recoverable_weight = 1.0;
        non_recoverable_weight = 1.0;
        max_weight = 100;
        min_weight = 0.2;
        location_info = biz_locations.hospitality[biznum];
        break;
    case "Residential":
        readily_recyclable_weight = 0.7;
        compostable_weight = 0.4;
        other_recoverable_weight = 0.8;
        non_recoverable_weight = 1.2;
        max_weight = 100;
        min_weight = 0.2;
        location_info = biz_locations.residential[biznum];
        break;
    case "Office":
        readily_recyclable_weight = 3.0;
        compostable_weight = 0.8;
        other_recoverable_weight = 2.0;
        non_recoverable_weight = 1.0;
        max_weight = 100;
        min_weight = 0.2;
        location_info = biz_locations.office[biznum];
        break;
    case "Events":
        readily_recyclable_weight = 4.0;
        compostable_weight = 1.2;
        other_recoverable_weight = 0.9;
        non_recoverable_weight = 2.0;
        max_weight = 100;
        min_weight = 0.2;
        location_info = biz_locations.events[biznum];
        break;
    }
    //that way we can weight how data is munged in a second

    //set our generated business name
    jsonData.location = location_info;

    //bin_length doesn't change through each loop, but contents_length does based on the spreadsheet
    var bin_length = jsonData.collection_bins.length

    //parse each collection_bin with j index
    for (var j = 0; j < bin_length; j++){
      var contents_length = jsonData.collection_bins[j].contents.length;
      //parse each collection_bin separately
      for (var i = 0; i < contents_length; i++){
        var new_weight = 0;
        switch(jsonData.collection_bins[j].name){
            case "Readily Recyclable":
                new_weight = getRandomInt(min_weight,max_weight) * readily_recyclable_weight;
                break;
            case "Compostable Materials":
                new_weight = getRandomInt(min_weight,max_weight) * compostable_weight;
                break;
            case "Other Recoverable Materials":
                new_weight = getRandomInt(min_weight,max_weight) * other_recoverable_weight;
                break;
            case "Non-Recoverable Materials":
                new_weight = getRandomInt(min_weight,max_weight) * non_recoverable_weight;
                break;
            default:
                new_weight = getRandomInt(min_weight,max_weight);

        }
        jsonData.collection_bins[j].contents[i].weight = Math.round(new_weight*100)/100;

      }

    }
    //end of filling in weight data, now we need to replace the total weight based on this data
    var total_weight;
    //for loop to add up all the weights
    

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
    //var filename = filename
    var directory = './created_data/'

    var outputData = JSON.stringify(jsonData, null, 4);
    
    fs.writeFile(directory+filename, outputData, 'utf8', function(err){
      if(err) return console.log(err);
      console.log("writing new json data to file", directory+filename);
    });

    //the end
  } //end else block
});

}

function argumentValidation(business_type,file_quantity){

    if(isNaN(file_quantity) || file_quantity <= 0 || file_quantity > 10000){
        return false;
    }

    switch(business_type){
        case "Retail":
        case "Hospitality":
        case "Residential":
        case "Office":
        case "Events":
            return true;
            break;
        default:
            return false;
    }

}

//call the function to make random JSON

//example:
//node parser.js 100 Restaurant

var business_type = process.argv[3];
var number_new_json = process.argv[2]; //get the amount of new files to make
if(argumentValidation(business_type,number_new_json)){ //basic error checking, could be better
    console.log("Creating ", process.argv[2], "new JSON objects of type", process.argv[3]);
  //create the new JSON objects
  for (var i = 0; i < number_new_json; i++){ 
    var filename = business_type + i + '.json';
    makeRandomJSON(filename, business_type);
  }

} else {
    console.log("Invalid arguments.\n " +
        "\tNumber of Files must be between 0 and 10000. \n" +
        "\tBusiness Type must be one of Retail, Hospitality, Residential, Office, or Events \n" +
        "Example: node parser.js 100 Retail");
}
