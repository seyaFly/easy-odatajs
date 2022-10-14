### esay-odaajs
It can be used as the URL generater to genarete the query for doata service

Install it 

``` npm i easy-odatajs ```

### How To Use

create an query object which simplify the odata query.

query template:

`<value>` ：     normally is string value, can be null
`<fieldName>` :  the field name you want to select 
`<Integer>`:     integer value
`<operator>`:    here is the allowed operater `ge`,`le`,`gt`,`lt`,`lt`,`ne`
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
