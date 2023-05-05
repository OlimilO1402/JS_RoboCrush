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
	if (pcanvas == undefined) { alert("PaintCanvas is undefined"); return 0;}
	pcontext = pcanvas.getContext("2d");
	if (pcontext == undefined) {alert("PaintContext is undefined"); return 0;}

    ALoop = new AnimationLoop(pcanvas_refresh, pcontext, new AARect(Point.ORIGIN(), 800, 600));    
		
	test_geom();
	test_grafx();
	test_Button(pcanvas);
	pcanvas_refresh();
    ALoop.start();
}
function pcanvas_refresh()
{
	GGrp.draw(pcontext);
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
	var GCl = GGrp.add(new GraphicCircle("red", undefined, new Circle(GRc.AARect.center(), 40)));
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
	var arSrc = new AARect(new Point(0, 180), 200, 50);
	var arDst = arSrc.copy(); arDst.Point.moveDxy(330, -130);
	var gpic1 = new GraphicPicture(GImg, arSrc, arDst); //graphicimage, aarectSrc, aarectDst
	arSrc = arSrc.copy(); arSrc.Point.moveDxy(0, 50);
	var gpic2 = new GraphicPicture(GImg, arSrc, arDst); //graphicimage, aarectSrc, aarectDst
	var gfnt = new GraphicFont("Arial", 30, "center", "middle"); //fontname, sizepx, horalign, vertalign)
	var gtxt = new GraphicText("white", "black", "New Game", gfnt, arDst.center()); //fillColor, penColor, text, gfont, point
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
	alert("Button GBtn1 wurde geclicked")
}
function GBtn2_Click()
{
    Sound.play();
	alert("Button GBtn2 wurde geclicked")
}
