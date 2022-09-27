const { isString, isAllowedOperater}  = require("../utils/util");
/**
 *  
 * @param { string } operator  "GE", "LE", "GT", "LT"
 * @param { any } value   the value which after  the operator 
 */
function Option(operator, value){
    if(isAllowedOperater(operator)){
        this.operator = operator;
        this.value = value;
    }
}

/**
 * 
 * @param { Option } low 
 * @param { Option } high 
 */
function SelectOption(low, high){

    if(low instanceof Option && high instanceof Option)

    if(low && !high){
        this.low = low;
    }

    if(!low && high){
        this.high = high
    }
}

/**
 * 
 * @param {*} key  field name 
 * @param {object} options 
 * 
 */
function filterOption(){
    this.data = {}; 
}

/**
 * 获取filterOption数据
 */
filterOption.prototype.getData= function(){
    return this.data;
}

filterOption.prototype.addOperation = function(key, option){
    if(option && option instanceof SelectOption ){

        if(option.low || option.high){
            this.data[key] = option
        }
    }

    if(option && isString(option)){

        if(isAllowedOperater(option)){
            this.data[key] =  option.toLowerCase();
        }
    }
}

module.exports = { filterOption, SelectOption, Option }