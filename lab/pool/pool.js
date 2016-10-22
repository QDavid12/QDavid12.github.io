var pool = (function(){
    var container = document.getElementsByClassName("pool-container")[0];
    var r = 15;
    var a = 1.8;
    var balls = [];
    var movingBalls = [];
    var rate = 100;
    var xmin = 51;
    var xmax = 802;
    var ymin = 60;
    var ymax = 421;
    var ymiddle = (ymax + ymin)/2 - 5;
    var moving = 0;
    var white,target,timer;
    // Init Target and Line
    var t = document.createElement("div");
    t.className = "target-circle";
    container.appendChild(t);
    target = t;
    var line = [];
    for(var i=0;i<10;i++){
        var d = document.createElement("div");
        d.style.position = "absolute";
        d.style.background = "white";
        d.style.width = "1px";
        d.style.height = "1px";
        d.style.display = "none";
        container.appendChild(d);
        line.push(d);
    }
    //console.log("hi");
    function Ball(e){
        var e = e || {};
        this.type = e.type || "red";
        //this.v = 10 * Math.random();
        this.v = 0;
        this.x = e.x || xmin + Math.random()*(xmax-xmin);
        this.y = e.y || ymin + Math.random()*(ymax-ymin);
        this.o = Math.random() * 2 * Math.PI;
        this.r = r;
        this.status = 0;
        var b = document.createElement("div");
        b.className = "ball " + this.type;
        b.style.width = 2 * this.r + "px";
        b.style.height = 2 * this.r + "px";
        b.style.left = this.x + "px";
        b.style.top = this.y + "px";
        this.ball = b;
        container.appendChild(b);
        balls.push(this);
        if (this.v>0) {
            movingBalls.push(this);
        }
    }
    function setPos(ele){
        ele.ball.style.left = ele.x + "px";
        ele.ball.style.top = ele.y + "px";
    }
    // Rock and Roll
    var move = function(){
        if(movingBalls.length==0){
            clearInterval(timer);
            wait();
            return moving = 1;
        }
        function removeBall(ele, i){
            ele.ball.style.display = "none";
            ele.x = -12;
            ele.y = -12;
            setPos(ele);
            ele.status = 1;
            movingBalls.splice(i, 1);
        }
        //console.log("move " + movingBalls.length);
        var xmiddle = (xmin + xmax) / 2;
        for (var i = 0 ; i < movingBalls.length ; i++) {
            var ball = movingBalls[i];
            // collide
            // left and right
            if(ball.x <= xmin || ball.x >= xmax){
                // in hole
                if(ball.y<=ymin + 10 || ball.y>=ymax-10){
                    removeBall(ball, i);
                    continue;
                }
                if(movingBalls[i].v <= 0){
                    movingBalls.splice(i, 1);
                }
                ball.x = ball.x<=xmin ? xmin : xmax;
                movingBalls[i].o = - movingBalls[i].o + Math.PI;
            }
            // top and bottom
            if(ball.y <= ymin || ball.y >= ymax){
                // in hole
                if(ball.x<=xmin + 10 || ball.x>=xmax-10 || (ball.x>=xmiddle-12&&ball.x<=xmiddle+12)){
                    removeBall(ball, i);
                    continue;
                }
                ball.y = ball.y<=ymin ? ymin : ymax;
                movingBalls[i].o = - movingBalls[i].o;
            }
            // two ball collision
            for(var j=0;j<balls.length;j++){
                var obj = balls[j];
                if(obj == ball){
                    continue;
                }
                var diffx = obj.x - ball.x;
                var diffy = obj.y - ball.y;
                var gap = obj.r + ball.r;
                if(diffx <= gap && diffy <= gap){
                    var dis = Math.sqrt(diffx*diffx + diffy*diffy);
                    if(dis <= gap){
                        // hit
                        console.log("hit");
                        // add ball
                        if(Math.round(obj.v) == 0){
                            movingBalls.push(obj);
                        }
                         
                        //还原两球相切状态 - 近似值
                        var sin = diffy / dis;
                        var cos = diffx / dis;
                        ball.y = ball.y - (gap - dis)*sin;
                        ball.x = ball.x - (gap - dis)*cos;
                        var disX = obj.x - ball.x;
                        var disY = obj.y - ball.y;

                        // 计算角度和正余弦值
                        var angle = Math.atan2(disY, disX),
                            hitsin = Math.sin(angle),
                            hitcos = Math.cos(angle),
                            objVx = obj.v * Math.cos(obj.o),
                            objVy = obj.v * Math.sin(obj.o);
                            //trace(angle*180/Math.PI);
                             
                        // 旋转坐标
                        var vx = ball.v * Math.cos(ball.o);
                        var vy = ball.v * Math.sin(ball.o);
                        var x1 = 0,
                            y1 = 0,
                            x2 = disX * hitcos + disY * hitsin,
                            y2 = disY * hitcos - disX * hitsin,
                            vx1 = vx * hitcos + vy * hitsin,
                            vy1 = vy * hitcos - vx * hitsin,
                            vx2 = objVx * hitcos + objVy * hitsin,
                            vy2 = objVy * hitcos - objVx * hitsin;
                         
                        // 碰撞后的速度和位置
                        var plusVx = vx1 - vx2;
                        vx1 = vx2;
                        vx2 = plusVx + vx1;
                         
                        //母球加塞
                        if(ball.type == "cue")  {
                            vx1 += rollUp;
                            rollUp *= 0.2;
                        }               
                         
                        x1 += vx1;
                        x2 += vx2;
                         
                        // 将位置旋转回来
                        var x1Final = x1 * hitcos - y1 * hitsin,
                            y1Final = y1 * hitcos + x1 * hitsin,
                            x2Final = x2 * hitcos - y2 * hitsin,
                            y2Final = y2 * hitcos + x2 * hitsin;
                        obj.x = ball.x + x2Final;
                        obj.y = ball.y + y2Final;
                        ball.x = ball.x + x1Final;
                        ball.y = ball.y + y1Final;
                         
                        // 将速度旋转回来
                        vy = vx1 * hitcos - vy1 * hitsin;
                        vx = vy1 * hitcos + vx1 * hitsin;
                        objVy = vx2 * hitcos - vy2 * hitsin;
                        objVx = vy2 * hitcos + vx2 * hitsin;
                         
                        //最终速度
                        ball.v = Math.sqrt(vx*vx + vy*vy) * (1 - 0);
                        obj.v = Math.sqrt(objVx*objVx + objVy*objVy) * (1 - 0);
                         
                        // 计算角度
                        ball.o = Math.atan2(vx , vy);
                        obj.o = Math.atan2(objVx , objVy);

                    }
                }
            }
            // move move
            ball.x += ball.v * Math.cos(ball.o);
            ball.y += ball.v * Math.sin(ball.o);
            ball.v -= a / rate;
            setPos(movingBalls[i]);
            // remove not moving ones
            if(movingBalls[i].v <= 0){
                movingBalls.splice(i, 1);
                continue;
            }
        }
    }
    // Draw Shoot Line
    function drawLine(e){
        var event = e || event;
        console.log("move")
        target.x = event.pageX - container.offsetLeft;
        target.y = event.pageY - container.offsetTop;
        target.style.left = target.x + "px";
        target.style.top = target.y + "px";
        var x = (target.x - white.x) / 10;
        var y = (target.y - white.y) / 10;
        for(var i=0;i<10;i++){
            line[i].style.left = white.x + i*x + "px";
            line[i].style.top = white.y + i*y + "px";
        }
    }
    function wait(){
        if(white.status == 1){
            console.log("white in hole");
            return setWhitePos();
        }
        target.style.display = "block";
        for(var i=0;i<10;i++){
            line[i].style.display = "block";
        }
        addEventHandler(container, "mousemove", drawLine);
        addEventHandler(container, "mouseup", shoot);
    }
    function setWhitePos(){
        white.ball.style.display = "block";
        white.x = 100;
        white.y = ymiddle;
        white.status = 0;
        addEventHandler(container, "mousemove", moveWhite);
        addEventHandler(container, "mouseup", setWhite);
    }
    function moveWhite(e){
        white.x = e.pageX - container.offsetLeft;
        white.y = e.pageY - container.offsetTop;
        setPos(white);
    }
    function setWhite(e){
        white.x = e.pageX - container.offsetLeft;
        white.y = e.pageY - container.offsetTop;
        setPos(white);
        removeEventHandler(container, "mousemove", moveWhite);
        removeEventHandler(container, "mouseup", setWhite);
        wait();
    }
    // Out!
    function shoot(e){
        removeEventHandler(container, "mousemove", drawLine);
        removeEventHandler(container, "mouseup", shoot);
        target.style.display = "none";
        for(var i=0;i<10;i++){
            line[i].style.display = "none";
        }
        var e = e || event;
        white.v = 10;
        white.o = Math.atan2(target.y-white.y, target.x-white.x);
        console.log("target x:" + target.x + " y:" + target.y);
        console.log("white x:" + white.x + " y:" + white.y + " o:" + white.o);
        movingBalls.push(white);
        timer = window.setInterval(move, 1000/rate);
    }
    // Initial
    function init(){
        var x = 580;
        var y = ymiddle;
        white = new Ball({
            x: 200,
            y: y,
            type: "white"
        })
        for(var i=1;i<=5;i++){
            for(var j=0;j<i;j++){
                new Ball({
                    x: x,
                    y: y
                });
                y += 2*r;
            }
            x += 1.73*r;
            y -= (2*i+1)*r;
        }
    }
    // Start
    var start = function(){
        console.log("start");
        wait();
        //timer = window.setInterval(move, 1000/rate);
    }
    // Api
    return {
        newBall: Ball,
        start: start,
        init: init
    }
})();
pool.init();
pool.start();

function addEventHandler(obj,eType,fuc){
    if(obj.addEventListener){ 
        obj.addEventListener(eType,fuc,false);
    }else if(obj.attachEvent){ 
        obj.attachEvent("on" + eType,fuc);
    }else{ 
        obj["on" + eType] = fuc; 
    } 
} 

function removeEventHandler(obj,eType,fuc){
    if(obj.removeEventListener){ 
        obj.removeEventListener(eType,fuc,false); 
    }else if(obj.attachEvent){ 
        obj.detachEvent("on" + eType,fuc); 
    } 
}

