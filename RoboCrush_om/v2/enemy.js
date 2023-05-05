function Enemy(gpic, speed, bullets)
{
    this.Life = 30;
    this.GPic = gpic;
    this.Speed = speed;
    this.Bombs = bullets;
}
Enemy.prototype.move = function()
{
    //by definition only moves from left to right in x-direction
    this.GPic.moveDxy(this.Speed, 0);
};
Enemy.prototype.shoot = function()
{
//Bullets.prototype.add = function(x, y, fromPlayer)
    var x = this.GPic.AARectDst.right();
    var y = this.GPic.AARectDst.Point.Y;
    this.Bombs.add(x, y, true);
};