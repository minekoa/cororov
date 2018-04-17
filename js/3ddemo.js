
var createDemoScene = function(parent_dom) {

    var scene = new THREE.Scene();

    /* カメラ */
    var camera = new THREE.PerspectiveCamera( 75, $(parent_dom).width() / $(parent_dom).height(), 0.1, 1000 );
//    var camera = new THREE.OrthographicCamera ( -240, 240, 180, -180  );

    camera.position.set(10, 0, 20);

    /* レンダラー */
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( $(parent_dom).width(), $(parent_dom).height() );
    renderer.setClearColor(0xffffff, 1.0);

    $(parent_dom).append(renderer.domElement );

    /* 光源設定 */
    // ライト
    var directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(0, 100, 0);
    scene.add(directionalLight);
    // 環境光
    var ambient = new THREE.AmbientLight("#999999"); /**/
    scene.add(ambient);

    /* 座標線を引く*/
    var axis = new THREE.AxisHelper(1000);
    axis.position.set(0,0,0);
    scene.add(axis);

    var axis2 = new THREE.AxisHelper(1000);
    axis2.position.set(0,-7,0);
    scene.add(axis2);

    /* グリッドを書く　*/
    var grid = new THREE.GridHelper(50, 10); // size, step
    grid.position.y = -7;
    scene.add(grid);

    /* 遠近感を出したいのでフォグをかける  */
    scene.fog = new THREE.FogExp2( 0xffffff, 0.015 ); 

    /* 地面を表示する */
    var geometryG   = new THREE.PlaneGeometry( 300, 300, 64, 64 );
    var txtr_loader = new THREE.TextureLoader();
    var materialG   = new THREE.MeshLambertMaterial({color:"#0096d6",side:THREE.DoubleSide});
    ground = new THREE.Mesh(geometryG, materialG);
    ground.rotation.x = Math.PI / -2;
    ground.position.y = -7;
    scene.add( ground );


    /* CORO*/
    var coroGeometry = new THREE.CylinderGeometry(1,1,5,50);
    var coroMaterial = new THREE.MeshPhongMaterial( { color: 'white' } );
    var coro = new THREE.Mesh( coroGeometry, coroMaterial );
    scene.add( coro );
    coro.castShadow = true;
    coro.position.y = -2.5

    /* ポジション1*/
    var geometryA1 = new THREE.CylinderGeometry(1,1,0.2,5);
    var materialA1 = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var arrow1     = new THREE.Mesh( geometryA1, materialA1);
    arrow1.castShadow = true;
    scene.add( arrow1 );

    /* ポジション2*/
    var geometryA2 = new THREE.CylinderGeometry(1,1,0.2,5);
    var materialA2 = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
    var arrow2     = new THREE.Mesh( geometryA2, materialA2);
    arrow2.castShadow = true;
    scene.add( arrow2 );


    /* 影をつける */
    renderer.shadowMap.enabled = true;
    ground.receiveShadow = true;
    directionalLight.castShadow = true;

    /* 視点をマウスでグリグリする */
    if (controls) controls.dispose();
    var controls = new THREE.OrbitControls(camera);
    controls.update();

    function animate() {
        requestAnimationFrame(animate);

        arrow1.rotation.x += 1 * Math.PI / 180;
	    arrow1.rotation.y += 1 * Math.PI / 180;
	    arrow1.rotation.z += 1 * Math.PI / 180;
	    arrow1.position.x = Math.sin(new Date().getTime() /2000) * 5;
	    arrow1.position.z = Math.cos(new Date().getTime() /2000) * 5;

        arrow2.rotation.x += 1 * Math.PI / 180;
	    arrow2.rotation.y += 1 * Math.PI / 180;
	    arrow2.rotation.z += 1 * Math.PI / 180;
	    arrow2.position.x = Math.sin(new Date().getTime() /1000) * 5;
	    arrow2.position.z = Math.cos(new Date().getTime() /1000) * 5;


        renderer.render(scene, camera);
    }
    animate();
};

