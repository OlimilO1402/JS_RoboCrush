function Point(x, y)
{
	this.X = x;
	this.Y = y;
}
Point.ORIGIN = new Point(0, 0);
Point.prototype.dX = function(other)
{
	return this.X - other.X;
};
Point.prototype.dY = function(other)
{
	return this.Y - other.Y;
};
Point.prototype.moveDX = function(dx)
{
	this.X += dx;
};
Point.prototype.moveDY = function(dy)
{
	this.Y += dy;
};
Point.prototype.moveDXY = function(dx, dy)
{
	this.X += dx;
	this.Y += dy;
};
Point.prototype.distanceTo = function(other)
{
	var dx = this.X - other.X;
	var dy = this.Y - other.Y;
	return Math.sqrt(dx * dx + dy * dy);
};
Point.prototype.nearBy = function(other)
{
	//here we have to define what actually is 'near', here it is 5 (px) 
	return (this.distanceTo(other) <= 5);
};
Point.prototype.toString = function()
{
	return ("Point(" + this.X + ", " + this.Y + ")");
};

function Circle(midpnt, radius)
{
	this.MidPnt = midpnt;
	this.Radius = radius;
}
Circle.prototype.isInside = function(pnt)
{
	return (this.MidPnt.distanceTo(pnt) <= this.Radius);
};
Circle.prototype.toString = function()
{
	return "Circle(" + this.MidPnt + ", r: " + this.Radius + ")";
};

function AARect(point, width, height)
{
	//Axis-Aligned-Rectangle
	this.P = point;
	this.Width = width;
	this.Height = height;
}
AARect.prototype.right = function()
{
	return this.P.X + this.Width;
};
AARect.prototype.bottom = function()
{
	return this.P.Y + this.Height;
};
AARect.prototype.isInside = function(pnt)
{
	 //berechnet ob ein Punkt innerhalb des Rechtecks ist
	return ((this.P.X <= pnt.X && pnt.X <= this.right()) && (this.P.Y <= pnt.Y && pnt.Y <= this.bottom())); 
};
AARect.prototype.center = function()
{
	return new Point(this.P.X + this.Width / 2, this.P.Y + this.Height / 2);
};

AARect.prototype.toString = function()
{
	return "AARect[" + this.P + ", width: " + this.Width + ", height: " + this.Height + "]";
};
