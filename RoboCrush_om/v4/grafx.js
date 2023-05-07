/**
 * @author Oliver Meyer
 */
 
//==================   GraphicElement   ==================//
//ich glaub hier müssen wir nochmal umdenken
//idee:
//wir brauchen eine Zeichenklasse die nur fürs Zeichnen von Canvas-2d-Context zuständig ist.
//Der übergibt man die id für das Canvas-Element und sie holt sich den zugehörigen 2d-context 
//diese Klasse bringt für alle Primitiven eine bestimmte Zeichenfunktion mit.
//jede Primitive erhält ein Graphic-Element-Objekt das Stroke- und Fill-Objekte hält,
//und die zur Primitive passende Zeichenfunktion bekommt.
class GraphicElement
{
	constructor(funcDraw, graphicObject, fillstyle, strokestyle)
	{
		this.FuncDraw = funcDraw;
		this.GrObject = graphicObject;
		this.FillStyle = fillstyle;
		if (strokestyle === undefined && fillstyle === undefined) strokestyle = new Color(0,0,0); 
		this.StrokeStyle = strokestyle;
	}
	
	copy()
	{
	    //return new GraphicElement(this.FillColor, this.PenColor);
	}

	draw(context)
	{
		//
	}

	moveDxy(dx, dy)
	{
		//
	}
}

//==================   GraphicGroup   ==================//
class GraphicGroup extends GraphicElement
{
	constructor()
	{
		GraphicElement.call(this, undefined, undefined);
		this.List = new Array();
	}
	//GraphicGroup.prototype = new GraphicElement();
	//GraphicGroup.prototype.constructor = GraphicGroup;
	add(elem)
	{
		this.List[this.List.length] = elem;
		return elem;
	}

	copy()
	{
	    var ret = new GraphicGroup();
	    for (var ii = 0; ii < this.List.length; ii++)
	    {
	        ret.add(this.List[ii].copy());
	    }
	    return ret;
	}

	draw(context)
	{
		for (ii = 0; ii < this.List.length; ii++)
		{
			this.List[ii].draw(context);
		}
	}

	moveDxy(dx, dy)
	{
		for (ii = 0; ii < this.List.length; ii++)
		{
			this.List[ii].moveDxy(dx, dy);
		}
	}
}

//==================   GraphicCircle   ==================//
class GraphicCircle extends GraphicElement
{
	constructor(fillColor, penColor, circle)
	{
		GraphicElement.call(this, fillColor, penColor);
		this.Circle = circle;
	}
	//GraphicCircle.prototype = new GraphicElement();
	//GraphicCircle.prototype.constructor = GraphicCircle;
	copy()
	{
	    return new GraphicCircle(this.FillColor, this.PenColor, this.Circle.copy());
	}
	draw(context)
	{
		context.beginPath();
		if (this.FillColor != undefined) 
		{
			context.fillStyle = this.FillColor;
			context.arc(this.Circle.Center.X, this.Circle.Center.Y, this.Circle.Radius, 0, 2 * Math.PI);
			context.fill();
		}
		context.beginPath();
		if (this.PenColor != undefined) 
		{
			context.strokeStyle = this.PenColor;
			context.arc(this.Circle.Center.X, this.Circle.Center.Y, this.Circle.Radius, 0, 2 * Math.PI);
			context.stroke();
		}
	}
	moveDxy(dx, dy)
	{
		this.Circle.Center.moveDxy(dx, dy);
	}
}


//==================   GraphicPoint   ==================//
class GraphicPoint extends GraphicElement
{
	constructor(fillColor, penColor, point)
	{
		GraphicElement.call(this, fillColor, penColor);
		this.Point = point;
	}
	//GraphicPoint.prototype = new GraphicElement();
	//GraphicPoint.prototype.constructor = GraphicPoint;
	copy()
	{
	    return new GraphicPoint(this.FillColor, this.PenColor, this.Point.copy());
	}

	draw(context)
	{
		var ccl = new Circle(this.Point, 2);
		var GCl = new GraphicCircle(this.FillColor, this.PenColor, ccl);
		GCl.draw(context);
	}

	moveDxy(dx, dy)
	{
		this.Point.moveDxy(dx, dy);
	}
}

//==================   GraphicAARect   ==================//
class GraphicAARect extends GraphicElement
{
	constructor(fillColor, penColor, aarect)
	{
		GraphicElement.call(this, fillColor, penColor);
		this.AARect = aarect;
	}

	copy()
	{
	    return new GraphicAARect(this.FillColor, this.PenColor, this.AARect.copy());
	}

