var version='0.0.1';
var is_playing = false;
init();
function init()
{
	background_canvas = document.getElementById('background_canvas');
	background_ctx = background_canvas.getContext('2d');
	main_canvas = document.getElementById('main_canvas');
	main_ctx = main_canvas.getContext('2d');
	
	document.addEventListener("keydown", key_down, false);
	document.addEventListener("keyup",   key_up,   false);
	
	requestaframe = (function()
	{
		return window.requestAnimationFrame		  ||
			   window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame	  ||
			   window.oRequestAnimationFrame	  ||
			   window.msRequestAnimationFrame	  ||
			   function(callback) 
			   {
					window.setTimeout(callback, 1000 / 60);
			   }			   
	})();
	
	buttons_drawX = new Array();
	buttons_drawY = new Array();
	buttons_width = new Array();
	buttons_height = new Array();
	buttons_status = new Array();

	is_menu = true;
	menu_status = "main";
	load_media();
	bg_sprite.addEventListener("load", start_loop, false);
	//menu();
}
function load_media()
{
	bg_sprite = new Image();
	bg_sprite.src = 'images/bg_sprite.png';
	main_sprite = new Image();
	main_sprite.src = 'images/main_sprite.png';
	
	explosion_audio = new Audio();
	explosion_audio.autobuffer = true;
	
	var can_play_mp3 = explosion_audio.canPlayType('audio/mpeg;');
	if (can_play_mp3.match(/maybe|probably/i))
	{
		explosion_audio.src = "sounds/explosion.mp3";	
		explosion_audio.type = 'audio/mpeg';
	}
	else
	{
		explosion_audio.src = "sounds/explosion.wav";	
		explosion_audio.type = 'audio/x-wav';
	}
}
function menu()
{
	main_menu_buttons = new Array("Neues Spiel", "Optionen", "Credits");
	pause_menu_buttons = new Array("Weiter", "Neues Spiel", "Optionen");
	game_over_menu_buttons = main_menu_buttons;
	
	var menu_buttons;
	switch (menu_status)
	{		
		case "main":	  menu_buttons = main_menu_buttons;
		case "pause":     menu_buttons = pause_menu_buttons;
		case "game_over": menu_buttons = game_over_menu_buttons;
	}
	if (menu_status == "game_over")
	{
		main_ctx.fillStyle = "red";
		main_ctx.font = "50px Arial";
		main_ctx.textAlign = "center";
		main_ctx.textBaseline = 'middle'; // 'bottom', 'top', 'middle'
		main_ctx.fillText("GAME OVER!", 800 / 2, 130);
		
		main_ctx.fillStyle = "blue";
		main_ctx.font = "30px Arial";
		main_ctx.textAlign = "center";
		main_ctx.textBaseline = 'middle'; // 'bottom', 'top', 'middle'
		main_ctx.fillText("Level: " + wave + " - Punkte: " + score, 800 / 2, 170);
	}
	for (var i = 0; i < menu_buttons.length; i++)
	{
		var drawX = 600 / 2;
		var drawY = 200 + i * 100;
		var height = 50;
		var width = 200;
		var srcY = 180;
		
		if (buttons_status[i] == undefined)
		{
			buttons_status[i] = "normal";
			buttons_drawX[i] = drawX;
			buttons_drawY[i] = drawY;
			buttons_height[i] = height;
			buttons_width[i] = width;
		}
		if (buttons_status[i] == "click")
		{
			if (i == 0 && menu_status == "main" || i == 1 && menu_status == "pause" || i == 0 && menu_status == "game_over")
				new_game();
			
			if (i == 0 && menu_status == "pause")
				is_menu = false;
			
			buttons_status[i] = "hover";
		}
		if (buttons_status[i] == "hover")
			srcY += height;
		
		main_ctx.drawImage(main_sprite, 0, srcY, 200, 50, drawX, drawY, width, height);
		main_ctx.fillStyle = "white";
		main_ctx.font = "30px Arial";
		main_ctx.textAlign = "center";
		main_ctx.textBaseline = 'middle'; // 'bottom', 'top', 'middle'
		main_ctx.fillText(menu_buttons[i], drawX + width / 2, drawY + height / 2);

	}
	background_ctx.drawImage(bg_sprite, 0, 600, 800, 600, 0, 0, 800, 600);
}
function mouse(type, e)
{
	var x = e.pageX - document.getElementById('game_object').offsetLeft;
	var y = e.pageY - document.getElementById('game_object').offsetTop;
	
	for (var i = 0; i < buttons_status.length; i++)
	{
		if (buttons_drawX[i] <= x && x <= buttons_drawX[i] + buttons_width[i] &&
			buttons_drawY[i] <= y && y <= buttons_drawY[i] + buttons_height[i])
		{
			if (type == 'move' && buttons_status[i] != "click")
				buttons_status[i] = "hover";
			else
				buttons_status[i] = "click";
		}
		else
			buttons_status[i] = "normal";
	}
	document.getElementById('x').innerHTML = x;
	document.getElementById('y').innerHTML = y;
}

