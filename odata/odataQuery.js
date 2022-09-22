const { SUCCESS, ERROR, WARNING, INFO } = require('../utils/MessageType')
const { isArray, isBoolean, isEmpty, isObject, trimEnd } = require("../utils/util")

/**
 * @class ODataQuery
 * 
 * @param {string} odataServiceRoot  Odata Service URL 
 *  
 */
function ODataQuery(odataServiceURL, entity) {
    this.odataService = odataServiceURL;
    this.message = { type : "", descripton : "" }

    if(entity){
        this.entityName = entity;
        this._setOdataQueryURL();
    }
}

/**
 * set odata server URL
 */
ODataQuery.prototype._setOdataQueryURL = function(){
    if(this.odataService){
         this.odataQueryURL = `${this.odataService}/${this.entityName}`;
         this._setMessage(SUCCESS, "odata service URL for query is updated")
    }else{
        this._setMessage(ERROR, "odata servcie url is empty")
    }
}

/**
 * filter add 
 */
ODataQuery.prototype._and = function() {
    this.odataQueryURL = `${this.odataQueryURL} and `;
    return this;
};

/**
 * 
 * filter or 
 */
ODataQuery.prototype._or = function() {
    this.urodataQueryURL = `${this.odataQueryURL} or `;
    return this;
};

/**
 * filter ne 
 */
ODataQuery.prototype._ne = function(value) {
    this.odataQueryURL = `${this.odataQueryURL} ne ${value}`;
    return this;
};

/**
 * 
 * add filters
 */
ODataQuery.prototype._filter = () => {
    this.odataQueryURL = `${this.odataQueryURL}&$filter=`;
    return this;
};

/**
 * add field
 */
ODataQuery.prototype._field = (field) => {
    this.odataQueryURL = `${this.odataQueryURL}${field}`;
    return this;
};

/**
 * add odataQueryRUL ( 
 */
 ODataQuery.prototype._openParenthesis = function(){
    this.odataQueryURL = `${this.odataQueryURL}(`;
    return this;
};

/**
 * add odataQueryRUL )
 */
ODataQuery.prototype._closeParenthesis = function(){
    this.odataQueryURL = `${this.odataQueryURL})`;
    return this;
};

/**
 * Operation eq
 */
ODataQuery.prototype._eqString = function(value) {
    if(isBoolean(value)){
        this.odataQueryURL = `${this.odataQueryURL} eq ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} eq '${value}'`;
    }
    return this;
};

ODataQuery.prototype._gtString =  function(value) {
    if(value.includes("datetime")){
        this.odataQueryURL = `${this.uodataQueryURLrl} gt ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} gt '${value}'`;
    }

    return this;
};

ODataQuery.prototype._ltString =  function(value) {
    if(value.includes("datetime")){
        this.odataQueryURL = `${this.odataQueryURL} lt ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} lt '${value}'`;
    }

    return this;
};

ODataQuery.prototype._geString =  function(value) {
    if(value.includes("datetime")){
        this.odataQueryURL = `${this.odataQueryURL} ge ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} ge '${value}'`;
    }
   
    return this;
};
ODataQuery.prototype._leString =  function(value) {

    if(value.includes("datetime")){
        this.odataQueryURL = `${this.odataQueryURL} le ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} le '${value}'`;
    }
    
    return this;
};

/**
 * 
 * @param {*} type  messageType   
 * @param {*} des   description
 */
 ODataQuery.prototype._setMessage = function(type, des){
    if(type === ERROR 
        || type === INFO
        || type === SUCCESS
        || type === WARNING
        || type === ERROR){
  
          this.message.type = type,
          this.message.descripton = des;
      }else{
          this.message.type = ERROR;
          this.message.descripton = "this message type is not supported"
      }
  }

  ODataQuery.prototype.filters = function(filters){
    if(!isEmpty(filters)){
        this._filter();
        let values = Object.assign(filters);
    }
  }

/**
 * get odata query URL
 * @returns {string} get odata batch URL for query operation
 */
ODataQuery.prototype.getOdataQueryURL = function(){
    return this.odataQueryURL;
}

/**
 * 
 * @returns {string} get odata batch URL for batch operation
 */
ODataQuery.prototype.getOdataBatchURL = function(){
    return this.odataBatchURL;
}



/**
 * format as JSON and return the numbers in all pages
 * 
 * @returns {object} odataquery
 */
ODataQuery.prototype.initial = function(){

    if(this.odataQueryURL){
        this.odataQueryURL = `${this.odataQueryURL}?$format=json&$inlinecount=allpages`;
        this._setMessage(SUCCESS, "odata service URL for query is updated")
    }else{
        this._setMessage(ERROR, "odata servcie url is empty")
    }
    return this;
};
/**
 * format as JSON
 * @returns {object} odataquery
 */
ODataQuery.prototype.jsonFormat = function(){
    if(this.odataQueryURL){
      this.odataQueryURL = `${this.odataQueryURL}?$format=json`;
      this._setMessage(SUCCESS, "odata service URL for query is updated")
    }else{
      this._setMessage(ERROR, "odata servcie url is empty")
    }
   
    return this;
};

