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
class Point
{
    /**
     * creates a Point with 2D coordinates x and y 
     * @param {Number} x the X-coordinate
     * @param {Number} y the Y-coordinate
     */
    constructor(x, y) 
    {
        this.X = x; 
        this.Y = y; 
    }
    
    /**
     * creates a new Point with coordinates X=0, Y=0; 
     * well known as origin 
     */
    ORIGIN() 
    {
        return new Point(0, 0);
    }

    /**
     * moves the coords of this Point about the distance dx and dy 
     * and returns itself
     * @param {Number} dx
     * @param {Number} dy
     */
    moveDxy(dx, dy) 
    {
        this.X += dx;
        this.Y += dy;
        return this;
    }

    /**
     * moves the coords of this Point about the distance of the coords 
     * in point as a vector and returns itself
     * @param {Point} point
     */
    move(point) 
    {
        return this.moveDxy(point.X, point.Y);
    }

    /**
     * returns the distance as a number from this point to the other point 
     * @param {Point} point
     */
    distanceTo(point) 
    {
        return this.distanceToXY(point.X, point.Y);
    }

    /**
     * returns the distance as a number from this point to the point 
     * with x,y-coords
     * @param {Number} x
     * @param {Number} y
     */
    distanceToXY(x, y) 
    {
        var dx = this.X - x;
        var dy = this.Y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * returns a copy of this point with the same coordinates
     */
    copy()
    {
        return new Point(this.X, this.Y);
    }

    /** 
     * returns a string representing the type and the x,y-coords
     */ 
    toString()
    {
        return "Point(" + this.X + ", " + this.Y + ")";
    }    
}

//==================   Circle   ==================//
class Circle
{
    /**
     * creates a 2D Circle with Center and Radius 
     * @param {Point} center
     * @param {Number} radius
     */
    constructor(center, radius)
    {
        this.Center = center;
        this.Radius = radius;
    }

    /**
     * returns the diameter of this circle  
     */
    diameter()
    {
        return 2 * this.Radius;
    };

    /**
     * returns true if point is inside this circle
     * @param {Point} point
     */
    contains(point)
    {
        return this.containsXY(point.X, point.Y);
    }

    /**
     * returns true if point with x,y-coords is inside this circle
     * @param {Number} x
     * @param {Number} y
     */
    containsXY(x, y)
    {
        return (this.Center.distanceToXY(x, y) <= this.Radius);
    }

    /**
     * returns an axis aligned square, outside the circle touching tangentially the circle line
     */
    AASquareOut()
    {
        var r = this.Radius;
        var pt = this.Center.copy(); pt.moveDxy(-r, -r);
        return new AASquare(pt, this.diameter());
    }

    /**
     * returns an axis aligned square, inside the circle touching the circle line with it's corners
     */
    AASquareIns()
    {
        var r = this.Radius * Math.sqrt(2)/2; //=sin(45)
        var pt = this.Center.copy(); pt.moveDxy(-r, -r);
        var wh = 2 * r;
        return new AASquare(pt, wh);
    }

    /**
     * returns an axis aligned bounding rect 
     */
    AABoundRect()
    {
        var r = this.Radius; var d = 2 * r;
        var p = this.Center.copy().moveDxy(-r, -r); 
        return new AARect(pt, d, d);
    }

    /**
     * returns a copy of the circle
     */
    copy()
    {
        return new Circle(this.Center.copy(), this.Radius);
    }

    /** 
     * returns a string representing the type, x,y-coords of center and radius
     */ 
    toString()
    {
        return "Circle(" + this.Center + ", r: " + this.Radius + ")";
    }    
}

//==================   AASquare   ==================//
class AASquare
{
    /**
     * creates an 2D axis aligned square with point at left-top and width = height 
     * @param {Point} point , left-top point
     * @param {Number} width
     */
    constructor(point, width)
    {
        this.Point = point;
        this.Width = width;
    }

    /**
     * returns the right-side x-coord
     */
    right()
    {
        return this.Point.X + this.Width;
    }

    /**
     * returns the bottom-side y-coord
     */
    bottom()
    {
        return this.Point.Y + this.Width;
    }

    /**
     * returns the center-mid-point of the square
     */
    midpoint()
    {
        var w2 = this.Width / 2;
        return this.Point.copy().moveDxy(w2, w2);
    }

    /**
     * centers the square to the aarect
     * @param {AARect} aarect the AARect to center this square
     */
    center(aarect)
    {
        var w2 = this.Width / 2;
        this.Point = aarect.midpoint().moveDxy(w2, w2);
        return this;
    }

    /**
     * returns true if the square contains the point
     * @param {Point} point 
     */
    contains(point)
    {
        return this.containsXY(point.X, point.Y);
    }

