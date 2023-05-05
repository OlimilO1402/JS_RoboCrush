/**
 * @author Oliver Meyer
 */
//==================   Color   ==================//
/**
 * creates and returns a Color from the given portions of red, green, blue and transparency
 * @param {Number} red   0-255 byte
 * @param {Number} green 0-255 byte
 * @param {Number} blue  0-255 byte
 * @param {Number} transparency-alpha 0.0-1.0 float
 */
function Color(red, green, blue, alpha)
{
	this.R = red;
	this.G = green;
	this.B = blue;
	if (alpha === undefined || isNaN(alpha)) alpha = 1.0;
	//if (1 < alpha  && alpha < 256) alpha = (alpha + 1) / 256.0; //entweder so oder 
	if (1 < alpha  && alpha < 256) alpha /= 255.0;
	this.A = alpha;
	this.knowncolor = undefined;
}
/**
 * returns the hue of the color from HSL in degrees (0.0-360.0)
 */
Color.prototype.hue = function()
{
    var max = Math.max(this.R, Math.max(this.G, this.B)) / 255.0;
    var min = Math.min(this.R, Math.min(this.G, this.B)) / 255.0;    
    var dif = max - min;
    if (dif == 0.0) return 0.0; // achromatic
	var r = this.R / 255.0; var g = this.G / 255.0; var b = this.B / 255.0;
	if      (max == r) return ((g - b) / dif + (g < b ? 6.0 : 0.0)) * 60.0;
	else if (max == g) return ((b - r) / dif + 2.0) * 60.0;
	else if (max == b) return ((r - g) / dif + 4.0) * 60.0;
	else               return 0.0;
};
/**
 * returns the saturation of the color from HSL (0.0-1.0)
 */
Color.prototype.saturation = function()
{
    var max = Math.max(this.R, Math.max(this.G, this.B)) / 255.0;
    var min = Math.min(this.R, Math.min(this.G, this.B)) / 255.0;    
    var dif = max - min; if (dif == 0.0) return 0.0; //wichtig gleich hier raus!   
	var sum1 = min + max - 1.0;
	return dif / Math.abs(sum1 + ((sum1 > 0.0)? -1.0: 1.0));   
};
/**
 * returns the lightness of the color from HSL (0.0-1.0)
 */
Color.prototype.lightness = function()
{
    var max = Math.max(this.R, Math.max(this.G, this.B)) / 255.0;
    var min = Math.min(this.R, Math.min(this.G, this.B)) / 255.0;    
	return (min + max) / 2.0;	
};
/**
 * returns the luminance (grey-value) 
 */
Color.prototype.luminance = function()
{
	return Math.round(255.0 - (0.299 * this.R + 0.587 * this.G + 0.114 * this.B));	
};
/**
 * returns the cyan portion of a CMYK-color (0.0-1.0)
 */
Color.prototype.cyan = function()
{
	var k = this.keyblack(); if (k === 1.0) return 0.0;
	var c = 1 - this.R / 255.0;
	return (c - k) / (1 - k);
};
/**
 * returns the magenta portion of a CMYK-color (0.0-1.0)
 */
Color.prototype.magenta = function()
{
	var k = this.keyblack(); if (k === 1.0) return 0.0;
	var m = 1 - this.G / 255.0;
	return (m - k) / (1 - k);
};
/**
 * returns the yellow portion of a CMYK-color (0.0-1.0)
 */
Color.prototype.yellow = function()
{
	var k = this.keyblack(); if (k === 1.0) return 0.0;
	var y = 1 - this.B / 255.0;
	return (y - k) / (1 - k);
};
/**
 * returns the black portion of a CMYK-color (0.0-1.0)
 */
Color.prototype.keyblack = function()
{
	return 1.0 - Math.max(this.R, Math.max(this.G, this.B)) / 255.0;
};
/**
 * returns true if this is from KnownColors
 */
Color.prototype.isKnownColor = function()
{
	return ! (this.knowncolor === undefined);
};
/**
 * returns the inverted, negative color
 */
Color.prototype.inverted = function()
{
	var cc = new Color(255 - this.R, 255 - this.G, 255 - this.B, this.A);
	cc.knowncolor = this.knowncolor;
	return cc;
};
/**
 * returns this color converted to a gray-tone color
 * with arithmetic-portions of RGB
 */