/**
 * format as xml
 * @returns {object} odataquery
 */
ODataQuery.prototype.xmlFormat = function(){
    if(this.odataQueryURL){
        this.odataQueryURL = `${this.odataQueryURL}?$format=xml`;
        this._setMessage(SUCCESS, "odata service URL for query is updated")
      }else{
        this._setMessage(ERROR, "odata servcie url is empty")
    }
    return this;     
};


/**
 * User $select to limit the fields in odata response
 * 
 * @param {array} selects  
 * @returns
 */
 ODataQuery.prototype.select = function(selects){
    if (isArray(selects)) {
        if (selects.length > 0) {
            if(this.odataQueryURL.indexOf('?') > 0){
                this.odataQueryURL = `${this.odataQueryURL}&$select=${selects.join(",")}`;
                this._setMessage(SUCCESS, "odata service URL for query is updated")
            }else{
                this.odataQueryURL = `${this.odataQueryURL}?$select=${selects.join(",")}`;
                this._setMessage(SUCCESS, "odata service URL for query is updated")
            }
        }
    }
    return this;
};

/**
 * Special Usage:
 * 
 * User the paramter sap-language to dispaly the code list value in differerent langgues
 * the value could be zh , en , de  which list in ISO language tables
 * 
 * @param {string} value 
 * @returns 
 * 
 */
 ODataQuery.prototype.sapLang = function(value){
    if(!isEmpty(value)){
        if(this.odataQueryURL.indexOf('?') > 0){
            this.odataQueryURL = `${this.odataQueryURL}&sap-language=${value}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }else{
            this.odataQueryURL = `${this.odataQueryURL}?sap-language=${value}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }
    }
    return this;
};

/**
 * User $search to serach the recored in specific fields
 * 
 * @param {*} value 
 * @returns 
 */
 ODataQuery.prototype.search = function(value){

    if(!isEmpty(value)){
        if(this.odataQueryURL.indexOf('?') > 0){
            this.odataQueryURL = `${this.odataQueryURL}&$search=${value}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }else{
            this.odataQueryURL = `${this.odataQueryURL}?$search=${value}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }
    }

    return this;
};

ODataQuery.prototype.count = function(value){
    if (value === true) {
        if(this.odataQueryURL){
            if(this.odataQueryURL.indexOf('?') < 0){
                this.odataQueryURL = `${this.odataQueryURL}/$count?`;
                this._setMessage(SUCCESS, "odata service URL for query is updated")
            }
        }
        
    }
    return this;
}

/**
 * test $orderby :  
 * example :
 * {
 *   "Country" : "asc",
 *   "CustomerID" : "desc"
 * }
 * 
 * @param {*} values 
 */

ODataQuery.prototype.orderby = function(values){
    var orderby = "";

    if(isObject(values)){
        for(const key in values){
            orderby = `${orderby}${key} ${values[key]},`;
        }
    }

    if(this.odataQueryURL){
        if(this.odataQueryURL.indexOf('?')>0){
            this.odataQueryURL = `${this.odataQueryURL}&$orderby=${orderby}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }else{
            this.odataQueryURL = `${this.odataQueryURL}?$orderby=${orderby}`;
            this._setMessage(SUCCESS, "odata service URL for query is updated")
        }
    }

    this.odataQueryURL = trimEnd(this.odataQueryURL, ',');

    return this;
}

/**
 * example
 * $pagination = {
 *  current : 1,
 *  pageSize : 30
 * }
 * 
 * @param {*} pagination 
 * @returns 
 */
 ODataQuery.prototype.pagination = function(pagination) {
    if (isObject(pagination)) {
        const skip = (pagination.current - 1) * pagination.pageSize;
        if (pagination.pageSize <= 0 && pagination.current < 1) {
            return this;
        }

        if(this.odataQueryURL.indexOf('?') > 0 ){
            if (skip <= 0) {
                this.odataQueryURL = `${this.odataQueryURL}&$top=${pagination.pageSize}`;
            }
            if (skip > 0) {
                this.odataQueryURL = `${this.odataQueryURL}&$top=${pagination.pageSize}&$skip=${skip}`;
            }
        }else{
            if (skip <= 0) {
                this.odataQueryURL = `${this.odataQueryURL}?$top=${pagination.pageSize}`;
            }
            if (skip > 0) {
                this.odataQueryURL = `${this.odataQueryURL}?$top=${pagination.pageSize}&$skip=${skip}`;
            } 
        }

        
    }
    return this;
};

/**
 * @returns {object} odataquery
 */
ODataQuery.prototype.batch = function(){
    if(this.odataService){
        this.odataBatchURL =  `${this.odataService}/$batch`;
        this._setMessage(SUCCESS, "odata service URL for query is updated")
    }else{
        this._setMessage(ERROR, "odata servcie url is empty")
    }
    return this;
}

module.exports = ODataQuery