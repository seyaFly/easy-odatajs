const { SUCCESS, ERROR, WARNING, INFO } = require('../utils/MessageType')
const { isArray, isBoolean, isEmpty, isObject, trimEnd, isString, isAllowedOperater, isNumber } = require("../utils/util");
const { EQUAL } = require("../utils/Operator");
const OdataBatch = require('./odataBatch');


/**
 * @class ODataQuery
 * 
 * @param {string} odataService  Odata Service URL 
 *  
 */
function ODataQuery(odataServiceURL, entity) {
  this.odataService = odataServiceURL;
  this.message = { type : "", descripton : "" }

  if(entity){
    this.entityName = entity;
  }

  this._setOdataQueryURL();
}

/**
 * set odata server URL
 */
ODataQuery.prototype._setOdataQueryURL = function(){
  if(this.odataService){
     if(this.entityName){
      this.odataQueryURL = `${this.odataService}/${this.entityName}`;
     }else{
      this.odataQueryURL = `${this.odataService}`;
     }
     
     this._setMessage(SUCCESS, "odata service URL for query is updated")
  }else{
     this._setMessage(ERROR, "odata servcie url is empty")
  }
}

/**
 * filter add : and 
 */
ODataQuery.prototype._and = function() {
  this.odataQueryURL = `${this.odataQueryURL} and `;
  return this;
};

/**
 * 
 * filter or ： or 
 */
ODataQuery.prototype._or = function() {
  this.odataQueryURL = `${this.odataQueryURL} or `;
  return this;
};

/**
 * 
 * add filters : $fitler
 */
ODataQuery.prototype._filter = function(){
  if(this.odataQueryURL.indexOf('?') > 0){
    this.odataQueryURL = `${this.odataQueryURL}&$filter=`;
  }else{
     this.odataQueryURL = `${this.odataQueryURL}?$filter=`;
  }
  
  return this;
};

/**
 * add field
 */
ODataQuery.prototype._field =  function(field){ 
  this.odataQueryURL = `${this.odataQueryURL}${field}`;
  return this;
};

/**
 * 
 * @param {*} field  field name
 * @param {*} values values
 */
ODataQuery.prototype._fieldOr = function(key, values){

  if(values.length === 1){
    this._field(key)._addFilter(EQUAL, values[0]);
  }else{
    for( var i in values){
      if (parseInt(i) === 0) {
        this._openParenthesis()._field(key)._addFilter(EQUAL, values[i]);
      } else if (parseInt(i) === values.length - 1) {
        this._or()._field(key)._addFilter(EQUAL, values[i])._closeParenthesis();
      } else {
        this._or()._field(key)._addFilter(EQUAL, values[i]);
      }      
    }
  }

  return this;
}

/**
 * add odataQueryRUL: ( 
 */
 ODataQuery.prototype._openParenthesis = function(){
  this.odataQueryURL = `${this.odataQueryURL}(`;
  return this;
};

/**
 * add odataQueryRUL: )
 */
ODataQuery.prototype._closeParenthesis = function(){
  this.odataQueryURL = `${this.odataQueryURL})`;
  return this;
};

/**
 * 
 * @param {*} operator  GE, LE, LT, GT, NE
 * @param {*} value  the value after the operater
 * @returns 
 */
ODataQuery.prototype._addFilter = function(operator, value){

  if(value.includes("datetime") || isBoolean(value) || isNumber(value)){
    this.odataQueryURL = `${this.odataQueryURL} ${operator} ${value}`;
  }else{
    this.odataQueryURL = `${this.odataQueryURL} ${operator} '${value}'`;
  }

  return this;
}

/**
 * 
 * @param {*} key   the field name 
 * @param {*} low   { "operator" : "eq", "value": "100" }
 * @param {*} high  { "operator" : "eq", "value": "100" }
 * 
 */
ODataQuery.prototype._between = function(key, low, high){
  if(key && low && high){

    this._openParenthesis()._field(key)._addFilter(low.operator.toLowerCase(), low.value)
            ._and()._field(key)._addFilter(high.operator.toLowerCase(), high.value)._closeParenthesis();   
  }

  return this;
}

ODataQuery.prototype.createQuery = function(query){
  if(!isObject(query)){
    this.message.type = ERROR;
    this.message.descripton = "your query  is not supported"
    return this;
  }

  if(query.filter){ this.filters(query.filter, query.filterOption); }

  if(query.pagination){ this.pagination(query.pagination); }

  if(query.serach){ this.search(query.serach); }

  if(query.orderby){ this.orderby(query.orderby); }

  if(query.select) { this.select(query.select);}

  if(query.format){ query.format === "json" ?this.jsonFormat() : this.xmlFormat(); }

  if(query.lang){ this.sapLang(query.lang); };
  
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

/**
 * 
 * @param {*} filter 
 * @param {*} filterOption 
 */
ODataQuery.prototype.filters = function(filter, filterOption){
  if(!isEmpty(filter)){
  this._filter();

  for( const key in filter){
     if(filterOption){
      if(isObject(filterOption) && filterOption[key]){
        let option = filterOption[key];

        if(option.low && option.high){
            this._between(key, option.low, option.high)._and();
        }else{
            if(isString(option) && isAllowedOperater(option)){
            this._field(key)._addFilter(option.toLowerCase(), filter[key])._and();
            }
        }
       }else{
        this._field(key)._addFilter(EQUAL, filter[key])._and();
       }
     }else{
      if( isArray(filter[key])){
        this._fieldOr(key, filter[key])._and();
      }else{
        this._field(key)._addFilter(EQUAL, filter[key])._and();
      }
     }  
  }

  this.odataQueryURL = trimEnd(this.getOdataQueryURL(), ' and ');
  }
  return this;
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
    if(this.odataQueryURL.indexOf('?')>0){
      this.odataQueryURL = `${this.odataQueryURL}&$format=json`;
    }else{
      this.odataQueryURL = `${this.odataQueryURL}?$format=json`;
    }
    
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
/**
 * @param {*} value  true / false 
 * 
 */
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
 * {
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