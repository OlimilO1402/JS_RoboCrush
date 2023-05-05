// Copyright Dipl.-Ing. Oliver Meyer 2013 all rights reserved
//hier gibts Punkt, Kreis, aa-Quadrat, aa-Rechteck, 
//es fehlen noch:
// Linie
// Dreiecke:
// * gleichseitiges Dreieck
// * gleichschenkliges Dreieck
// * rw-Dreieck mit axisaligned
// * allgem. rechtw. Dreieck
// * allgem. Dreieck (3 Punkte)
//Polylinie, Polygon, 
//Bezierlinie

//==================   Point   ==================//
/**
 * creates a Point with 2D coordinates x and y 
 * @param {Number} x the X-coordinate
 * @param {Number} y the Y-coordinate
 */
function Point(x, y) 
{
	this.X = x; 
	this.Y = y; 
}
/**
 * creates a new Point with coordinates X=0, Y=0; 
 * well known as origin 
 */
Point.ORIGIN = function() 
{
    return new Point(0, 0);
};
/**
 * moves the coords of this Point about the distance dx and dy 
 * and returns itself
 * @param {Number} dx
 * @param {Number} dy
 */
Point.prototype.moveDxy = function(dx, dy) 
{
	this.X += dx;
	this.Y += dy;
    return this;
};
/**
 * moves the coords of this Point about the distance of the coords 
 * in point as a vector and returns itself
 * @param {Point} point
 */
Point.prototype.move = function(point) 
{
    return this.moveDxy(point.X, point.Y);
};
/**
 * returns the distance as a number from this point to the other point 
 * @param {Point} point
 */
Point.prototype.distanceTo = function(point) 
{
	return this.distanceToXY(point.X, point.Y);
};
/**
 * returns the distance as a number from this point to the point 
 * with x,y-coords
 * @param {Number} x
 * @param {Number} y
 */
Point.prototype.distanceToXY = function(x, y) 
{
	var dx = this.X - x;
	var dy = this.Y - y;
	return Math.sqrt(dx * dx + dy * dy);
};
/**
 * returns a copy of this point with the same coordinates
 */
Point.prototype.copy = function()
{
	return new Point(this.X, this.Y);
};
/** 
 * returns a string representing the type and the x,y-coords
 */ 
Point.prototype.toString = function()
{
	return "Point(" + this.X + ", " + this.Y + ")";
};

//==================   Circle   ==================//
/**
 * creates a 2D Circle with Center and Radius 
 * @param {Point} center
 * @param {Number} radius
 */
function Circle(center, radius)
{
	this.Center = center;
	this.Radius = radius;
}
/**
 * returns the diameter of this circle  
 */
Circle.prototype.diameter = function()
{
	return 2 * this.Radius;
};
/**
 * returns true if point is inside this circle
 * @param {Point} point
 */
Circle.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
/**
 * returns true if point with x,y-coords is inside this circle
 * @param {Number} x
 * @param {Number} y
 */
Circle.prototype.containsXY = function(x, y)
{
	return (this.Center.distanceToXY(x, y) <= this.Radius);
};
/**
 * returns an axis aligned square, outside the circle touching tangentially the circle line
 */
Circle.prototype.AASquareOut = function()
{
	var r = this.Radius;
	var pt = this.Center.copy(); pt.moveDxy(-r, -r);
	return new AASquare(pt, this.diameter());
};
/**
 * returns an axis aligned square, inside the circle touching the circle line with it's corners
 */
Circle.prototype.AASquareIns = function()
{
	var r = this.Radius * Math.sqrt(2)/2; //=sin(45)
	var pt = this.Center.copy(); pt.moveDxy(-r, -r);
	var wh = 2 * r;
	return new AASquare(pt, wh);
};
/**
 * returns an axis aligned bounding rect 
 */
Circle.prototype.AABoundRect = function()
{
	var r = this.Radius; var d = 2 * r;
	var p = this.Center.copy().moveDxy(-r, -r);	
	return new AARect(pt, d, d);
};
/**
 * returns a copy of the circle
 */
Circle.prototype.copy = function()
{
	return new Circle(this.Center.copy(), this.Radius);
};
/** 
 * returns a string representing the type, x,y-coords of center and radius
 */ 
Circle.prototype.toString = function()
{
	return "Circle(" + this.Center + ", r: " + this.Radius + ")";
};

//==================   AASquare   ==================//
/**
 * creates an 2D axis aligned square with point at left-top and width = height 
 * @param {Point} point , left-top point
 * @param {Number} width
 */
function AASquare(point, width)
{
	this.Point = point;
	this.Width = width;
}
/**
 * returns the right-side x-coord
 */
AASquare.prototype.right = function()
{
	return this.Point.X + this.Width;
};
/**
 * returns the bottom-side y-coord
 */
AASquare.prototype.bottom = function()
{
	return this.Point.Y + this.Width;
};
/**
 * returns the center-mid-point of the square
 */
AASquare.prototype.midpoint = function()
{
	var w2 = this.Width / 2;
	return this.Point.copy().moveDxy(w2, w2);
};
/**
 * centers the square to the aarect
 * @param {AARect} aarect the AARect to center this square
 */
AASquare.prototype.center = function(aarect)
{
	var w2 = this.Width / 2;
	this.Point = aarect.midpoint().moveDxy(w2, w2);
	return this;
};
/**
 * returns true if the square contains the point
 * @param {Point} point 
 */