    /**
     * returns true if the square contains the point with the coords x,y
     * @param {Number} x
     * @param {Number} y
     */
    containsXY(x, y)
    {
        return ((this.Point.X <= x && x <= this.right()) && 
                (this.Point.Y <= y && y <= this.bottom()));
    }

    /*
     * returns a new axis aligned rectangle 
     */
    AABoundRect()
    {
        return new AARect(this.Point, this.Width, this.Width);
    }

    /**
     * returns a copy of this square
     */
    copy()
    {
        return new AASquare(this.Point.copy(), this.Width);
    }

    /**
     * returns a string representing the type, x,y-coords of Point and Width
     */
    toString()
    {
        return "AASquare[" + this.Point + ", wh: " + this.Width + "]";
    }    
}

//==================   AARect   ==================//
class AARect
{
    /**
     * creates an 2D axis aligned rectangle with Point at left-top, Width and Height  
     * @param {Point} point
     * @param {Number} width
     * @param {Number} height
     */
    constructor(point, width, height)
    {
        this.Point = point;
        this.Width = width;
        this.Height = height;
    }
    /**
     * returns the right-side x-coord
     */
    right()
    {
        return this.Point.X + this.Width;
    }

    /**
     * returns the bottom-side y-coord 
     */
    bottom()
    {
        return this.Point.Y + this.Height;
    }

    rightbottom()
    {
        return new Point(this.right(), this.bottom());
    }

    /**
     * returns the center-mid-point of the rectangle 
     */
    midpoint()
    {
        return this.Point.copy().moveDxy(this.Width / 2, this.Height / 2); 
    }

    /**
     * centers the rectangle to the aarect 
     * @param {AARect} aarect the AARect to center this square
     */
    center(aarect)
    {
        this.Point = aarect.midpoint().moveDxy(-this.Width / 2, -this.Height / 2);
        return this;
    }

    /**
     * returns true if the rectangle contains the point
     * @param {Point} point the AARect to center this square
     */
    contains(point)
    {
        return this.containsXY(point.X, point.Y);
    }

    /**
     * returns true if the square contains the point with the coords x,y
     * @param {Number} x 
     * @param {Number} y 
     */
    containsXY(x, y)
    {
        return ((this.Point.X <= x && x <= this.right()) && 
                (this.Point.Y <= y && y <= this.bottom()));
    }

    /**
     * 
     * @param {Point} point 
     */
    move(point)
    {
        return this.moveDxy(point.X, point.Y);
    }

    /**
     * moves the rectangle about dx, dy 
     * @param {Number} dx 
     * @param {Number} dy 
     */
    moveDxy(dx, dy)
    {
        this.Point.moveDxy(dx, dy);
        return this;
    }

    /**
     * returns a copy of the rectangle
     */
    copy()
    {
        return new AARect(this.Point.copy(), this.Width, this.Height);
    }

    /**
     * returns a string representing the type, the x,y-coords and width & height
     */
    toString()
    {
        return "AARect[" + this.Point + ", w: " + this.Width + ", h: " + this.Height + "]";
    }    
}

//==================   AATriSqu   ==================//
class AATriSqu
{
    /**
     * creates a 2D triangle with Point and axis aligned sides at same Width   
     * @param {Point} point 
     * @param {Number} orientation +: 0, -: 1, ri: +, le: -, up: +, dw: -; ri-up=0, ri-dw=1, le-up=2, le-dw=3
     * @param {Number} width  
     */
    constructor(point, orientation, width)
    {
        this.Point = point;
        if (orientation == undefined) orientation = 1; 
        this.Orientation = orientation; 
        this.Width = width;
    }
    /**
     * returns a copy of this triangle
     */
    copy()
    {
        return new AASquTri(this.Point.copy(), this.Width, this.Orientation);
    };
    /**
     * returns a string representing the type, the x,y-coords, width and the orientation
     */
    toString()
    {
        return "AASqTri[" + this.Point + ", w: " + this.Width + ", ori: " + this.Orientation + "]";
    };
}

//==================   AATriRct   ==================//
class AATriRct
{
    /**
     * creates a 2D triangle with Point and axis aligned sides and Width & Height   
     * @param {Point} point
     * @param {Number} orientation 
     * @param {Number} width
     * @param {Number} height
     * +: 0, -: 1, ri: +, le: -, up: +, dw: -; ri-up=0, ri-dw=1, le-up=2, le-dw=3
     */
    constructor(point, orientation, width, height)
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
    copy()
    {
        return new AARctTri(this.Point.copy(), this.Orientation, this.Width, this.Height);
    }

    /**
     * returns a string representing the type, the x,y-coords, width & height and the orientation
     */
    toString()
    {
        return "AARctTri[" + this.Point + ", w: " + this.Width + ", ori: " + this.Orientation + "]";
    }    
}