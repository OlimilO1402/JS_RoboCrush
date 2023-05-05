function Bullet(gpic, fromPlayer)
{
    this.GPic = gpic;
    this.FromPlayer
}
Bullet.prototype.draw = function(context)
{
    this.GPic.draw(context);
};
function Bullets(imgSrc, rectSrc, speed)
{
    this.ImgSrc = imgSrc;
    this.RectSrc = rectSrc;
    this.Speed = speed;
    this.Bullets = new Array();
}
Bullets.prototype.add = function(x, y, fromPlayer)
{
    
    this.Bullets(this.Bullets.length) = new Bullet();//gpic)
};
Bullets.prototype.move = function()
{
    for (ii=0; ii<this.Bullets.length; ii++)
    {
        Bullets[ii].GPic.moveDxy(0, this.Speed);
    }
}
Bullets.prototype.draw = function(context)
{
    for (ii=0; ii<this.Bullets.length; ii++)
    {
        Bullets[ii].draw(context);
    }
}