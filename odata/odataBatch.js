const {HTTP_PATCH, HTTP_POST,HTTP_DELETE} = require("../utils/httpMethod");
const { isArray }  = require("../utils/util");

function OdataBatch(){
   this.batchData  = "";
   
   this.batch_guid_separator = `--batch_guid_${parseInt(Math.random()*100000).toString()}` ;
   this.changeset_guid = parseInt(Math.random()*100000).toString();

   this.changeset = `--changeset_guid_${this.changeset_guid}`;
   this.header = `content-Type: multipart/mixed; boundary=changeset_guid_${this.changeset_guid}`;

   this.changesetHeader = "content-Type: application/http\r\ncontent-transfer-encoding: binary";
   this.batchHeader = "HTTP/1.1\r\nAccept: application/json\r\ncontent-Type: application/json\r\nContent-Length: 100000";
};

/**
 * 
 */

OdataBatch.prototype.begin = () => {
    this.batchData = `${this.batch_guid_separator}\r\n${this.header}\r\n\r\n${this.batchData}`;
    return this;
};

/**
 * 
 * @param {*} aRequest the patch/post/delete request
 * @returns { object } batch data
 * 
 */
OdataBatch.prototype.batchRequest = (aRequest) =>{
    if(isArray(aRequest)){
        if(aRequest.length !== 0){
          aRequest.forEach( (element)=>{
              if(element.method === HTTP_PATCH){
                  this.patchPayload(element.C4Object, element.request)
              }else if(element.method === HTTP_POST){
                  this.postPayload(element.C4Object, element.request)
              }else if(element.method === HTTP_DELETE){
                  this.deletePayload(element.C4Object)
              }
          })
        }
    }

    return this;
 };

/**
* 
* Example : 
* --changeset_guid_gld
* Content-Type: application/http
* Content-Transfer-Encoding: binary
* 
* PATCH BO_WorkOrderOrderDetailCollection('00163EA8746E1EEC8DD94E877556B775') HTTP/1.1
* Accept: application/json
* Content-Type: application/json
* Content-Length: 10000
* 
* {
*     "Finish" : "Z02"
* }
*/
OdataBatch.prototype.patchPayload=(value, req)=>{
    let reqString = JSON.stringify(req);
    this.batchData = `${this.batchData}${this.changeset}\r\n${this.changesetHeader}\r\n\r\n${HTTP_PATCH} ${value} ${this.batchHeader}\r\n\r\n${reqString}\r\n\r\n`
    return this;
};
/**
 * 
 * POST ServiceRequestItemCollection HTTP/1.1
 * Content-Type: application/json
 * Content-ID: 2
 * Content-Length: 10000
 *
 * {
 *" Description": "1m water hose",
 *    "ParentObjectID": "00163E0DBD9E1ED596EBDFDA564728AC",
 *    "ProductID": "10000760"
 * }
 */
 OdataBatch.prototype.postPayload=(value, req)=>{
    let reqString = JSON.stringify(req);
    this.batchData = `${this.batchData}${this.changeset}\r\n${this.changesetHeader}\r\n\r\n${HTTP_POST} ${value} ${this.batchHeader}\r\n\r\n${reqString}\r\n\r\n`
    return this;
};

/**
 * 
 * DELETE ServiceRequestItemCollection("00163E0DBD9E1ED596EBDFDA564728AC") HTTP/1.1
 * Content-Type: application/json
 * Content-ID: 2
 * Content-Length: 10000
 *
 */
OdataBatch.prototype.deletePayload=(value)=>{
    this.batchData = `${this.batchData}${this.changeset}\r\n${this.changesetHeader}\r\n\r\n${HTTP_DELETE} ${value} ${this.batchHeader}\r\n\r\n\r\n\r\n`
    return this;
};


/**
 * --changeset_guid_gld-- 
 * --batch_guid_gld--
 */
OdataBatch.prototype.end = ()=>{
    this.batchData = `${this.batchData}${this.changeset}-- \r\n${this.batch_guid_separator}--\r\n`;
    return this;
};

module.exports = OdataBatch