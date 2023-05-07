/**
 * @author Oliver Meyer
 */
//==================   ColorStop   ==================//
class ColorStop
{
	/**
	 * creates a ColorStop only for private use in Gradient-classes 
	 * @param {Number} x
	 * @param {Color} color
	 */
	constructor(x, color)
	{
		this.X = x;
		this.Color = color;
	}
	/**
	 * returns a string representing this ColorStop object with X-coord and Color
	 */
	toString()
	{
		return "ColorStop(" + this.X + ", " + this.Color + ")";
	}
}

//==================   Gradient   ==================//
class Gradient
{
	constructor()
	{
		this.Stops = new Array();	
	}

	/**
	 * this function is abstract, do not use it, it's for private use only,
	 * inside of Linear or Radial-Gradient
	 * @param {Object} context
	 */
	Gradient.prototype.createGradient = function(context)
	{
		//abstract not needed in javascript though
	}

	/**
	 * creates and adds a ColorStop-object for Linear- & Radial-Gradient
	 * @param {Number} x
	 * @param {Color} color
	 */
	Gradient.prototype.addColor = function(x, color)
	{
		this.Stops[this.Stops.length] = new ColorStop(x, color);		
	}

	/**
	 * adopts the Linear- or Radial-Gradient to the context 
	 * @param {HTMLElement} context Canvas-"2d"-context object
	 */
	Gradient.prototype.adopt = function(context)
	{
		var grd = this.createGradient(context);
		//alert(grd);
		for (var ii = 0; ii < this.Stops.length; ii++)
		{
			//alert(this.Stops[ii].Color);
			var cs = this.Stops[ii];
			//alert(cs);
			grd.addColorStop(cs.X, cs.Color);
		}
		return grd;
	}

	/**
	 * returns a string representing some object informations 
	 */
	Gradient.prototype.toString = function()
	{
		var s = "";
		for (var ii = 0; ii < this.Stops.length; ii++)
		{
			var cs = this.Stops[ii];
			s = s + cs + "\n";
		}
		return s;
	}
}

/**
 * do not use this function it serves as base class for Linear and Radial-Gradient   
 */

//==================   GradientLinear   ==================//
class GradientLinear
{
	/**
	 * creates a Linear Gradient object
	 * @param {Point | AARect} pt1
	 * @param {Point} pt2 it is obsolete if pt1 instanceof AARect
	 */
	constructor(pt1, pt2)
	{
		Gradient.call(this);
		if (pt1 instanceof AARect)
		{
			pt2 = pt1.rightbottom();
			pt1 = pt1.Point; //yes, first pt2 then pt1!!!
		}
		this.Pt1 = pt1;
		this.Pt2 = pt2;
	}
	
	//GradientLinear.prototype = new Gradient();
	//GradientLinear.prototype.constructor = GradientLinear;
	createGradient(context)
	{
		return context.createLinearGradient(this.Pt1.X, this.Pt1.Y, this.Pt2.X, this.Pt2.Y);
	}

	/**
	 * returns a string representing this GradientLinear object
	 */
	toString()
	{
		var s = Gradient.prototype.toString.call(this);
		return "GradientLinear[" + s + "]";
	}
}

//==================   GradientRadial   ==================//
class GradientRadial
{
	/**
	 * creates a Radial Gradient object 
	 * @param {Circle} circlestart circle inside
	 * @param {Circle} circleend   circle outside
	 */
	constructor(circlestart, circleend)
	{
		Gradient.call(this);
		this.CircleStart = circlestart;
		this.CircleEnd   = circleend;
	}
	
	//GradientRadial.prototype = new Gradient();
	//GradientRadial.prototype.constructor = GradientLinear;
	createGradient(context)
	{
		var cs = this.CircleStart; var ce = this.CircleEnd;
		return context.createRadialGradient(cs.Center.X, cs.Center.Y, cs.Radius, 
			                                ce.Center.X, ce.Center.Y, ce.Radius);
	}

	/**
	 * returns a string representing this GradientRadial object
	 */
	toString()
	{
		var s = Gradient.prototype.toString.call(this);
		return "GradientRadial(" + s + ")";
	}
}
