//==================   Bullet   ==================//
class Bullet
{
    /**
     * 
     * @param {GraphicPicture} gpic
     * @param {Boolean} fromPlayer
     */
    constructor(gpic, fromPlayer)
    {
        this.GPic = gpic;
        this.FromPlayer = fromPlayer;
    }

    /**
     * draws the bullet to the context 
     * @param {HTMLElement} context
     */
    draw(context)
    {
        this.GPic.draw(context);
    };
}

//==================   Bullets   ==================//
class Bullets
{
    
    /**
     * creates a list of Bullets
     * @param {GraphicImage} imgSrc
     * @param {AARect} rectSrc
     * @param {Number} speed
     */
    construcor(imgSrc, rectSrc, speed)
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
    add(x, y, fromPlayer)
    {
        
        this.Bullets(this.Bullets.length) = new Bullet(); //gpic)
    }
    
    /**
     * moves all Bullets in the list 
     */
    move()
    {
        for (ii=0; ii<this.Bullets.length; ii++)
        {
            Bullets[ii].GPic.moveDxy(0, this.Speed);
        }
    }

    /**
     * draws all bullets in the list to the given context
     * @param {HTMLElement} context
     */
    draw(context)
    {
        for (ii=0; ii<this.Bullets.length; ii++)
        {
            Bullets[ii].draw(context);
        }
    }  
}
