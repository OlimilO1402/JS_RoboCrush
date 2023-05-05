//==================   Player   ==================//
/**
 * creates a Player object
 * @param {GraphicPicture} gpic
 * @param {Number} speed
 * @param {Bullets} bullets
 */
function Player(gpic, speed, bullets)
{
    this.Life = 100;
    this.GPic = gpic;
    this.Speed = speed;
    this.Gun = bullets;
}
/**
 * moves the Player left or right
 * @param {String} direction the directio of movement
 */
Player.prototype.move = function(direction)
{
    //by definition only moves left-right in x-direction
    var s = (direction==="left")? -this.Speed: this.Speed;
    this.GPic.moveDxy(s, 0);
};
/**
 * Player shoots a bullet with it's gun 
 */
Player.prototype.shoot = function()
{
//Bullets.prototype.add = function(x, y, fromPlayer)
    var x = this.GPic.AARectDst.right() - 10;
    var y = this.GPic.AARectDst.Point.Y;
    this.Gun.add(x, y, true);
};
/**
 * returns true if Player is hit by enemy bomb
 * @param {Bullet} bullet
 */
Player.prototype.isHit = function(bullet)
{
    return (bullet.FromPlayer)? false: this.GPic.AARectDst.contains(bullet.GPic.AARectDst.center());
};
/**
 * draws the player to the context 
 * @param {HTMLElement} context
 */
Player.prototype.draw = function(context){
    this.GPic.draw(context);
};