function Player()
{
	this.life = 100;
	this.drawY = 570 - 100;
	this.srcX = 0;
	this.srcY = 0;
	this.width = 100;
	this.drawX = 800 / 2 - this.width / 2;
	this.height = 100;
	this.speed = 5;
	this.is_keydown  = false;
	this.is_keyup    = false;
	this.is_keyleft  = false;
	this.is_keyright = false;
	this.shoot_wait = 0;
	this.is_dead = false;
}
Player.prototype.draw = function()
{
	if (this.is_dead == false)
	{
		this.check_keys();
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
		main_ctx.drawImage(main_sprite, 100, 20, 10, 50, this.drawX + this.width - 5, this.drawY, 10, 50);
		
		if (this.life <= 0)
		{
			this.is_dead = true;
			this.explode_wait = 50;
			try { explosion_audio.currentTime = 0; } catch(e){};
			explosion_audio.play();				
		}
	}
	else if (this.explode_wait > 0)
	{
		main_ctx.drawImage(main_sprite, 120, 0, 20, 20, this.drawX, this.drawY, 100, 100);
		this.explode_wait--;
	}
	else
	{
		is_menu = true;
		menu_status = "game_over";
	}
}
Player.prototype.check_keys = function()
{
	/*if (this.is_keydown == true)
		this.drawY += this.speed;
	if (this.is_keyup == true)
		this.drawY -= this.speed;
		*/
	if (this.is_keyright == true)
		this.drawX += this.speed;
	if (this.is_keyleft == true)
		this.drawX -= this.speed;
	
	if (this.is_keyup == true && this.shoot_wait < 0)
	{
		bullets[bullets.length] = new Bullet(this.drawX + this.width - 5, this.drawY, true);
		this.shoot_wait = 20;
	}
	else
		this.shoot_wait--;
}

function Enemy()
{
	this.life = 30;
	this.drawX = -500 + Math.round(Math.random() * 300);
	this.drawY = Math.round(Math.random() * 300);
	this.srcX = 0;
	this.srcY = 100;
	this.width = 180;
	this.height = 80;
	this.speed = 2 + Math.random() * 5;
	this.is_dead = false;
	this.explode_wait = 0;
}
Enemy.prototype.draw = function()
{
	if (this.is_dead == false)
	{
		this.ai();
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
		
		/*
		main_ctx.fillStyle = "black";
		main_ctx.font = "30px Arial";
		main_ctx.textBaseLine = 'bottom';
		main_ctx.fillText(this.life, this.drawX, this.drawY);
		*/
		
		main_ctx.fillStyle = "black";
		main_ctx.fillRect(this.drawX + 20, this.drawY + 17, 100, 6);
		
		main_ctx.fillStyle = "red";
		main_ctx.fillRect(this.drawX + 21, this.drawY + 18, this.life / 30 * 98, 4);

		if (this.life <= 0)
		{
			dead_enemies++;
			this.is_dead = true;
			this.explode_wait = 20;
			try { explosion_audio.currentTime = 0; } catch(e){};
			explosion_audio.play();				
			score += 10;
		}
	}
	else if (this.explode_wait > 0)
	{
		main_ctx.drawImage(main_sprite, 120, 0, 20, 20, this.drawX, this.drawY, 180, 80);
		this.explode_wait--;
	}
}
Enemy.prototype.ai = function()
{
	this.drawX += this.speed;
	if (this.drawX > 800)
		this.drawX = -this.width;
	if (Math.round(Math.random() * 100) == 50)
		bullets[bullets.length] = new Bullet(this.drawX, this.drawY);
}

function Bullet(x, y, is_player)
{
	if (is_player == true)
		this.is_player = true;
	else
		this.is_player = false;

	this.drawX = x;
	this.drawY = y;
	if (this.is_player == true)
		this.srcX = 140;
	else
		this.srcX = 100;
	
	this.srcY = 0;
	this.width = 20;
	this.height = 20;
	this.speed = 7;
	this.exploded = false;
	this.wait = 0;
}
Bullet.prototype.draw = function()
{	
	if ((this.is_player == false) &
		(player.drawX <= this.drawX + this.width)  & (this.drawX <= player.drawX + player.width) &
		(player.drawY <= this.drawY + this.height) & (this.drawY <= player.drawY + player.height) &
		(this.exploded == false))
	{
		this.exploded = true;
		this.wait = 10;
		player.life -= 10;
	}
	if (this.is_player == true)
	{
		for (var i = 0; i < enemies.length; i++)
		{
			if ((enemies[i].drawX <= this.drawX + this.width)  & (this.drawX <= enemies[i].drawX + enemies[i].width) &
			    (enemies[i].drawY <= this.drawY + this.height) & (this.drawY <= enemies[i].drawY + enemies[i].height - 50) & 
			    (this.exploded == false) & (enemies[i].is_dead == false))
			{
				this.exploded = true;
				this.wait = 10;
				enemies[i].life -= 10;
				score++;
			}
		}
	}
	
	if (this.exploded == true)
	{
		if (this.wait > 0)
		{
			main_ctx.drawImage(main_sprite, 120, 0, 20, 20, this.drawX, this.drawY, 50, 50);
			this.wait--;
		}
	} else
	{
		main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
		if (this.is_player == true)
			this.drawY -= this.speed;
		else
			this.drawY += this.speed;
	}
}

