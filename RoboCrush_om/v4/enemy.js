//==================   Enemy   ==================//
/**
 * creates a new enemy
 * @param {GraphicPicture} gpic
 * @param {Number} speed
 * @param {Bullets} bullets
 */
function Enemy(gpic, speed, bullets)
{
    this.Life = 30;
    this.GPic = gpic;
    this.Speed = speed;
    this.Bombs = bullets;
}
/**
 * moves the enemy, they are only allowed to move from left to right  
 */
Enemy.prototype.move = function()
{
    //by definition only moves from left to right in x-direction
    this.GPic.moveDxy(this.Speed, 0);
};
/**
 * the enemy shoots, drops a bomb 
 */
Enemy.prototype.shoot = function()
{
    var x = this.GPic.AARectDst.right();
    var y = this.GPic.AARectDst.Point.Y;
    this.Bombs.add(x, y, true);
};