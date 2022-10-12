const { test } = require("qunit");
const { ODataQuery, OdataBatch, Option, SelectOption, filterOption }  = require("../index")


/**
 * {@link https://odata.org}.
 * {@link https://services.odata.org/V2/Northwind/Northwind.svc}.
 */

QUnit.module('Odata Query Operation with odata version 2.0', hooks =>{

  var testOdataServiceURL = "https://services.odata.org/V2/Northwind/Northwind.svc";
  var entity = "Customers";
  
  /**
   * if we only get the filters , it will get query with the default eq operator
   */
  test('test filter', assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
      "filter" : { 
        "Country" : "Germany",
        "City": "Berlin" 
      }
    }

    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City eq 'Berlin'")
  });

  /**
   * if we only get the filters , it will get query with the default eq operator
   */
  test('test filter withe array', assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
      "filter": { 
            "Country" : "Germany", 
            "City" : ["Berlin", "Mannheim", "Aachen", "Brandenburg" ] 
        }
    }


    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and (City eq 'Berlin' or City eq 'Mannheim' or City eq 'Aachen' or City eq 'Brandenburg')")
  });

  /**
   * if we only get the filters , it will get query with the given operator
   */
  test("test filter + fitlerOption", assert =>{
    let odataQuery1 = new ODataQuery(testOdataServiceURL, entity);
    let query1 = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        }
      }

    assert.equal(odataQuery1.createQuery(query1).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'")

    let odataQuery2 = new ODataQuery(testOdataServiceURL, entity);
    let query2 = {
        "filter": { 
              "Country" : "Germany", 
              "PostalCode": null, 
          },
        "filterOption" : {
            "PostalCode" : {
              "low"  : { "operator" : "ge", "value": "100" },
              "high" : { "operator" : "le", "value": "100" }
            }
        }
      }

      assert.equal(odataQuery2.createQuery(query2).getOdataQueryURL(), 
      "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and (PostalCode ge '100' and PostalCode le '100')")

  })

  test("test filter + fitlerOption + pagination", assert =>{
    let odataQuery1 = new ODataQuery(testOdataServiceURL, entity);
    let query1 = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        },
        "pagination": {
            "current" : 1, 
            "pageSize" : 10 
        }
    }

    assert.equal(odataQuery1.createQuery(query1).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'&$top=10")

    let odataQuery2 = new ODataQuery(testOdataServiceURL, entity);
    let query2 = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        },
        "pagination": {
            "current" : 2, 
            "pageSize" : 10 
        }
      }

    assert.equal(odataQuery2.createQuery(query2).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'&$top=10&$skip=10")
  })

  test("test filter + fitlerOption + pagination + serach", assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        },
        "pagination": {
            "current" : 1, 
            "pageSize" : 10 
        },
        "serach" : "Jack"
    }

    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'&$top=10&$search=Jack")

  })

  test("test filter + fitlerOption + pagination + orderby", assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        },
        "pagination": {
            "current" : 1, 
            "pageSize" : 10 
        },
        "orderby": {
            "Country" : "asc",
            "CustomerID" : "desc"
        }
    }


    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'&$top=10&$orderby=Country asc,CustomerID desc")
  })

  test("test filter + fitlerOption + pagination + orderby + select", assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
        },
        "pagination": {
            "current" : 1, 
            "pageSize" : 10 
        },
        "orderby": {
            "Country" : "asc",
            "CustomerID" : "desc"
        },
        "select" : ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode"]

    }


    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'"
        + "&$top=10&$orderby=Country asc,CustomerID desc"
        + "&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode")
  })

  test("test filter + fitlerOption + pagination + orderby + select + format", assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
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


    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'"
        + "&$top=10&$orderby=Country asc,CustomerID desc"
        + "&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode&$format=json")
  })

  /**
   * for SAP language usage
   */
  test("test filter + fitlerOption + pagination + orderby + select + format + lang", assert =>{
    let odataQuery = new ODataQuery(testOdataServiceURL, entity);

    let query = {
        "filter": { 
              "Country" : "Germany", 
              "City": "Berlin" 
          },
        "filterOption" : {
            "City" : "ne"
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
        "format" : "json",
        "lang" : "zh"

    }


    assert.equal(odataQuery.createQuery(query).getOdataQueryURL(), 
    "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$filter=Country eq 'Germany' and City ne 'Berlin'"
        + "&$top=10&$orderby=Country asc,CustomerID desc"
        + "&$select=CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode&$format=json&sap-language=zh")
  })

})