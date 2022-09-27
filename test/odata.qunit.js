const { test } = require("qunit");
const { ODataQuery, OdataBatch, Option, SelectOption, filterOption }  = require("../index")


/**
 * {@link https://odata.org}.
 * {@link https://services.odata.org/V2/Northwind/Northwind.svc}.
 */

QUnit.module('Odata Query Operation with odata version 2.0', hooks =>{

    var testOdataServiceURL = "https://services.odata.org/V2/Northwind/Northwind.svc";
    var entity = "Customers";
    
    test('test add json format', assert =>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        assert.equal(odataQuery.jsonFormat()
                               .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$format=json")
    });


    test('test add xml format', assert =>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        assert.equal(odataQuery.xmlFormat()
                               .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$format=xml")
    });

    test("test $select to limite the response", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        let $select = ["CustomerID", "CompanyName", "Address", "Phone", "Fax"]

        assert.equal(odataQuery.select($select)
                               .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$select=CustomerID,CompanyName,Address,Phone,Fax")
    });

    test("test $count to get count of the current odata query", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        let $count = true;

        assert.equal(odataQuery.count($count)
                               .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers/$count?")

    });


    test("test $orderby to sort the response reslt ", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity)
        let $orderby = {
            "Country" : "asc",
            "CustomerID" : "desc"
        }
        
        assert.equal(odataQuery.orderby($orderby)
                               .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$orderby=Country asc,CustomerID desc")

    });

    test("test $pagination in odata query", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity)
        let $pagenation = {
            current : 1,
            pageSize: 30
        }

        assert.equal(odataQuery.pagination($pagenation)
        .getOdataQueryURL(), 
        "https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$top=30");
 
    });

    // test("test $count format", assert=>{
        
    // });

    test('test initial odata queryURL for odata query', assert =>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity)
        assert.equal(odataQuery.initial()
                               .getOdataQueryURL(), 
        'https://services.odata.org/V2/Northwind/Northwind.svc/Customers?$format=json&$inlinecount=allpages');

    });

    test('test add postfix $batch for odata batch operation', assert => {
        let odataQuery = new ODataQuery(testOdataServiceURL)
        assert.equal(odataQuery.batch()
                               .getOdataBatchURL(), 
        'https://services.odata.org/V2/Northwind/Northwind.svc/$batch');
    });
});

// QUnit.module('Odata Query Operation with fitlers', hooks =>{

//     var testOdataServiceURL = "https://services.odata.org/V2/Northwind/Northwind.svc";
//     var entity = "Customers";

//     var testRequest = {

//     }

//     test('test odata fitler Options', assert => {
//         let option = new Option( "GE", "100");

//         console.log(option)
//     });
// })


QUnit.module('Odata Query Operation with sap Usage', hooks =>{
    var testOdataServiceURL = "https://myNNNNNN.crm.ondemand.com/sap/c4c/odata/v1/odataservicecatalog";
    var entity = "ODataServiceCollection";

    test("test sap-language for odata query", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        let $$language = "zh";

        assert.equal(odataQuery.sapLang($$language)
                               .getOdataQueryURL(), 
        'https://myNNNNNN.crm.ondemand.com/sap/c4c/odata/v1/odataservicecatalog/ODataServiceCollection?sap-language=zh');

    });

    test("test $search usage for odata query", assert=>{
        let odataQuery = new ODataQuery(testOdataServiceURL, entity);
        let $search = "SAP-SE";

        assert.equal(odataQuery.search($search)
                               .getOdataQueryURL(), 
        'https://myNNNNNN.crm.ondemand.com/sap/c4c/odata/v1/odataservicecatalog/ODataServiceCollection?$search=SAP-SE');
        
    });
});