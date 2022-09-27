const { SUCCESS, ERROR, WARNING, INFO } = require('../utils/MessageType')
const { isArray, isBoolean, isEmpty, isObject, trimEnd, isString, isAllowedOperater } = require("../utils/util");
const { EQUAL } = require("../utils/Operator");


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
 * 
 * add filters
 */
ODataQuery.prototype._filter = function(){
    this.odataQueryURL = `${this.odataQueryURL}&$filter=`;
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
ODataQuery.prototype._fieldOr = function(field, values){

    // if (values.length === 1) {
    //     this.field
    //     this.field(key).eqString(values[0]);
    // } else {
    //     map(values, (value, index) => {
    //         if (index === 0) {
    //             this.openParenthesis().field(key).eqString(value);
    //         } else if (index === values.length - 1) {
    //             this.or().field(key).eqString(value).closeParenthesis();
    //         } else {
    //             this.or().field(key).eqString(value);
    //         }
    //     })
    // }

    if(values.length === 1){
        this._field(key)._addFilter(EQUAL, values[0]);
    }else{
        for( var i in values){
            if (i === 0) {
                this._openParenthesis()._field(key)._addFilter(EQUAL, values[i]);
            } else if (index === values.length - 1) {
                this._or()._field(key)._addFilter(EQUAL, values[i])._closeParenthesis();
            } else {
                this._or()._field(key)._addFilter(EQUAL, values[i]);
            }          
        }
    }

    return this;
}

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
 * 
 * @param {*} operator  GE, LE, LT, GT, NE
 * @param {*} value  the value after the operater
 * @returns 
 */
ODataQuery.prototype._addFilter = function(operator, value){

    if(value.includes("datetime") || isBoolean(value)){
        this.odataQueryURL = `${this.odataQueryURL} ${operator} ${value}`;
    }else{
        this.odataQueryURL = `${this.odataQueryURL} ${operator} '${value}'`;
    }

    return this;
}

ODataQuery.prototype._between = function(key, low, high){
    return this;
}


/**
 * 
 * @param {*} count  
 * @param {*} filter 
 * @param {*} filterOption 
 * @param {*} pagination 
 * @param {*} serach 
 * @param {*} format 
 * @param {*} lang 
 * @returns 
 */
ODataQuery.prototype.getQuery = function(count, filter, filterOption, pagination, serach, format, lang ){

    if(count){ this.count(count); };

    if(filter && filterOption){ this.filters(filter, filterOption); }

    if(pagination){ this.pagination(pagination); }

    if(serach){ this.search(serach); }

    if(orderby){ this.orderby(orderby); }

    if(format){ format === "json" ?this.jsonFormat() : this.xmlFormat(); }

    if(lang){ this.sapLang(lang); };
    
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
 * @returns 
 */
ODataQuery.prototype.filters = function(filter, filterOption){
  if(!isEmpty(filter)){
    this._filter();

    for( const key in filter){
       if(filterOption[key]){
            let option = filterOption[key];

            if(option.low && option.high){
                this._between(key, option.low, option.high)._and();
            }else{
                if(isString(option) && isAllowedOperater(option)){
                    this._field(key)._addFilter(option.toLowerCase(), filter[key])._and();
                }
            }
       }else{
          if( isArray(filter[key])){
            this._fieldOr(key, filter[key])._and();
          }else{
            this._field(key)._addFilter(EQUAL, filter[key])._and();
          }
          
       }    
    }

    this.getOdataQueryURL = trimEnd(this.getOdataQueryURL, ' and ');
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