	draw(context)
	{
		if (this.FillColor != undefined) 
		{
			context.fillStyle = this.FillColor;
			context.fillRect(this.AARect.Point.X, this.AARect.Point.Y, this.AARect.Width, this.AARect.Height);
		}
		if (this.PenColor != undefined) 
		{
			context.strokeStyle = this.PenColor;
			context.strokeRect(this.AARect.Point.X, this.AARect.Point.Y, this.AARect.Width, this.AARect.Height);
		}
	}

	moveDxy(dx, dy)
	{
		this.AARect.Point.moveDxy(dx, dy);
	}
}
//==================   GraphicImage   ==================//
class GraphicImage
{
	constructor(path)
	{
		this.Image = new Image();
		this.Image.src = path;
	}
}
//==================   GraphicPicture   ==================//
class GraphicPicture extends GraphicElement
{
	constructor(graphicimage, aarectSrc, aarectDst)
	{
		GraphicElement.call(this, undefined, undefined);
		this.GraphicImage = graphicimage;
		this.AARectSrc = aarectSrc;
		this.AARectDst = aarectDst;
		this.tmpctx = undefined;
	}

	copy()
	{
	    return new GraphicPicture(this.GraphicImage, this.AARectSrc.copy(), this.AARectDst.copy());
	}

	draw(context)
	{
		this.tmpctx = context; //for getpixel
		context.drawImage(this.GraphicImage.Image, 
		this.AARectSrc.Point.X, this.AARectSrc.Point.Y, this.AARectSrc.Width, this.AARectSrc.Height,
		this.AARectDst.Point.X, this.AARectDst.Point.Y, this.AARectDst.Width, this.AARectDst.Height);	
	}

	moveDxy(dx, dy)
	{
		this.AARectDst.Point.moveDxy(dx, dy);
	}

	getPixel(x, y)
	{
		if (this.tmpctx == undefined) return null;
		return Color.fromPixel(this.tmpctx, x, y);
		//this.AARectDst.Point.moveDxy(dx, dy);
		//return Color.fromInt(this.GraphicImage.Image.)
		//context.getImageData(x, y, 1, 1)).data
		//data[0] = r
		//data[1] = g
		//data[2] = b
		//data[3] = a		
	}
}

//==================   GraphicFont   ==================//
class GraphicFont
{
	constructor(fontname, sizept, horalign, vertalign)
	{
		this.FontName = fontname;
		this.SizePt = sizept;
		this.HorAlign = horalign;   //"left", "center", "right"
		this.VertAlign = vertalign; //"top", "middle", "bottom"
	}

	copy()
	{
	    return new GraphicFont(this.FontName, this.SizePt, this.HorAlign, this.VertAlign);
	}

	draw(context)
	{
		context.font = this.SizePt + "px " + this.FontName;
		context.textAlign = this.HorAlign;
		context.textBaseline = this.VertAlign;
	}
}

//==================   GraphicText   ==================//
class GraphicText extends GraphicElement
{
	constructor(fillColor, penColor, text, gfont, point)
	{
		GraphicElement.call(this, fillColor, penColor);
		this.Text = text;
		this.Font = gfont;
		this.Point = point;
	}

	copy()
	{
	    return new GraphicText(this.FillColor, this.PenColor, this.Text, this.Font.copy(), this.Point.copy());
	}

	draw(context)
	{
		this.Font.draw(context);
		context.fillStyle = this.FillColor;
		context.strokeStyle = this.PenColor;
		context.fillText(this.Text, this.Point.X, this.Point.Y);
	}
	
	moveDxy(dx, dy)
	{
		this.Point.moveDxy(dx, dy);
	}	
}

//==================   Graphics2d   ==================//
class Graphics2d
{
	constructor(canvasID)
	{
		var cnv = document.getElementById(canvasID);
		this.Ctx = cnv.getContext("2d");
	}
	DrawElement(graphicelement)
	{
		return ;
	}
	drawCircleFill(circle)
	{
	//	if (this.FillColor != undefined) 
	//	{
		this.Ctx.beginPath();
		//context.fillStyle = this.FillColor;
		this.Ctx.arc(circle.Center.X, circle.Center.Y, circle.Radius, 0, 2 * Math.PI);
		this.Ctx.fill();
	//	}
	//	if (this.PenColor != undefined) 
	//	{
			context.strokeStyle = this.PenColor;
	//	}

	}
	drawCircleStroke(circle)
	{
		this.Ctx.beginPath();
		this.Ctx.arc(circle.Center.X, circle.Center.Y, circle.Radius, 0, 2 * Math.PI);
		this.Ctx.stroke();
	}
	drawPoint(point)
	{
		this.Ctx.arc();
	};
}

