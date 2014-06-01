JSON parser to take sample JSON data set from Community Environmental Services and make many more 'faked' data so we can work with as much as we want for other applications and databses.

To use:

Install node.js.

Basic usage example:

```
/Github/cfp-parser$ node parser.js 10 Restaurant
So you want  10 new JSON objects to be made.
 And of type  Restaurant
writing new json data to file ./created_data/Restaurant0.json
writing new json data to file ./created_data/Restaurant2.json
writing new json data to file ./created_data/Restaurant1.json
writing new json data to file ./created_data/Restaurant3.json
writing new json data to file ./created_data/Restaurant4.json
writing new json data to file ./created_data/Restaurant5.json
writing new json data to file ./created_data/Restaurant6.json
writing new json data to file ./created_data/Restaurant7.json
writing new json data to file ./created_data/Restaurant8.json
writing new json data to file ./created_data/Restaurant9.json
```

Where 10 is the number of new json files you want, and Restaurant is the business_type.