function check_wave()
{
	if (spawned_enemies == dead_enemies)
	{
		if (is_timeout)
		{
			main_ctx.fillStyle = "black";
			main_ctx.globalAlpha = 0.7;
			main_ctx.fillRect(800 / 2 - 400 / 2, 600 / 2 - 100 / 2, 400, 100 )
			main_ctx.globalAlpha = 1;
			
			main_ctx.fillStyle = "white";
			main_ctx.textAlign = "center";
			main_ctx.textBaseline = "middle";
			main_ctx.font = "50px Arial";
			main_ctx.fillText("Nächster Level!", 800 / 2, 600 / 2);
		}
		else
		{
			is_timeout = true;
			if (spawned_enemies == 0)
			{
				wave++; 
				spawn_enemy(wave); 
				is_timeout = false;
			}
			else
				window.setTimeout(function() {wave++; spawn_enemy(wave); is_timeout = false;}, 2000);				
		}
	}
}
function spawn_enemy(n)
{
	spawned_enemies += n;
	for (var i = 0; i < n; i++)
	{
		enemies[enemies.length] = new Enemy();
	}
}
function loop()
{	
	
	main_ctx.clearRect(0,0,800,600);
	
	if (is_menu == false)
	{
		background_ctx.drawImage(bg_sprite, 0 ,0);
		player.draw()
		for (var i = 0; i < enemies.length; i++)
		{
			enemies[i].draw();
		}
		for (var i = 0; i < bullets.length; i++)
		{
			bullets[i].draw();
		}
		
		main_ctx.fillStyle = "gray";
		main_ctx.font = "30px Arial";
		main_ctx.textAlign = "left";
		main_ctx.textBaseline = 'top';
		main_ctx.fillText(player.life, 0, 0);
		
		main_ctx.fillStyle = "gray";
		main_ctx.font = "30px Arial";
		main_ctx.textAlign = "right";
		main_ctx.textBaseline = 'top';
		main_ctx.fillText("Level: " + wave, 800, 0);

		main_ctx.fillStyle = "white";
		main_ctx.font = "30px Arial";
		main_ctx.textAlign = "left";
		main_ctx.textBaseline = 'bottom';
		main_ctx.fillText("Punkte: " + score, 0, 600);
				
		check_wave();
	}
	else
		menu();
	
	if (is_playing) 
		requestaframe(loop);
}
function new_game()
{
	player = new Player();
	enemies = new Array();
	bullets = new Array();

	dead_enemies = 0;
	spawned_enemies = 0;
	wave = 0;
	score = 0;
	is_timeout = false;
	
	is_menu = false;
}
function start_loop()
{
	is_playing = true;
	loop();
}
function stop_loop()
{
	is_playing = false;	
}
function key_down(e)
{
	var key_id = e.keyCode || e.which;
	if (key_id == 40) // key down
	{
		player.is_keydown  = true; //r_y++;
		e.preventDefault();
	}
	if (key_id == 38) // key up
	{
		player.is_keyup    = true; //r_y--;
		e.preventDefault();
	}
	if (key_id == 39) // key right
	{
		player.is_keyright = true; //r_x++;
		e.preventDefault();
	}
	if (key_id == 37) // key left
	{
		player.is_keyleft  = true; //r_x--;
		e.preventDefault();
	}
	if (key_id == 27 || key_id == 80) //esc oder 'p'-key
	{
		is_menu = true;
		menu_status = 'pause';
	}
}
function key_up(e)
{
	var key_id = e.keyCode || e.which;
	if (key_id == 40) // key down
	{
		player.is_keydown  = false; 
		e.preventDefault();
	}
	if (key_id == 38) // key up
	{
		player.is_keyup    = false; 
		e.preventDefault();
	}
	if (key_id == 39) // key right
	{
		player.is_keyright = false; 
		e.preventDefault();
	}
	if (key_id == 37) // key left
	{
		player.is_keyleft  = false; 
		e.preventDefault();
	}
}