function init()
{
    canvas=document.getElementById('mycanvas');
    pen=canvas.getContext('2d');
    w=canvas.width=1200;
    h=canvas.height=700;
    cs= 25;
    gameover=false;
    food_img=new Image();
    food_img.src="images/fruit.png";
    board=new Image();
    board.src="images/score.png";
    score=0;
    high= localStorage.getItem("snakeHighScore")?localStorage.getItem("snakeHighScore"):0 ;
    food=randfood();
    snake={
        len:5,
        cells:[],
        direction:"right",
        prev_direction:"right",
        color:"#478495",
        createsnake:function()
        {
            for(var i=this.len;i>0;i--)
            {
                this.cells.push({x:i,y:0});
            }
        },
        drawsnake :function(){
            for(var i=0;i<this.cells.length;i++)
            {
                pen.fillStyle=this.color;
                pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs,cs);
            }
        },
        updatesnake: function()
        {
            var headx=this.cells[0].x;
            var heady=this.cells[0].y;
            var nx,ny;
            if(food.x==this.cells[0].x && food.y==this.cells[0].y)
            {
                var f1=true;
                score++;
                while(f1)
                {
                    f1=false;
                    food=randfood();
                    for(var i=0;i<this.cells.length;i++)
                    {
                        if(food.x==this.cells[i].x && this.cells[i].y==food.y)
                        {
                            f1=true;
                            break;
                        }
                    }
                }
            }
            else{
                this.cells.pop();
            }
            if(this.direction=="right" && this.prev_direction!="left" )
            {
                nx=headx+1;
                ny=heady;
                this.prev_direction="right";
            }
            else if(this.direction=="left" && this.prev_direction!="right")
            {
                nx=headx-1;
                ny=heady;
                this.prev_direction="left";
            }
            else if(this.direction=="up" && this.prev_direction!="down")
            {
                nx=headx;
                ny=heady-1;
                this.prev_direction="up";
            }
            else if(this.direction=="down" && this.prev_direction!="up")
            {
                nx=headx;
                ny=heady+1;
                this.prev_direction="down";
            }
            this.cells.unshift({x:nx,y:ny});
            var lastx=Math.round(w/cs);
            var lasty=Math.round(h/cs);
            if(this.cells[0].x<0 || this.cells[0].y<0 || this.cells[0].x>lastx-1|| this.cells[0].y>lasty-1)
            {
                gameover=true;
            }
            for(var i=1;i<this.cells.length;i++)
            {
                if(this.cells[0].x==this.cells[i].x && this.cells[0].y==this.cells[i].y)
                {
                    gameover=true;
                    break;
                }
            }
            
        },
    }
    snake.createsnake();
    function move(e)
    {
        if(e.key=='ArrowRight' && snake.prev_direction!="left")
        {
            snake.direction="right";
        }
        else if(e.key=='ArrowDown'&& snake.prev_direction!="up")
        {
            snake.direction="down";
        }
        else if(e.key=='ArrowLeft' && snake.prev_direction!="right")
        {
            snake.direction="left";
        }
        else if(e.key=='ArrowUp' && snake.prev_direction!="down")
        {
            snake.direction="up";
        }
    }
    document.addEventListener('keydown',move);
}
function draw()
{
    pen.clearRect(0,0,w,h);
    snake.drawsnake();
    pen.fillStyle=food.color;
    pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);
    pen.drawImage(board,23,15,80,50);
    pen.fillStyle="black";
    pen.font="30px Solid Roboto";
    pen.fillText(score,50,50);
    
}
function randfood()
{
    var fx=Math.round(Math.random()*(w-cs)/cs);
    var fy=Math.round(Math.random()*(h-cs)/cs);
    var food={
        x:fx,
        y:fy,
        color:"red",
    }
    return food;
}
function update()
{
    snake.updatesnake();
}
function gameloop()
{
    if(gameover)
    {
        clearInterval(f);
        high=Math.max(score,high);
        localStorage.setItem("snakeHighScore", high);
        swal({title:"Game Over",text:`Your Score: ${score}.\n Highest Score: ${high}.`,button:"Play Again"})
        .then((result)=> location.reload());
    }
    draw();
    update();
}
init();
var f=setInterval(gameloop,100);