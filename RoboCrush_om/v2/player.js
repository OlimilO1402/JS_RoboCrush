function Player(gpic, speed, bullets)
{
    this.Life = 100;
    this.GPic = gpic;
    this.Speed = speed;
    this.Gun = bullets;
}
Player.prototype.move = function(direction)
{
    //by definition only moves left-right in x-direction
    var s = (direction==="left")? -this.Speed: this.Speed;
    this.GPic.moveDxy(s, 0);
};
Player.prototype.shoot = function()
{
//Bullets.prototype.add = function(x, y, fromPlayer)
    var x = this.GPic.AARectDst.right() - 10;
    var y = this.GPic.AARectDst.Point.Y;
    this.Gun.add(x, y, true);
};
Player.prototype.isHit = function(bullet)
{
    return (bullet.FromPlayer)? false: this.GPic.AARectDst.contains(bullet.GPic.AARectDst.center());
};
Player.prototype.draw = function(context){
    this.GPic.draw(context);
};