function TreeLoader(idTrunk,idBark,idLeaves,x,z)
{
    this.idTrunk = idTrunk;
    this.idLeaves = idLeaves;
    this.idBark = idTrunk;
    this.x = x;
    this.z = z;
    var filePathTrunk = 'models/';
    var filePathBark = 'textures/';
    var filePathLeaves = 'textures/';
    var tree = new THREE.Object3D();
    
    switch(idTrunk)
    {
       case 1:
       {
           filePathTrunk += 'commonTrunk.js'
       }
            
    }
    switch(idBark)
    {
        case 1:
        {
            filePathBark += 'treeBark1.png'
        }
    }
    
    switch(idLeaves)
    {
        case 1:
        {
            filePathLeaves += 'leafParticles3.png'
        }
    }
     
    new THREE.ObjectLoader().load( filePathTrunk, function ( object ) {
        object.traverse( function ( o ) {
        if ( o.type == "Mesh" && o.material && ! o.material.transparent ) {
        o.material.side = THREE.DoubleSide;
        }
		
        var barkTex = new THREE.TextureLoader().load( filePathBark );
        barkTex.magFilter = THREE.NearestFilter;
        barkTex.minFilter = THREE.LinearMipMapLinearFilter;
		
        var material = new THREE.MeshLambertMaterial({map: barkTex});
        var meshe = new THREE.Mesh(o.geometry, material);
		
        meshe.scale.x = meshe.scale.y = meshe.scale.z = 16;
        meshe.position.y -= 50;
        meshe.position.x += x;
        meshe.position.z += z;
        
		tree.add(meshe.clone());
		
        } );
    } );
    
    var treeShadow = aluS.clone();
    tree.add(treeShadow);
    treeShadow.position.x = x;
    treeShadow.position.z = z;
    treeShadow.scale.x = treeShadow.scale.y = 5;
    
    var leafGeo = new THREE.PlaneBufferGeometry( 20, 20 );
    var leafTex = new THREE.TextureLoader().load( filePathLeaves );
    leafTex.magFilter = THREE.NearestFilter;
    leafTex.minFilter = THREE.LinearMipMapLinearFilter;
    var leafMat = new THREE.MeshBasicMaterial( { map: leafTex, transparent: true, opacity: 1, depthWrite: false } );
    var leafMes = new THREE.Mesh( leafGeo, leafMat );

    for(var i = 0; i < 100; i++)
    {
        leafMes.position.x = x-45 + Math.random()* 80;
        leafMes.position.z = z-25 + Math.random()* 70;
        leafMes.position.y = 30 + Math.random()* 50;
        leafMes.scale.x = leafMes.scale.z = 
        leafMes.scale.y = 0.2 + Math.random() * 0.8;
        leaves[i] = leafMes.clone();
        tree.add(leaves[i]);
    }
  return tree;  
}