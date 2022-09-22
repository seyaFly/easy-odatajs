const { isEmpty, isObject}  = require("../utils/util")

function SelectOption(sign,operator, lower, higher, ){
    this.sign = sign;
    this.operator = operator;
    this.lower = lower;
    this.higher = higher;
}

/**
 * 
 * @param {*} key  field name 
 * @param {object} options 
 * 
 * e.g : {"customerId":{"sign":"","operator":"ne","lowner":"","higher":""}}
 * 
 * or  {"customerId":{operator":"ne"}}
 * 
 */

function filterOption(key , options){
    this.key = key

    if(options && isObject(options)){
        /**
         * sign : I <include> , E exclude
         * operator: le , ge , gt , lt 
         */
        if(options.sign && options.operator && (options.lower || options.higher)){
            this.options = options
        }else{
            this.operator = options.operator
        }
    }
}

module.exports = filterOption