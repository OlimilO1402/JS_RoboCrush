//Nein, aus Game eine Klasse zu machen, ist doof, weil es eh ein Singleton sein muss
//dann kann mans gleich hier hineinschreiben
//var ImgBackground;
//var ImgSprite;
var bCanvas;
var bContxt;
var pCanvas;
var pContxt;
var Player;
var PlayerGun;
var Enemies;
var EnemyBombs;
var Sound;
var aLoop;
var GGrpGame;
var GGrpMenu;

window.onload = function() 
{
    bCanvas = document.getElementById("Background");
    bContxt = bCanvas.getContext("2d");
    pCanvas = document.getElementById("PaintCanvas");
    pContxt = bCanvas.getContext("2d");
    var imgBackgr = new GraphicImage("images/bg_sprite.png");
    var imgSprite = new GraphicImage("images/main_sprite.png");
    createMenu(imgBackgr, imgSprite, pCanvas);
    //loopfunction, context, recttoclear
    aLoop = new AnimationLoop(draw, pContxt, new AARect(new Point(5, 5), 800, 600));
    Player = new Player();
    Enemies = new Array();
    Bullets = new Bullets();
    aLoop.start();
};
function createMenu(imgBackgr, imgSprite, canvas)
{
    GGrpMenu = new GraphicGroup();
    //Hintergrund
    var rBgdSrc = new AARect(Point.ORIGIN(), 800, 600);
    var rBgdDst = rBgdSrc.copy();
    rBgdSrc.Point.moveDxy(0, 600);
    GGrpMenu.add(new GraphicPicture(imgBackgr, rBgdSrc, rBgdDst));
    
    //Buttons
    var rBtnSrcN = new AARect(new Point(0, 180), 200, 50);
    var rBtnSrcH = rBtnSrcN.copy().moveDxy(0, 50);
    var rBtnDst  = new AARect(Point.ORIGIN(), 200, 50);
    //rBtnSrcN.Point.moveDxy(0, 180);
    rBtnDst.
    rBtnDst.Point.move(rBgdSrc.midpoint()).moveDxy(-rBtnDst.Width/2, 200);

    //fontname, sizept, horalign, vertalign
    var gFnt = new GraphicFont("Arial", 20, "center", "middle");
    //fillColor, penColor, text, gfont, point
    var gTxt = new GraphicText("white", "white", "Neues Spiel", gFnt, rBtnDst.midpoint());
    
    //graphicimage, aarectSrc, aarectDst
    var gPicN = new GraphicPicture(imgSprite, rBtnSrcN, rBtnDst);
    var gPicH = new GraphicPicture(imgSprite, rBtnSrcH, rBtnDst);
    //canvas, gtext, gpicnormal, gpichover
    var GBtn = GGrpMenu.add(new Button(canvas, gTxt, gPicN, gPicH));
    //var pnt = new Point(10, 10);
    //var pnt2 = pnt.copy();
    
}
function createGame()
{
    
}
function draw()
{
    GGrpMenu.draw(pContxt);
}
