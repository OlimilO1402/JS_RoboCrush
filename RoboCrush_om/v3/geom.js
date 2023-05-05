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
 * creates a new Point object with X and Y coordinates 
 * @x: Number, the x-coordinate
 * @y: Number, the y-coordinate
 */
function Point(x, y) //Point
{
	this.X = x; //Number
	this.Y = y; //Number
}
Point.ORIGIN = function() //Point
{
    return new Point(0, 0);
}
Point.prototype.moveDxy = function(dx, dy) //Point
{
	this.X += dx;
	this.Y += dy;
    return this;
};
Point.prototype.move = function(point) //Point
{
    return this.moveDxy(point.X, point.Y);
};
Point.prototype.distanceTo = function(point) //Number
{
	return this.distanceToXY(point.X, point.Y);
};
Point.prototype.distanceToXY = function(x, y) //Number
{
	var dx = this.X - x;
	var dy = this.Y - y;
	return Math.sqrt(dx * dx + dy * dy);
};
Point.prototype.copy = function() //Point
{
	return new Point(this.X, this.Y);
};
Point.prototype.toString = function() //String
{
	return "Point(" + this.X + ", " + this.Y + ")";
};

//==================   Circle   ==================//
function Circle(center, radius)
{
	this.Center = center; //Point
	this.Radius = radius; //Number
}
Circle.prototype.diameter = function()
{
	return 2 * this.Radius;
};
Circle.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
Circle.prototype.containsXY = function(x, y)
{
	return (this.Center.distanceToXY(x, y) <= this.Radius);
};
Circle.prototype.AASquareOut = function()
{
	var r = this.Radius;
	var pt = this.Center.copy(); pt.moveDxy(-r, -r);
	return new AASquare(pt, this.diameter());
};
Circle.prototype.AASquareIns = function()
{
	var r = this.Radius * Math.sqrt(2)/2; //=sin(45)
	var pt = this.Center.copy(); pt.moveDxy(-r, -r);
	var wh = 2 * r;
	return new AASquare(pt, wh);
};
Circle.prototype.copy = function()
{
	return new Circle(this.Center.copy(), this.Radius);
};
Circle.prototype.toString = function()
{
	return "Circle(" + this.Center + ", r: " + this.Radius + ")";
};
//==================   AASquare   ==================//
function AASquare(point, width)
{
	this.Point = point; //Point
	this.Width = width; //Number
}
AASquare.prototype.right = function()
{
	return this.Point.X + this.Width;
};
AASquare.prototype.bottom = function()
{
	return this.Point.Y + this.Width;
};
AARect.prototype.center = function()
{
	var w2 = this.Width / 2;
	return new Point(this.Point.X + w2, this.Point.Y + w2);
};
AASquare.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
AASquare.prototype.containsXY = function(x, y)
{
	return ((this.Point.X <= x && x <= this.right()) && 
	        (this.Point.Y <= y && y <= this.bottom()));
};
AASquare.prototype.AARect = function()
{
	return new AARect(this.Point, this.Width, this.Width);
};
AASquare.prototype.copy = function()
{
	return new AASquare(this.Point.copy(), this.Width);
};
AASquare.prototype.toString = function()
{
	return "AASquare[" + this.Point + ", wh: " + this.Width + "]";
};

//==================   AARect   ==================//
function AARect(point, width, height)
{
	this.Point = point;
	this.Width = width;
	this.Height = height;
}
AARect.prototype.right = function()
{
	return this.Point.X + this.Width;
};
AARect.prototype.bottom = function()
{
	return this.Point.Y + this.Height;
};
AARect.prototype.center = function()
{
	return new Point(this.Point.X + this.Width / 2, this.Point.Y + this.Height / 2);
};
AARect.prototype.contains = function(point)
{
	return this.containsXY(point.X, point.Y);
};
AARect.prototype.containsXY = function(x, y)
{
	return ((this.Point.X <= x && x <= this.right()) && 
	        (this.Point.Y <= y && y <= this.bottom()));
};
AARect.prototype.move = function(point)
{
    return this.moveDxy(point.X, point.Y);
};
AARect.prototype.moveDxy = function(x, y)
{
    this.Point.moveDxy(x, y);
    return this;
};
AARect.prototype.copy = function()
{
	return new AARect(this.Point.copy(), this.Width, this.Height);
};
AARect.prototype.toString = function()
{
	return "AARect[" + this.Point + ", w: " + this.Width + ", h: " + this.Height + "]";
};

//==================   AATriSqu   ==================//
function AASquTri(point, width, orientation)
{
    this.Point = point;
    this.Width = width;
    this.Orientation = orientation; 
    //+: 0, -: 1, re: +, li: -, ob: +, un: -
    //re-ob=0, re-un=1, li-ob=2, li-un=3
}
AASquTri.prototype.copy = function()
{
    return new AASquTri(this.Point.copy(), this.Width, this.Orientation);
};
AASquTri.prototype.toString = function()
{
    return "AASqTri[" + this.Point + ", w: " + this.Width + ", ori: " + this.Orientation + "]";
};