AASquare.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
/**
 * returns true if the square contains the point with the coords x,y
 * @param {Number} x
 * @param {Number} y
 */
AASquare.prototype.containsXY = function(x, y)
{
	return ((this.Point.X <= x && x <= this.right()) && 
	        (this.Point.Y <= y && y <= this.bottom()));
};
/**
 * returns a new axis aligned rectangle 
 */
AASquare.prototype.AABoundRect = function()
{
	return new AARect(this.Point, this.Width, this.Width);
};
/**
 * returns a copy of this square
 */
AASquare.prototype.copy = function()
{
	return new AASquare(this.Point.copy(), this.Width);
};
/**
 * returns a string representing the type, x,y-coords of Point and Width
 */
AASquare.prototype.toString = function()
{
	return "AASquare[" + this.Point + ", wh: " + this.Width + "]";
};

//==================   AARect   ==================//
/**
 * creates an 2D axis aligned rectangle with Point at left-top, Width and Height  
 * @param {Point} point
 * @param {Number} width
 * @param {Number} height
 */
function AARect(point, width, height)
{
	this.Point = point;
	this.Width = width;
	this.Height = height;
}
/**
 * returns the right-side x-coord
 */
AARect.prototype.right = function()
{
	return this.Point.X + this.Width;
};
/**
 * returns the bottom-side y-coord 
 */
AARect.prototype.bottom = function()
{
	return this.Point.Y + this.Height;
};
AARect.prototype.rightbottom = function()
{
	return new Point(this.right(), this.bottom());
};

/**
 * returns the center-mid-point of the rectangle 
 */
AARect.prototype.midpoint = function()
{
	return this.Point.copy().moveDxy(this.Width / 2, this.Height / 2); 
};
/**
 * centers the rectangle to the aarect 
 * @param {AARect} aarect the AARect to center this square
 */
AARect.prototype.center = function(aarect)
{
	this.Point = aarect.midpoint().moveDxy(-this.Width / 2, -this.Height / 2);
	return this;
};
/**
 * returns true if the rectangle contains the point
 * @param {Point} point the AARect to center this square
 */
AARect.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
/**
 * returns true if the square contains the point with the coords x,y
 * @param {Number} x 
 * @param {Number} y 
 */
AARect.prototype.containsXY = function(x, y)
{
	return ((this.Point.X <= x && x <= this.right()) && 
	        (this.Point.Y <= y && y <= this.bottom()));
};
/**
 * 
 * @param {Point} point 
 */
AARect.prototype.move = function(point)
{
    return this.moveDxy(point.X, point.Y);
};
/**
 * moves the rectangle about dx, dy 
 * @param {Number} dx 
 * @param {Number} dy 
 */
AARect.prototype.moveDxy = function(dx, dy)
{
    this.Point.moveDxy(dx, dy);
    return this;
};
/**
 * returns a copy of the rectangle
 */
AARect.prototype.copy = function()
{
	return new AARect(this.Point.copy(), this.Width, this.Height);
};
/**
 * returns a string representing the type, the x,y-coords and width & height
 */
AARect.prototype.toString = function()
{
	return "AARect[" + this.Point + ", w: " + this.Width + ", h: " + this.Height + "]";
};

//==================   AATriSqu   ==================//
/**
 * creates a 2D triangle with Point and axis aligned sides at same Width   
 * @param {Point} point 
 * @param {Number} orientation +: 0, -: 1, ri: +, le: -, up: +, dw: -; ri-up=0, ri-dw=1, le-up=2, le-dw=3
 * @param {Number} width  
 */
function AATriSqu(point, orientation, width)
{
    this.Point = point;
    if (orientation == undefined) orientation = 1; 
    this.Orientation = orientation; 
    this.Width = width;
}
/**
 * returns a copy of this triangle
 */
AATriSqu.prototype.copy = function()
{
    return new AASquTri(this.Point.copy(), this.Width, this.Orientation);
};
/**
 * returns a string representing the type, the x,y-coords, width and the orientation
 */
AATriSqu.prototype.toString = function()
{
    return "AASqTri[" + this.Point + ", w: " + this.Width + ", ori: " + this.Orientation + "]";
};

//==================   AATriRct   ==================//
/**
 * creates a 2D triangle with Point and axis aligned sides and Width & Height   
 * @param {Point} point
 * @param {Number} orientation 
 * @param {Number} width
 * @param {Number} height
 * +: 0, -: 1, ri: +, le: -, up: +, dw: -; ri-up=0, ri-dw=1, le-up=2, le-dw=3
 */
function AATriRct(point, orientation, width, height)
{
    this.Point = point;
    if (orientation == undefined) orientation = 1; 
    this.Orientation = orientation; 
    this.Width = width;
    this.Height = height;
}
/**
 * returns a copy of this triangle
 */
AATriRct.prototype.copy = function()
{
    return new AARctTri(this.Point.copy(), this.Orientation, this.Width, this.Height);
};
/**
 * returns a string representing the type, the x,y-coords, width & height and the orientation
 */
AATriRct.prototype.toString = function()
{
    return "AARctTri[" + this.Point + ", w: " + this.Width + ", ori: " + this.Orientation + "]";
};
