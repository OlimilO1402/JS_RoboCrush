/**
 * @author Oliver Meyer
 */
//==================   EnumConst   ==================//
class EnumConst
{
    /**
     * creates a new constant for the enum, only for private use inside Enum class 
     */
    constructor(name, index, value) 
    {
        this.name = name;
        this.index = index;
        this.value = value;
        Object.freeze(this);
    }

    /** We don’t want the mutable Object.prototype in the prototype chain 
    EnumConst.prototype = Object.create(null);
    EnumConst.prototype.constructor = EnumConst;
    */

    /**
    * Without Object.prototype in the prototype chain, we need toString()
    * in order to display symbols.
    */ //?????????????????????????
    toString() 
    {
        return this.value; //this.name + " = " + this.value;
    };
    /** ???
    Object.freeze(EnumConst.prototype);
    */
}

//==================     Enum     ==================//
class EnumConst
{
    /**
     * creates a new Enum object
     */
    constructor(obj)
    {
        var i = 0;
        if (arguments.length === 1 && obj !== null && typeof obj === "object") 
        {
            Object.keys(obj).forEach(function(name){ this[name] = new EnumConst(name, i++, obj[name]); }, this );
        }
        else
        {
            Array.prototype.forEach.call(arguments, function(name){ this[name] = new EnumConst(name, i++); }, this );
        }
        Object.freeze(this);
    }

    /**
     * grants access to all constants in the Enum
     */
    consts() 
    {
        return Object.keys(this).map( function(key) { return this[key]; }, this);
    }

    /**
     * checks if the given enumconst is contained in this Enum
     * @param {EnumConst} cnst
     */
    contains(cnst) 
    {
        if (! cnst instanceof EnumConst) return false;
        return this[cnst.name] === cnst;
    }
}
