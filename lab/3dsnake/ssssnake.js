var renderer = 0;

function initThree() {
    width = document.getElementById('canvas3d').clientWidth;//获取画布「canvas3d」的宽
    height = document.getElementById('canvas3d').clientHeight;//获取画布「canvas3d」的高
    renderer=new THREE.WebGLRenderer({antialias:true});//生成渲染器对象（属性：抗锯齿效果为设置有效）
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height );//指定渲染器的高宽（和画布框大小一致）
    document.getElementById('canvas3d').appendChild(renderer.domElement);//追加 【canvas】 元素到 【canvas3d】 元素中。
    renderer.setClearColor(0xFFFFFF, 1.0);//设置canvas背景色(clearColor)
    renderer.shadowMap.enabled = true;
    console.log("hahaha")
}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 60, width / height , 0.5 , 500 );//设置透视投影的相机,默认情况下相机的上方向为Y轴，右方向为X轴，沿着Z轴朝里（视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far）
    camera.position.set(0,0.8,0)
    camera.up.set(0,10,0)
    camera.lookAt( {x:0, y:0.8, z:10 } );//设置视野的中心坐标
}

var scene = 0;
function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xcce0ff, 50, 150 );
    renderer.setClearColor( scene.fog.color );
}

var light;
function initLight() {
    light = new THREE.DirectionalLight(0xAAAAAA, 1.75);//设置平行光源
    light.position.set(50,50,30 );//设置光源向量
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;  // default
    light.shadow.mapSize.height = 2048; // default
    //light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 1000      // default
    var d = 100;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    //var targetObject = new THREE.Object3D();
    //scene.add(targetObject);
    //light.target = targetObject;
    //light.target.position.set(100,0,0);
    scene.add( new THREE.AmbientLight( 0x888888 ) );
    scene.add(light)
}

function initObject(){
    var groundTexture = new THREE.TextureLoader().load("grasslight-big.jpg");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 40, 40 );
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshLambertMaterial( {
        color: 0x88DD88, 
        specular: 0x111111, 
        map: groundTexture ,
        side:THREE.DoubleSide
    });
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 400, 400 ), groundMaterial );
    mesh.receiveShadow = true;
    mesh.rotateX(-Math.PI/2);
    scene.add(mesh);

    mesh=new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5,20,20),
        new THREE.MeshLambertMaterial(
            {
                color:0xff0000,
            }
        )
    );
    mesh.position.z = 10;
    mesh.position.y = 0.45;
    mesh.castShadow = true;
    //scene.add(mesh);

    var zhuzi = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(0.2,0.2,5,14),
        new THREE.MeshLambertMaterial(
            {
                color:0x00dddd
            }
        )
    )
    zhuzi.position.set(0,0.2,5);
    zhuzi.castShadow = true;
    for(var i = 0;i<100;i++){
        var zhuzi1 = zhuzi.clone();
        zhuzi1.position.set(i-50,0.2,50);
        scene.add(zhuzi1);
        zhuzi1 = zhuzi.clone();
        zhuzi1.position.set(i-50,0.2,-50);
        scene.add(zhuzi1);
        zhuzi1 = zhuzi.clone();
        zhuzi1.position.set(50,0.2,i-50);
        scene.add(zhuzi1);
        zhuzi1 = zhuzi.clone();
        zhuzi1.position.set(-50,0.2,i-50);
        scene.add(zhuzi1);
    }
}


snake = [];
function initSnake(){
    var mesh=new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5,20,20),
        new THREE.MeshLambertMaterial(
            {
                color:0xff0000,
            }
        )
    );
    mesh.position.z = 10;
    mesh.position.y = 0.45;
    mesh.castShadow = true;
    for(var i =0;i<20;i++){
        var t = mesh.clone();
        //t.position.set(snakePosition[i].x,snakePosition[i].y,snakePosition[i].z);
        snake.push(t);
        scene.add(t);
    }
    snake[0].up.set(0,10,0)
    snake[0].lookAt( {x:0, y:0.45, z:10 } );//设置视野的中心坐标
    generateFood();
    
}

function generateFood(){
    food=new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5,20,20),
        new THREE.MeshLambertMaterial(
            {
                color:0xffff99
            }
        )
    );
    foodX = Math.random()*98-44;
    foodZ = Math.random()*98-44;
    food.position.set(foodX,0.2,foodZ);
    food.castShadow = true;
    scene.add(food);
}

function updateFood(){
    foodX = Math.random()*98-44;
    foodZ = Math.random()*98-44;
    food.position.set(foodX,0.2,foodZ);
}

function updateCanvas(){
    renderer.render(scene,camera);
    requestAnimationFrame(updateCanvas)
    //updateWorld();
}




xx = 0;
yy = 0.8;
zz = 0;
xuanzhuan = 0;
function updateWorld(){
    if(direction <0){
        xuanzhuan = xuanzhuan+0.04;
        if(xuanzhuan>0.4){
            xuanzhuan = 0.4;
        }
    }
    else if (direction>0){
        xuanzhuan = xuanzhuan-0.04;
        if(xuanzhuan<-0.4){
            xuanzhuan = -0.4;
        }
    }
    else{
        xuanzhuan = 0;
    }
    snake[0].rotateY(xuanzhuan);
        var t = snake[0].localToWorld(new THREE.Vector3(0,0,-0.8));
        xx=t.x;
        zz=t.z;
        xx=xx<-49?-49:xx;
        zz=zz<-49?-49:zz;
        xx=xx>49?49:xx;
        zz=zz>49?49:zz;
        for(var i =snake.length-1;i>0;i--){
            snake[i].position.set(snake[i-1].position.x,0.45,snake[i-1].position.z);
        }
        snake[0].position.set(xx,0.45,zz);
        t=snake[0].localToWorld(new THREE.Vector3(0,7,14));
        camera.position.set(t.x,t.y,t.z);
        camera.up.set(0,10,0);
        camera.lookAt({
            x:snake[0].position.x,y:snake[0].position.y,z:snake[0].position.z
        });
    var d = (snake[0].position.x-foodX)*(snake[0].position.x-foodX)+(snake[0].position.z-foodZ)*(snake[0].position.z-foodZ);
    if(d<1){
        var mesh=new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5,20,20),
        new THREE.MeshLambertMaterial(
            {
                color:0xffff00,
            }
        )
        )
        var l = snake.length-1;
        mesh.position.x = snake[l].position.x;
        mesh.position.y = snake[l].position.y;
        mesh.position.z = snake[l].position.z;
        mesh.castShadow = true;
        snake.push(mesh);
        scene.add(mesh);
        updateFood();
    }
    setTimeout(updateWorld,50);
}


function threeStart() {
    console.log("hahaha")
    initThree();
    initCamera();
    initScene();
    initSnake();
    initLight();
    initObject();
    renderer.clear();
    updateCanvas();
    updateWorld();
}

function animation(){
}

direction = 0;
speed = 0;


document.onkeydown=function(e){
    if(e.keyCode==37){
        direction=-1;
    }
    else if(e.keyCode==39){
        direction = 1;
    }
}
document.onkeyup=function(e){
    if(e.keyCode==37){
        if(direction<0){
            direction = 0
        }
    }
    else if(e.keyCode==39){
        if(direction>0){
            direction = 0
        }
    }
}