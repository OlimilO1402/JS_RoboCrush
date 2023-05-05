//==================   Bullet   ==================//
/**
 * 
 * @param {GraphicPicture} gpic
 * @param {Boolean} fromPlayer
 */
function Bullet(gpic, fromPlayer)
{
    this.GPic = gpic;
    this.FromPlayer = fromPlayer;
}
/**
 * draws the bullet to the context 
 * @param {HTMLElement} context
 */
Bullet.prototype.draw = function(context)
{
    this.GPic.draw(context);
};

//==================   Bullets   ==================//
/**
 * creates a list of Bullets
 * @param {GraphicImage} imgSrc
 * @param {AARect} rectSrc
 * @param {Number} speed
 */
function Bullets(imgSrc, rectSrc, speed)
{
    this.ImgSrc = imgSrc;
    this.RectSrc = rectSrc;
    this.Speed = speed;
    this.Bullets = new Array();
}
/**
 * adds a Bullet to the list
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} fromPlayer
 */
Bullets.prototype.add = function(x, y, fromPlayer)
{
    
    this.Bullets(this.Bullets.length) = new Bullet(); //gpic)
};
/**
 * moves all Bullets in the list 
 */
Bullets.prototype.move = function()
{
    for (ii=0; ii<this.Bullets.length; ii++)
    {
        Bullets[ii].GPic.moveDxy(0, this.Speed);
    }
};
/**
 * draws all bullets in the list to the given context
 * @param {HTMLElement} context
 */
Bullets.prototype.draw = function(context)
{
    for (ii=0; ii<this.Bullets.length; ii++)
    {
        Bullets[ii].draw(context);
    }
};