const { EQUAL,GREATER_EQUAL,GREATER_THAN, LESS_EQUAL, LESS_THAN, NOT_EQUAL } = require("./Operator");

/**
 * 
 * @param {*} value 
 * @returns return the true/false if the type of value is Array
 */
const isArray = (value) => {
    return Array.isArray(value)
}

/**
 * 
 * @param {*} value 
 * @returns return the true/false if the type of value is boolean
 */
const isBoolean =(value) => {
    return (typeof value === 'boolean')? true : false
}

const isString = (value) =>{
    return (typeof value === 'string')? true : false
}

/**
 * 
 * @param {*} value 
 * @returns  return the true/false if value is empty
 */
const isEmpty = (value) => {
    return (typeof value === "undefined" || value === '')? true : false
} 

/**
 * 
 * @param {*} value 
 * @returns return the true/false if type of vlue is object
 */
const isObject = (value) =>{
    return (typeof value === "object")? true : false
}

/**
 * 
 * @param {*} value  remove the last specificed value  and remove the whitespace 
 */
const trimEnd = (value, chars) => {
    var index = value.lastIndexOf(chars);
    var newValue = value.substring(0, index)

    return newValue.trimEnd();
}

/**
 * @param {*} option  
 * @returns 
 */
 function isAllowedOperater(value){
    let  isAllowed = false ;
    if( typeof value !== "string") return isAllowed;

    let valueLowerCase = value.toLowerCase();

    if(valueLowerCase === EQUAL
        || valueLowerCase === GREATER_EQUAL
        || valueLowerCase === GREATER_THAN
        || valueLowerCase === LESS_THAN
        || valueLowerCase === LESS_EQUAL
        || valueLowerCase === NOT_EQUAL){

        isAllowed = true;
    }

    return isAllowed;
}

module.exports = { isArray, isBoolean, isEmpty, isObject, trimEnd, isString, isAllowedOperater }