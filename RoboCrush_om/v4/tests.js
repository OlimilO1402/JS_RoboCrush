var GGrp;
var GImg;
var pcanvas;
var pcontext;
var GBtn;
var Sound;
var ALoop;
window.onload = function() 
{
    Sound = new Sound("sounds/explosion.mp3");
	GGrp = new GraphicGroup();

	pcanvas = document.getElementById("PaintCanvas");
	if (pcanvas === undefined) { alert("PaintCanvas is undefined"); return 0;}
	if (pcanvas === null) { alert("PaintCanvas is null"); return 0;}
	pcontext = pcanvas.getContext("2d");
	if (pcontext === undefined) {alert("PaintContext is undefined"); return 0;}

    ALoop = new AnimationLoop(pcanvas_refresh, pcontext, new AARect(Point.ORIGIN(), 800, 600));    
	
	test1();
	//test_Enum();
	//test_Color();
	//test_Styles();
	//test_Gradient();
	//test_geom();
	//test_grafx();
	//test_Button(pcanvas);
	//pcanvas_refresh();
    //ALoop.start();
};
function test1()
{
	if (confirm("are you sure?" )) //coMfirm
	{
		alert("yes / OK");
	}
	else
	{
		alert("no / cancel");
	}
}
function pcanvas_refresh()
{
	GGrp.draw(pcontext);
}
MyTestEnum = {
	NNUULL: 0xFF,
	EEIINNSS : 0xC0FFEE,
	ZZWWEEII : 0x1234
};
MyTestEnum = new Enum(MyTestEnum);

function test_Enum()
{
	var e = MyTestEnum.EEIINNSS;
	var s = parseInt(e).toString(16).toUpperCase();
	switch(e)
	{
		case MyTestEnum.NNUULL :   alert("0: " + s); break;
		case MyTestEnum.EEIINNSS : alert("1: " + s); break;
		case MyTestEnum.ZZWWEEII : alert("2: " + s); break;
	}
	alert(e.name + " = " + e);
	var x = MyTestEnum.NNUULL;
	alert("MyTestEnum.contains(x): " + MyTestEnum.contains(x));
}

