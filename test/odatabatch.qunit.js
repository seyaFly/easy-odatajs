const { test, assert } = require("qunit");
const { ODataQuery, OdataBatch }  = require("../index");

QUnit.module('Odata Batch releated test', hooks =>{

    var testOdataServiceURL = "https://services.odata.org/V2/Northwind/Northwind.svc";
    var entity = "Customers";

    test('test get Odata BatchURL', assert =>{
        let odataQuery = new ODataQuery(testOdataServiceURL);
        assert.equal(odataQuery.batch().getOdataBatchURL(), "https://services.odata.org/V2/Northwind/Northwind.svc/$batch");
    })

    test("test odata Batch generate batch header info", assert => {
        let odataBatch = new OdataBatch();
        console.log(odataBatch.getHeaderInfo());
        assert.true(odataBatch.getHeaderInfo().value.includes("multipart/mixed; boundary=changeset_guid_"), "ok with header value")
    })

    test("test odata batch generate odata batch request", assert =>{
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
        aBatchRequest.push(postRequest, patchRequest, deleteRequest);

        let odataBatch = new OdataBatch();
        let batchData = odataBatch.createBatchData(aBatchRequest).getBatchData();

        // console.log(batchData)
        assert.ok(batchData.includes(JSON.stringify(postRequest.request)),  "post request is in the batch body")
        assert.ok(batchData.includes(JSON.stringify(patchRequest.request)), "patch request is in the batch body")
        assert.ok(batchData.includes("DELETE Customers('ALFKI') HTTP/1.1"), "delte Reuqest is in the batch body")
    })

})