Color.prototype.toGrayA = function()
{
	var gg = Math.round((this.R + this.G + this.B) / 3.0);
	var cc = new Color(gg, gg, gg, this.A);
	cc.knowncolor = this.knowncolor;
	return cc;
};
/**
 * returns this color converted to a gray-tone color
 * with luminance-portions of RGB
 */
Color.prototype.toGrayL = function()
{
	var gg = this.luminance();
	var cc = new Color(gg, gg, gg, this.A);
	cc.knowncolor = this.knowncolor;
	return cc;
};
/**
 * returns this color converted to a gray-tone color
 * with lightness/brightness-portions of RGB
 */
Color.prototype.toGrayB = function()
{
	var gg = Math.round(this.lightness() * 255.0);
	var cc = new Color(gg, gg, gg, this.A);
	cc.knowncolor = this.knowncolor;
	return cc;
};

/**
 * returns the name of the color, if it can be found in the enum list of KnownColors 
 */
Color.prototype.name = function()
{
	if (! this.isKnownColor()) return "";
	return this.knowncolor.name;	
};
/**
 * returns the hex-string of this color with a leading # 
 */
Color.prototype.toHexRGB = function()
{
	function Hex2(b){
		var h = b.toString(16);
		if (h.length < 2) h = "0" + h;
		return h;
	}
	return "#" + (Hex2(this.R) + Hex2(this.G) + Hex2(this.B)).toUpperCase(); 
};
/**
 * returns the same as the toString()-function
 * internally used in FillStyle and StrokeStyle objects
 * @param {HTMLElement} context  will be ignored here 
 */
Color.prototype.adopt = function(context)
{
	return this.toString();
};
/**
 * returns a string representing the rgba-elements 
 */
Color.prototype.toString = function()
{
	var s = "rgba(" + this.R + "," + this.G + "," + this.B + "," + this.A + ")";
	//alert(s);
	return s;//"rgba(" + this.R + "," + this.G + "," + this.B + "," + this.A + ")";
};

//==================   Color static-(shared)functions   ==================//
/**
 * creates and returns a Color from the given hex-String
 * the hex-String can be in the followng format:
 * portions of Red, Green, Blue and Alpha in hex-Notation 00-FF
 * an instantly leading "#", "0x" or "&H" will be detected and deleted
 * the prtion of Alpha will be divided by 255
 * @param {String} hexstr 
 */
Color.fromHexRGBA = function(hexstr)
{
	//if (hexstr.length < 6) return undefined; 
	var e = 0;
	var c1 = hexstr.substr(0, 1);
	var c2 = hexstr.substr(1, 1).toLowerCase();;
	e = (c1 === "#")? 1: ((c1 === "&" && (c2 === "H" || c2 === "h")) || 
	                      (c1 === "0" && (c2 === "X" || c2 === "x")))? 2: 0;
	hexstr = hexstr.substr(e, hexstr.length - e);		                
	var r = parseInt(hexstr.substr(0, 2), 16);
	var g = parseInt(hexstr.substr(2, 2), 16);
	var b = parseInt(hexstr.substr(4, 2), 16);
	var a = parseInt(hexstr.substr(6, 2), 16) / 255;
	return new Color(r, g, b, a);
};
/**
 * creates a Color.object from HSL-values
 * @param {Number} hue        in degrees from 0.0-360.0 (red: 0 or 360)
 * @param {Number} saturation in percentage from 0.0-1.0
 * @param {Number} lightness  in percentage from 0.0-1.0
 * @param {Number} transparency-alpha in percentage from 0.0-1.0
 */