function test_Color()
{
	//alert(typeof MyTestEnum === "object");
	//var e = new Enum("NNUULL", "EEIINNSS", "ZZWWEEII");
	
	var n_xy = 140.0;
	var n_x = 7.0;
	var n_y = n_xy / n_x;
	var l = 0.0; var t = 0.0;
	var w = 800.0 / n_x; var h = 600.0 / n_y;
	var j = 0;
	function drawrect(c)
	{
		pcontext.fillStyle = c;
		pcontext.fillRect(l, t, w, h);
		pcontext.fillStyle = (c.lightness() < 0.45)? "white": "black";
		//else 
		//pcontext.fillStyle = c.inverted(); 
		
		pcontext.textAlign = "center";
		pcontext.textBaseline = "middle";
		if (c.isKnownColor()) j = c.knowncolor.index;
		
		pcontext.fillText(j + ": " + c.name(), l+w/2, t+h/2);
		l += w;
		if (l >= 800) 
		{
			l = 0.0;
			t += h;
		}		
	}
	var c;
	c = new Color(200, 0, 0, 1);         drawrect(c); //alert(c); 
	c = Color.fromHSLA(100, 1, 0.5, 1);  drawrect(c); //alert(c); 
	c = Color.fromHexRGBA("00FF007F");   drawrect(c); //alert(c); 
	c = Color.fromHexRGBA("#0000FF7F");  drawrect(c); //alert(c); 
	c = Color.fromHexRGBA("&H8F8F007F"); drawrect(c); //alert(c); 
	c = Color.fromHexRGBA("0xFF0000FF"); drawrect(c); //alert(c); 
	
	function getString(col)
	{ //
		return col + "; " + col.toHexRGB()+ "; " + col.name() + "\n" +  
		      "hue: " + col.hue() + ", sat: " + col.saturation() + ", ltn: " + col.lightness() + ", lum: " + col.luminance() + "\n";
	}
	c = Color.fromName("yellowgreen"); drawrect(c); //alert(c);
	//return;

	//alert(getString(c));
	c = Color.fromHSLA(c); //.hue(), c.saturation(), c.lightness(), c.A);
	//alert(getString(c));
	var s1 = ""; var s2 = "";
	var c1, c2; 
	var i_OK = 0; var i_not = 0;
	var tmpColors = new Array(); 
	var n = 140;
	//aqua und cyan, fuchsia und magenta sind die gleichen Farben
	for (var key in KnownColors) //Color.Values)
	{
		i++;
		//if(Color.Values.hasOwnProperty(key))
		if(KnownColors.hasOwnProperty(key))
		{
			c1 = Color.fromName(key);
			s1 = getString(c1);
		    c2 = Color.fromHSLA(c1); //.hue(), c1.saturation(), c1.lightness(), c1.A);
			s2 = getString(c2);
			if (s1 === s2) {
				i_OK ++;
				//alert("OK\n" + s1 + s2);
			} else {
				i_not ++;
				//if (i_not == 1) 
				//alert("Shit \n" + s1 + s2);
				//alert("n: " + n + "\n" + s1 + "\n" + s2);
			}
			tmpColors[tmpColors.length] = c1; //.toGrayB();
			//tmpColors[tmpColors.length] = c1.toGray();
			//tmpColors[tmpColors.length] = c1.toGrayB();
			//tmpColors[tmpColors.length] = c1.toGrayL();
			//drawrect(c1);
		}
	}
	//if(i_OK == n) alert("alle OK: " + i_OK + " von " + n);
	//else alert("n: " + n + "; OK: " + i_OK + " - not: " + i_not);
	//was könnten wir noch testen?
	//OK die vordefinierten Farben
	//for (i = 0; i < tmpColors.length; i++)
	//{
	//	c = tmpColors[i];
	//	drawrect(c);
	//}
	//so jetzt nach hue, sat, lum sortieren
	//alert(tmpColors.length);
	tmpColors.sort(
		function(cl1, cl2)
		{
			var d = 0.0;
			if (d == 0.0) d = cl1.hue() - cl2.hue();
			if (d == 0.0) d = cl1.saturation() - cl2.saturation();			
			if (d == 0.0) d = cl1.lightness() - cl2.lightness();
			//if (d == 0.0) d = cl1.brightness() - cl2.brightness();
			//alert(dh); 
			return d;
		}
	);
	pcontext.clearRect(0, 0, 800, 600); i = 0; l = 0; t = 0;

	for (var i = 0; i < tmpColors.length; i++)
	{
		drawrect(tmpColors[i]);
	}
	//alert(tmpColors.length);	
	//und jetzt noch GetPixel testen
	var rgba = pcontext.getImageData(490, 290, 1, 1).data;
	var mc = new Color(rgba[0], rgba[1], rgba[2], rgba[3]);
	l = 0; t = 0;
    drawrect(mc);
    var mc2 = Color.fromCMYK(mc.cyan(), mc.magenta(), mc.yellow(), mc.keyblack());
    drawrect(mc2);
    alert(mc.toString()); //tja, a ist als byte 0-255 definiert, dann ist es als double 0-1 eigentlich falsch
    alert(mc2.toString());
}
function test_Styles()
{
	//Pattern, LineStyle, StrokeStyle, FillStyle
	var l = 0;
	var t = 0;
	var w, h;
	function testrect()
	{
		w = 100; h = 30;
		var r = new AARect(new Point(l, t), w, h);
		pcontext.fillRect(r.Point.X, r.Point.Y, r.Width, r.Height);		
		l += w; if (l >= 800){ l = 0.0; t += h; }		
	}
	function teststrokerect()
	{
		w = 100; h = 30;
		var r = new AARect(new Point(l, t), w, h);
		pcontext.strokeRect(r.Point.X, r.Point.Y, r.Width, r.Height);		
		l += w; if (l >= 800){ l = 0.0; t += h; }		
	}
	var img = new Image();
	img.src = "";
	var pat = new Pattern(img);
	
	//entweder:
	pcontext.fillStyle = KnownColors.darkmagenta.name;
	testrect();
	//oder:
	pcontext.fillStyle = Color.fromKnownColor(KnownColors.darkcyan);
	testrect();
	//oder:
	pcontext.fillStyle = new FillStyle(Color.fromKnownColor(KnownColors.firebrick)).adopt(pcontext);
	testrect();
	
	pcontext.strokeStyle = new StrokeStyle(KnownColors.darkgoldenrod.name, 20, new LineStyle("round", "round", 3));
	teststrokerect();
}
function test_Gradient()
{
	var r = new AARect(new Point(20, 20), 120, 80);
	var grd1 = new GradientLinear(r);
	grd1.addColor(0, new Color(255, 0, 0)); //"black"); //
	grd1.addColor(1, new Color(0, 255, 0)); //"white"); //
	pcontext.fillStyle = grd1.adopt(pcontext);
	pcontext.fillRect(r.Point.X, r.Point.Y, r.Width, r.Height);
	//pcontext.endPath();
	var c0 = new Circle(new Point(200, 60), 1);
	var c  = new Circle(new Point(200, 60), 40);
	var grd2 = new GradientRadial(c0, c);
	grd2.addColor(0, new Color(255, 255, 255));
	grd2.addColor(0.75, new Color(255, 0, 0));
	grd2.addColor(1, new Color(127, 127, 127));
	pcontext.fillStyle = grd2.adopt(pcontext);
	//alert(grd);
	pcontext.beginPath();
	pcontext.arc(c.Center.X, c.Center.Y, c.Radius, 0, 2 * Math.PI);
	pcontext.fill();
	
	r.moveDxy(0, 90);
	grd1 = new GradientLinear(r);
	grd1.addColor(0, new Color(0, 127, 255)); //"black"); //
	grd1.addColor(1, new Color(255, 255, 0)); //"white"); //
	pcontext.strokeStyle = grd1.adopt(pcontext);
	pcontext.lineWidth = 10;
	pcontext.strokeRect(r.Point.X, r.Point.Y, r.Width, r.Height);
	
	c0.Center.moveDxy(-10, 55);
	c.Center.moveDxy(0, 90);
	grd2 = new GradientRadial(c0, c);
	grd2.addColor(0, new Color(255, 255, 255));
	grd2.addColor(0.90, new Color(0, 100, 255));
	grd2.addColor(1, new Color(255, 0, 127));
	pcontext.strokeStyle = grd2.adopt(pcontext);
	pcontext.lineWidth = 15;
	pcontext.beginPath();
	pcontext.arc(c.Center.X, c.Center.Y, c.Radius, 0, 2 * Math.PI);
	pcontext.stroke();
	
}
function test_geom()
{
	test_Point();
	test_Circle();
	test_AARect();
}
function test_Point()
{
	var pt = new Point(20, 30);
	alert(pt);
	
	var pt0 = Point.ORIGIN();
	alert(pt0);
	
	var pt1 = pt.copy().moveDxy(25, -15); 
	alert(pt1);
	
	pt1.moveDxy(-5, 15);
	alert(pt1);
	
	alert("the distance from " + pt0 + " to " + pt1 + " is " + pt0.distanceTo(pt1));
}
function test_Circle()
{
	var crcl = new Circle(new Point(180, 150), 120);
	alert(crcl + " diameter: " + crcl.diameter());
	var pti = new Point(220, 175);
	var s = (crcl.contains(pti))? "": "not ";
	alert(crcl + " contains " + s + pti);
}
function test_AARect()
{
	var rect = new AARect(new Point(30, 15), 50, 40);
	alert(rect);
	var pti = new Point(40, 30);
	var s = (rect.contains(pti))? "": "not ";
	alert(rect + " contains " + s + pti);
}
function test_grafx()
{
	//von unten nach oben
	var GRc = GGrp.add(new GraphicAARect("white", "gray", new AARect(new Point(30, 40), 140, 120)));
	var GCl = GGrp.add(new GraphicCircle("rgba(200, 10, 10, 0.6)", undefined, new Circle(GRc.AARect.midpoint().moveDxy(30,0), 75)));
	var GPt = GGrp.add(new GraphicPoint("white", "black", GCl.Circle.Center.copy()));
	
	GImg = new GraphicImage("images/test_sprite.png");
	var rsrc = new AARect(Point.ORIGIN(), 99, 100);
	var GPc = GGrp.add(new GraphicPicture(GImg, rsrc, rsrc.copy()));
	GPc.moveDxy(200, 50);
	
	GGrp.moveDxy(5, 5);	
}
function test_Button(canvas)
{
	//var GImg = new GraphicImage("images/test_sprite.png"); //path
	var arSrc = new AARect(new Point(0, 180), 6, 50);
	var arDst = arSrc.copy(); arDst.Point.moveDxy(330, -130);
	arDst.Width = 200;
	var gpic1 = new GraphicPicture(GImg, arSrc, arDst); //graphicimage, aarectSrc, aarectDst
	arSrc = arSrc.copy(); arSrc.Point.moveDxy(0, 50);
	var gpic2 = new GraphicPicture(GImg, arSrc, arDst); //graphicimage, aarectSrc, aarectDst
	var gfnt = new GraphicFont("Arial", 30, "center", "middle"); //fontname, sizepx, horalign, vertalign)
	var gtxt = new GraphicText("white", "black", "New Game", gfnt, arDst.midpoint()); //fillColor, penColor, text, gfont, point
	GBtn = new Button(canvas, gtxt, gpic1, gpic2); //canvas, gtext, gpicnormal, gpichover
	GBtn.setClickHandler(GBtn1_Click);
	GGrp.add(GBtn);
    var GBtn2 = GBtn.copy();
    GBtn2.moveDxy(0, 75);
    GBtn2.GraphicText.Text = "Button 2";
    GBtn2.setClickHandler(GBtn2_Click);
    GGrp.add(GBtn2);
}
function GBtn1_Click()
{
    Sound.play();
	alert("Button GBtn1 wurde geclicked");
}
function GBtn2_Click()
{
    Sound.play();
	alert("Button GBtn2 wurde geclicked");
}
