### esay-odaajs
It can be used as the URL generater to genarete the query for doata service

Install it 

``` npm i easy-odatajs ```

### How to genreate the odata service URL

create an query object which simplify the odata query.

query template:

`<value>` ：     normally is string value, can be null
`<fieldName>` :  the field name you want to select 
`<Integer>`:     integer value
`<operator>`:    here is the allowed operater `ge`,`le`,`gt`,`lt`,`lt`,`ne`, `eq`
`<format>` :     format value can be `json`, `xml`
`<sortOption>` : sortOption can be `asc`, `desc` 

```json
{
  "filter":{
    "<fieldName>" : "<value>",
    "<fieldName>" : "<value>",
    "<fieldName>" : ["<value>","<value>","<value>"...]
  },
  "fitlerOption": {
    "<fieldName>": "<operator>",
    "<fieldName>" : {
      "low":  { "operator" : "<operator>", "value": "<value>"  },
      "high": { "operator" : "<operator>", "value": "<value>"  }
    }
  },
  "pagination": { 
    "current" :  <Integer>,  
    "pageSize" : <Integer> 
  },
  "select":["<fieldName>", "<fieldName>", "<fieldName>", "<fieldName>"...],
  "orderby": { 
    "<fieldName>": "<sortOption>", 
    "<fieldName>": "<sortOption>" 
  },
  "format": "<format>",
  "search": "<value>"
}
```


here is odata query example, and here is the [How to use](test/odata.qunit.js)

```Json
{
  "filter": { 
    "Country" : "Germany", 
    "City": "Berlin" ,
    "PostalCode":null,
    },
  "filterOption" : {
    "City" : "ne",
    "PostalCode" : {
      "low"  : { "operator" : "ge", "value": "100" },
      "high" : { "operator" : "le", "value": "102" }
    }
  },
  "pagination": {
    "current" : 1, 
    "pageSize" : 10 
  },
  "orderby": {
    "Country" : "asc",
    "CustomerID" : "desc"
  },
  "select" : ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode"],
  "format" : "json"
}
```

Example Code : 
```javascript
  
  //initialize the odate service URL
  let testOdataServiceURL = "https://services.odata.org/V2/Northwind/Northwind.svc";
  let entity = "Customers";
  let odataQuery = new ODataQuery(testOdataServiceURL, entity);

  //prepreate the query infoimation base on the template request
  let query = {
    "filter" : { 
      "Country" : "Germany",
      "City": "Berlin" 
    }
    ...
  }

  //get odata query URL
  let odataQueryURL = odataQuery.createQuery(query).getOdataQueryURL();
  ...
  //user the ajax or other javascript library to get the corresponding response from odata request
  ..

```

### How to genreate the odata batch body

if we want to create mutiple enitites or update multiple entities in one time , we could use odata batch functionanlites

here the steps to genter the odata batch :

batch request Template :

`<method>` : http method , can be `POST`,  `PATCH`, `DELETE`
`<entity>` : entity name
`<request>`: the request which create new entity or update entity,  if method is `DELETE`, the request can be null


```json
{
  "method" : "<method>",
  "entity" : "<entity>",
  "request": "<request>"
}
```

Example Code

```javascript

//prepre the correspoding request

let odataBatch = new OdataBatch();

//get headerinfo and add header to request
let header  = odataBatch.getHeaderInfo();

//prepare the batch request base on the reuqest

  let postRequest = {
      method : "POST",
      entity : "Customers",
      request : {
          "CompanyName" : "Wolfgong",
          "ContactName" : "Smith"
      }
  }
  let patchRequest = {
      method : "PATCH",
      entity : "Customers('ALFKI')",
      request : {
          "CompanyName" : "Name1",
          "ContactName" : "Name2"
      }
  }
  
  let deleteRequest = {
      method : "DELETE",
      entity : "Customers('ALFKI')",
  }

let aBatchRequest = []
aBatchRequest.push(postRequest, patchRequest, deleteRequest); // add the corresponding request 

//creat the batch data for the request body
let odataBatch = new OdataBatch();
let batchData = odataBatch.createBatchData(aBatchRequest).getBatchData();

//set the header and body and set the request to do the create / update / delete operations 
...

```