Color.fromHSLA = function(hue, saturation, lightness, alpha)
{
	var othercol;
	if (typeof hue === "object") 
	{
		//alert("typeof hue = object");
		othercol = hue;
		hue = othercol.hue();
		saturation = othercol.saturation();
		lightness  = othercol.lightness();
		alpha = othercol.A;
	}
	function ColorCalc(c, t1, t2)
	{
		if (c < 0.0) c += 1.0;
		if (c > 1.0) c -= 1.0;
		if (6.0 * c < 1.0) return t1 + (t2 - t1) * 6.0 * c; 
		if (2.0 * c < 1.0) return t2;
		if (3.0 * c < 2.0) return t1 + (t2 - t1) * (2.0 / 3.0 - c) * 6.0;
		return t1;
	}
	var r, g, b;
	if (saturation == 0)
	{
		r = Math.round(lightness * 255.0);
		g = Math.round(lightness * 255.0);
		b = Math.round(lightness * 255.0);
	}
	else
	{
		var t1=0.0, t2=0.0;
		var th = hue / 360.0;
		if (lightness < 0.5)
		{
			t2 = lightness * (1.0 + saturation);
		}
		else
		{
			t2 = (lightness + saturation) - (lightness * saturation);
		}
		t1 = 2.0 * lightness - t2;
		var tr = 0.0, tg = 0.0, tb = 0.0;
		tr = th + (1.0 / 3.0);
		tg = th;
		tb = th - (1.0 / 3.0);
		
		tr = ColorCalc(tr, t1, t2);
		tg = ColorCalc(tg, t1, t2);
		tb = ColorCalc(tb, t1, t2);
		r = Math.round(tr * 255.0);
		g = Math.round(tg * 255.0);
		b = Math.round(tb * 255.0);
	}
	var retcol = new Color(r, g, b, alpha);
	if (othercol !== undefined) retcol.knowncolor = othercol.knowncolor;
	return retcol; 
};
/**
 * returns a new Color object from the pixel on the context
 * @param {HTMLElement} context the context with the pixel on it
 * @param {Number}      x       the x-coord of the pixel on the context
 * @param {Number}      y       the y-coord of the pixel on the context
 */
Color.fromPixel = function(context, x, y)
{
	var rgba = context.getImageData(x, y, 1, 1).data;
	//attention alpha is delivered as byte 0-255 but we need as float 0.0-1.0
	return new Color(rgba[0], rgba[1], rgba[2], rgba[3] / 255.0);
};
/**
 * returns a new Color object from cyan magenta yellow and black values
 * @param {Number} cyan    0.0-1.0 float
 * @param {Number} magenta 0.0-1.0 float
 * @param {Number} yellow  0.0-1.0 float
 * @param {Number} black   0.0-1.0 float
 */
Color.fromCMYK = function(cyan, magenta, yellow, black)
{
	var k1 = 1 - black;
	var r = Math.round((1 - Math.min(1, cyan    * k1 + black)) * 255.0);
	var g = Math.round((1 - Math.min(1, magenta * k1 + black)) * 255.0);
	var b = Math.round((1 - Math.min(1, yellow  * k1 + black)) * 255.0);
	return new Color(r, g, b);	
};
/**
 * returns a Color object from value as rgb-integer
 * @param {Number} value integer number with rgb
 */
Color.fromInt = function(value)
{
	var hx = value.toString(16).toUpperCase();
	var d = 6 - hx.length;
	if (d > 0) hx = new Array(d + 1).join("0") + hx;
	return Color.fromHexRGBA("#" + hx);
};
/**
 * returns a Color object from colorname
 * @param {String} colorname a name from KnownColors
 */
Color.fromName = function(colorname)
{
	return Color.fromKnownColor(KnownColors[colorname.toLowerCase()]);
};
/**
 * returns a Color object from the knowncolor
 * @param {KnownColor.EnumConst} knowncolor a constant from the Enum KnownColors
 */
Color.fromKnownColor = function(knowncolor)
{
	var c = Color.fromInt(knowncolor.value);
	if (c === undefined) return null;
	c.knowncolor = knowncolor;
	return c;
};
//==================   KnownColors   ==================//
/**
 * the KnownColors-Enum just has Variables
 */
