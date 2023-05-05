/**
 * @author Oliver Meyer
 */
//==================   Pattern   ==================//
/**
 * creates a Pattern object, used as a fillStyle of strokeStyle
 * @param {Image} image   the Image-object to use as a pattern
 * @param {Number} repeat  "repeat"|"repeat-x"|"repeat-y"|"no-repeat"
 * 
 */
function Pattern(image, repeat)
{
	this.Image  = image;
	this.Repeat = repeat; //"repeat"|"repeat-x"|"repeat-y"|"no-repeat"
}
Pattern.prototype.adopt = function(context)
{
	return context.createPattern(this.Image, this.Repeat);
};

//==================   LineStyle   ==================//
/**
 * creates a LineStyle object used in StrokeStyle
 * @param {String} linecap  form for the end-point of a line "butt" | "round" | "square"
 * @param {String} linejoin form for the corner-point of a line "bevel" | "round" | "miter"
 * @param {Number} miterlimit number for the limit of the miter 
 */
function LineStyle(linecap, linejoin, miterlimit)
{
	this.Cap = linecap;   //butt|round|square
	this.Join = linejoin; //bevel|round|miter
	this.MLimit = miterlimit;	//Number
}
/**
 * applies the values to the context
 * @param {HTMLElement} context
 */
LineStyle.prototype.adopt = function(context)
{
	context.lineCap = this.Cap;
	context.lineJoin = this.Join;
	context.miterLimit = this.MLimit;	
};
//==================   StrokeStyle   ==================//
/**
 * creates as StrokeStyle object 
 * @param {Color|Pattern|Gradient} color_or_pattern_or_gradient
 * @param {Number} width by default = 1 if omitted
 * @param {LineStyle} linestyle
 */
function StrokeStyle(color_or_pattern_or_gradient, width, linestyle)
{
	//StrokeStyle = Color
	//            | Pattern
	//            | Gradient = GradientLinear
	//                       | GradientRadial
	this.CPGStyle = color_or_pattern_or_gradient;
	if (width === undefined) width = 1; //otherweise it wouldn't make sense anyway
	this.Width = width;
	this.LineStyle = linestyle;
}
/**
 * uses the StrokeStyle to the context
 * @param {HTMLElement} context
 */
StrokeStyle.prototype.adopt = function(context)
{
	if (this.Width     !== undefined) context.lineWidth = this.Width;
	if (this.LineStyle !== undefined) this.LineStyle.adopt(context);
	if (this.CPGStyle  !== undefined) 
	{
		if (typeof this.CPGStyle == "string") return this.CPGStyle; 
		else return this.CPGStyle.adopt(context); //context.strokeStyle =
	}
};
//==================   FillStyle   ==================//
/**
 * creates a FillStyle object
 * @param {Color|Pattern|Gradient} color_or_pattern_or_gradient
 */
function FillStyle(color_or_pattern_or_gradient)
{
	//FillStyle = Color
	//          | Pattern
	//          | Gradient = GradientLinear
	//                     | GradientRadial
	this.CPGStyle = color_or_pattern_or_gradient;
}
/**
 * uses the FillStyle to the context
 * @param {HTMLElement} context
 */
FillStyle.prototype.adopt = function(context)
{
	if (this.CPGStyle !== undefined) return this.CPGStyle.adopt(context); //context.fillStyle =	
};