KnownColors = 
{
    aliceblue             : 0xF0F8FF,
    antiquewhite          : 0xFAEBD7,
    aqua                  : 0x00FFFF,
    aquamarine            : 0x7FFFD4,
    azure                 : 0xF0FFFF,
    beige                 : 0xF5F5DC,
    bisque                : 0xFFE4C4,
    black                 : 0x000000,
    blanchedalmond        : 0xFFEBCD,
    blue                  : 0x0000FF,
    blueviolet            : 0x8A2BE2,
    brown                 : 0xA52A2A,
    burlywood             : 0xDEB887,
    cadetblue             : 0x5F9EA0,
    chartreuse            : 0x7FFF00,
    chocolate             : 0xD2691E,
    coral                 : 0xFF7F50,
    cornflowerblue        : 0x6495ED,
    cornsilk              : 0xFFF8DC,
    crimson               : 0xDC143C,
    cyan                  : 0x00FFFF,
    darkblue              : 0x00008B,
    darkcyan              : 0x008B8B,
    darkgoldenrod         : 0xB8860B,
    darkgray              : 0xA9A9A9,
    darkgreen             : 0x006400,
    darkkhaki             : 0xBDB76B,
    darkmagenta           : 0x8B008B,
    darkolivegreen        : 0x556B2F,
    darkorange            : 0xFF8C00,
    darkorchid            : 0x9932CC,
    darkred               : 0x8B0000,
    darksalmon            : 0xE9967A,
    darkseagreen          : 0x8FBC8F,
    darkslateblue         : 0x483D8B,
    darkslategray         : 0x2F4F4F,
    darkturquoise         : 0x00CED1,
    darkviolet            : 0x9400D3,
    deeppink              : 0xFF1493,
    deepskyblue           : 0x00BFFF,
    dimgray               : 0x696969,
    dodgerblue            : 0x1E90FF,
    firebrick             : 0xB22222,
    floralwhite           : 0xFFFAF0,
    forestgreen           : 0x228B22,
    fuchsia               : 0xFF00FF,
    gainsboro             : 0xDCDCDC,
    ghostwhite            : 0xF8F8FF,
    gold                  : 0xFFD700,
    goldenrod             : 0xDAA520,
    gray                  : 0x808080,
    green                 : 0x008000,
    greenyellow           : 0xADFF2F,
    honeydew              : 0xF0FFF0,
    hotpink               : 0xFF69B4,
    indianred             : 0xCD5C5C,
    indigo                : 0x4B0082,
    ivory                 : 0xFFFFF0,
    khaki                 : 0xF0E68C,
    lavender              : 0xE6E6FA,
    lavenderblush         : 0xFFF0F5,
    lawngreen             : 0x7CFC00,
    lemonchiffon          : 0xFFFACD,
    lightblue             : 0xADD8E6,
    lightcoral            : 0xF08080,
    lightcyan             : 0xE0FFFF,
    lightgoldenrodyellow  : 0xFAFAD2,
    lightgreen            : 0x90EE90,
    lightgrey             : 0xD3D3D3,
    lightpink             : 0xFFB6C1,
    lightsalmon           : 0xFFA07A,
    lightseagreen         : 0x20B2AA,
    lightskyblue          : 0x87CEFA,
    lightslategray        : 0x778899,
    lightsteelblue        : 0xB0C4DE,
    lightyellow           : 0xFFFFE0,
    lime                  : 0x00FF00,
    limegreen             : 0x32CD32,
    linen                 : 0xFAF0E6,
    magenta               : 0xFF00FF,
    maroon                : 0x800000,
    mediumaquamarine      : 0x66CDAA,
    mediumblue            : 0x0000CD,
    mediumorchid          : 0xBA55D3,
    mediumpurple          : 0x9370DB,
    mediumseagreen        : 0x3CB371,
    mediumslateblue       : 0x7B68EE,
    mediumspringgreen     : 0x00FA9A,
    mediumturquoise       : 0x48D1CC,
    mediumvioletred       : 0xC71585,
    midnightblue          : 0x191970,
    mintcream             : 0xF5FFFA,
    mistyrose             : 0xFFE4E1,
    moccasin              : 0xFFE4B5,
    navajowhite           : 0xFFDEAD,
    navy                  : 0x000080,
    oldlace               : 0xFDF5E6,
    olive                 : 0x808000,
    olivedrab             : 0x6B8E23,
    orange                : 0xFFA500,
    orangered             : 0xFF4500,
    orchid                : 0xDA70D6,
    palegoldenrod         : 0xEEE8AA,
    palegreen             : 0x98FB98,
    paleturquoise         : 0xAFEEEE,
    palevioletred         : 0xDB7093,
    papayawhip            : 0xFFEFD5,
    peachpuff             : 0xFFDAB9,
    peru                  : 0xCD853F,
    pink                  : 0xFFC0CB,
    plum                  : 0xDDA0DD,
    powderblue            : 0xB0E0E6,
    purple                : 0x800080,
    red                   : 0xFF0000,
    rosybrown             : 0xBC8F8F,
    royalblue             : 0x4169E1,
    saddlebrown           : 0x8B4513,
    salmon                : 0xFA8072,
    sandybrown            : 0xFAA460,
    seagreen              : 0x2E8B57,
    seashell              : 0xFFF5EE,
    sienna                : 0xA0522D,
    silver                : 0xC0C0C0,
    skyblue               : 0x87CEEB,
    slateblue             : 0x6A5ACD,
    slategray             : 0x708090,
    snow                  : 0xFFFAFA,
    springgreen           : 0x00FF7F,
    steelblue             : 0x4682B4,
    tan                   : 0xD2B48C,
    teal                  : 0x008080,
    thistle               : 0xD8BFD8,
    tomato                : 0xFF6347,
    turquoise             : 0x40E0D0,
    violet                : 0xEE82EE,
    wheat                 : 0xF5DEB3,
    white                 : 0xFFFFFF,
    whitesmoke            : 0xF5F5F5,
    yellow                : 0xFFFF00,
    yellowgreen           : 0x9ACD32
};
KnownColors = new Enum(KnownColors);


/* old code
function CreateKnownColors()
{
	function add(value, name)
	{
		Color.Values[name] = value; //Color.fromHexRGBA(value);
		Color.Names[value] = name;
	}
	add("#F0F8FF", "aliceblue");
	add("#FAEBD7", "antiquewhite");
	add("#00FFFF", "aqua");
	add("#7FFFD4", "aquamarine");
	add("#F0FFFF", "azure");
	add("#F5F5DC", "beige");
	add("#FFE4C4", "bisque");
	add("#000000", "black");
	add("#FFEBCD", "blanchedalmond");
	add("#0000FF", "blue");
	add("#8A2BE2", "blueviolet");
	add("#A52A2A", "brown");
	add("#DEB887", "burlywood");
	add("#5F9EA0", "cadetblue");
	add("#7FFF00", "chartreuse");
	add("#D2691E", "chocolate");
	add("#FF7F50", "coral");
	add("#6495ED", "cornflowerblue");
	add("#FFF8DC", "cornsilk");
	add("#DC143C", "crimson");
	add("#00FFFF", "cyan");
	add("#00008B", "darkblue");
	add("#008B8B", "darkcyan");
	add("#B8860B", "darkgoldenrod");
	add("#A9A9A9", "darkgray");
	add("#006400", "darkgreen");
	add("#BDB76B", "darkkhaki");
	add("#8B008B", "darkmagenta");
	add("#556B2F", "darkolivegreen");
	add("#FF8C00", "darkorange");
	add("#9932CC", "darkorchid");
	add("#8B0000", "darkred");
	add("#E9967A", "darksalmon");
	add("#8FBC8F", "darkseagreen");
	add("#483D8B", "darkslateblue");
	add("#2F4F4F", "darkslategray");
	add("#00CED1", "darkturquoise");
	add("#9400D3", "darkviolet");
	add("#FF1493", "deeppink");
	add("#00BFFF", "deepskyblue");
	add("#696969", "dimgray");
	add("#1E90FF", "dodgerblue");
	add("#B22222", "firebrick");
	add("#FFFAF0", "floralwhite");
	add("#228B22", "forestgreen");
	add("#FF00FF", "fuchsia");
	add("#DCDCDC", "gainsboro");
	add("#F8F8FF", "ghostwhite");
	add("#FFD700", "gold");
	add("#DAA520", "goldenrod");
	add("#808080", "gray");
	add("#008000", "green");
	add("#ADFF2F", "greenyellow");
	add("#F0FFF0", "honeydew");
	add("#FF69B4", "hotpink");
	add("#CD5C5C", "indianred");
	add("#4B0082", "indigo");
	add("#FFFFF0", "ivory");
	add("#F0E68C", "khaki");
	add("#E6E6FA", "lavender");
	add("#FFF0F5", "lavenderblush");
	add("#7CFC00", "lawngreen");
	add("#FFFACD", "lemonchiffon");
	add("#ADD8E6", "lightblue");
	add("#F08080", "lightcoral");
	add("#E0FFFF", "lightcyan");
	add("#FAFAD2", "lightgoldenrodyellow");
	add("#90EE90", "lightgreen");
	add("#D3D3D3", "lightgrey");
	add("#FFB6C1", "lightpink");
	add("#FFA07A", "lightsalmon");
	add("#20B2AA", "lightseagreen");
	add("#87CEFA", "lightskyblue");
	add("#778899", "lightslategray");
	add("#B0C4DE", "lightsteelblue");
	add("#FFFFE0", "lightyellow");
	add("#00FF00", "lime");
	add("#32CD32", "limegreen");
	add("#FAF0E6", "linen");
	add("#FF00FF", "magenta");
	add("#800000", "maroon");
	add("#66CDAA", "mediumaquamarine");
	add("#0000CD", "mediumblue");
	add("#BA55D3", "mediumorchid");
	add("#9370DB", "mediumpurple");
	add("#3CB371", "mediumseagreen");
	add("#7B68EE", "mediumslateblue");
	add("#00FA9A", "mediumspringgreen");
	add("#48D1CC", "mediumturquoise");
	add("#C71585", "mediumvioletred");
	add("#191970", "midnightblue");
	add("#F5FFFA", "mintcream");
	add("#FFE4E1", "mistyrose");
	add("#FFE4B5", "moccasin");
	add("#FFDEAD", "navajowhite");
	add("#000080", "navy");
	add("#FDF5E6", "oldlace");
	add("#808000", "olive");
	add("#6B8E23", "olivedrab");
	add("#FFA500", "orange");
	add("#FF4500", "orangered");
	add("#DA70D6", "orchid");
	add("#EEE8AA", "palegoldenrod");
	add("#98FB98", "palegreen");
	add("#AFEEEE", "paleturquoise");
	add("#DB7093", "palevioletred");
	add("#FFEFD5", "papayawhip");
	add("#FFDAB9", "peachpuff");
	add("#CD853F", "peru");
	add("#FFC0CB", "pink");
	add("#DDA0DD", "plum");
	add("#B0E0E6", "powderblue");
	add("#800080", "purple");
	add("#FF0000", "red");
	add("#BC8F8F", "rosybrown");
	add("#4169E1", "royalblue");
	add("#8B4513", "saddlebrown");
	add("#FA8072", "salmon");
	add("#FAA460", "sandybrown");
	add("#2E8B57", "seagreen");
	add("#FFF5EE", "seashell");
	add("#A0522D", "sienna");
	add("#C0C0C0", "silver");
	add("#87CEEB", "skyblue");
	add("#6A5ACD", "slateblue");
	add("#708090", "slategray");
	add("#FFFAFA", "snow");
	add("#00FF7F", "springgreen");
	add("#4682B4", "steelblue");
	add("#D2B48C", "tan");
	add("#008080", "teal");
	add("#D8BFD8", "thistle");
	add("#FF6347", "tomato");
	add("#40E0D0", "turquoise");
	add("#EE82EE", "violet");
	add("#F5DEB3", "wheat");
	add("#FFFFFF", "white");
	add("#F5F5F5", "whitesmoke");
	add("#FFFF00", "yellow");
	add("#9ACD32", "yellowgreen");
}
*/

/*
Color.fromHSLA = function(hue, saturation, luminance, alpha)
{
	function hue_(h, m1, m2) {
		h = (h < 0.0) ? h + 1.0: ((h > 1.0)? h - 1.0: h);	
		if      (h * 6.0 <= 1.0) { return m1 + (m2 - m1) * h * 6.0;}
		else if (h * 2.0 <= 1.0) { return m2; }
		else if (h * 3.0 <= 1.0) { return m1 + (m2 - m1) * (2.0 / 3.0 - h) * 6.0; } 
		else                 { return m1; };		
	}
	hue = (hue % 360) / 360.0;
	var m2 = luminance <= 0.5? luminance * (saturation + 1.0): luminance + saturation - luminance * saturation;
	var m1 = luminance * 2.0 - m2;
	var r = Math.round(hue_(hue + 1.0 / 3.0, m1, m2) * 255);
	var g = Math.round(hue_(hue, m1, m2)             * 255);
	var b = Math.round(hue_(hue - 1.0 / 3.0, m1, m2) * 255);
	return new Color(r, g, b, alpha); 
};
*/