
//Outer Glow///////////////////////////////
function OutGlowMaterial( glowColor ) {
	
	this.glowColor = glowColor;
	
		return new THREE.ShaderMaterial({
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		fog: true,

		uniforms: THREE.UniformsUtils.merge([
		  THREE.UniformsLib["fog"], {
			"c": {
			  type: "f",
			  value: 0.4
			},
			"p": {
			  type: "f",
			  value: 2.5
			},
			glowColor: {
			  type: "c",
			  value: glowColor
			},
			viewVector: {
			  type: "v3",
			  value: {
				x: 0,
				y: 0,
				z: 400
			  }
			},
			fog: true
		  },
		]),

		fragmentShader: [
			'uniform vec3 glowColor;',
			'varying float intensity;',
			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			'void main()',
			'{',
			  'vec3 outgoingLight = vec3( 0.0 );',
			  'vec3 glow = glowColor * intensity;',                    
			  
			  'gl_FragColor = vec4(glow, intensity );',
			  THREE.ShaderChunk[ "fog_fragment" ],
			'}'
		  ].join('\n'),

		vertexShader: [
			'uniform vec3 viewVector;',
			'uniform float c;',
			'uniform float p;',
			'varying float intensity;',
			THREE.ShaderChunk[ "fog_pars_vertex" ],
			'void main()',
			'{',
			  'vec3 vNormal = normalize( normalMatrix * normal );',
			  'vec3 vNormel = normalize( normalMatrix * viewVector );',
			  'intensity = pow( c - dot(vNormal, vNormel), p );',
			  'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			  //THREE.ShaderChunk[ "fog_vertex" ],
			'}'
		  ].join("\n")
	  });
}

//Light enabled particles//////////////////////////////
function ParticleMaterial( texPath ) {

	this.texPath = texPath;
	var tex = new THREE.TextureLoader().load(texPath);
	tex.magFilter = THREE.NearestFilter;
	tex.minFilter = THREE.LinearMipMapLinearFilter;

	var pUniforms= THREE.UniformsUtils.merge([
		THREE.UniformsLib['common'],
		THREE.UniformsLib["fog"], {
		
		fog: true, 
		
		texture: { value: null } 		
		},
		]);

	pUniforms.texture.value = tex;
	
		return new THREE.ShaderMaterial({
			
			fog: true,
			uniforms : pUniforms,	
			
			vertexShader:[
				'attribute float size;',
				'varying vec4 pointCoord;',
				'attribute vec3 lightVec;',
				'varying vec3 lightPos;',
				THREE.ShaderChunk[ "fog_pars_vertex" ],
				'void main() {',

					'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
					'gl_PointSize = size * ( 300.0 / -mvPosition.z );',
					'gl_Position = projectionMatrix * mvPosition;',
					
					//vertexWorldPos = modelMatrix * vec4( position, 1.0 );,
					
					'pointCoord = vec4( position, 1.0 );',
					'lightPos = lightVec;',

				'}'
			].join("\n"),
			
			fragmentShader:[
				'uniform sampler2D texture;',
				'varying vec4 pointCoord;',
				'varying vec3 lightPos;',
				'varying vec4 vertexWorldPos;',
				THREE.ShaderChunk[ "common" ],
				THREE.ShaderChunk[ "fog_pars_fragment" ],
				'void main() {',
				
					'float dist = sqrt( ((pointCoord.x - lightPos.x)*(pointCoord.x - lightPos.x)) + ((pointCoord.z - lightPos.z)*(pointCoord.z - lightPos.z)) );',
					'dist = 140.0/(dist);',
					'vec4 light = vec4(dist*dist, dist, dist, 1.0);',
					'light = normalize(light);',
					'light = vec4( pow(light.x, 6.0), pow(light.x, 6.0), pow(light.x, 6.0), 1.0);',
					'gl_FragColor = vec4(light.rgb,1.0) * texture2D( texture, gl_PointCoord ).rgba;',
					THREE.ShaderChunk[ "fog_fragment" ],
					'if (gl_FragColor.a < 0.5)//transparency cutout, no blending',
					'{',
						'discard;',
					'}',
				'}'
			
			].join("\n"),
			//blending:       THREE.AdditiveBlending,
			depthTest:      true,
			transparent:    true
			
		});
}

//position enabled particles//////////////////////////////
function LightRayMaterial( texPath ) {

	this.texPath = texPath;
	var tex = new THREE.TextureLoader().load(texPath);
	//tex.magFilter = THREE.NearestFilter;
	//tex.minFilter = THREE.LinearMipMapLinearFilter;

	var pUniforms= THREE.UniformsUtils.merge([
		THREE.UniformsLib['common'],
		THREE.UniformsLib["fog"], {
		
		fog: true, 
		
		texture: { value: null } 		
		},
		]);

	pUniforms.texture.value = tex;
	
		return new THREE.ShaderMaterial({
			
			fog: true,
			uniforms : pUniforms,	
			
			vertexShader:[
				'attribute float size;',
				'varying vec4 pointCoord;',
				'attribute vec3 lightVec;',
				'varying vec3 lightPos;',
				THREE.ShaderChunk[ "fog_pars_vertex" ],
				'void main() {',

					'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
					'gl_PointSize = size * ( 500.0 / -mvPosition.z );',
					'gl_Position = projectionMatrix * mvPosition;',
					
					//vertexWorldPos = modelMatrix * vec4( position, 1.0 );,
					
					'pointCoord = vec4( position, 1.0 );',
					'lightPos = lightVec;',

				'}'
			].join("\n"),
			
			fragmentShader:[
				'uniform sampler2D texture;',
				'varying vec4 pointCoord;',
				'varying vec3 lightPos;',
				'varying vec4 vertexWorldPos;',
				THREE.ShaderChunk[ "common" ],
				THREE.ShaderChunk[ "fog_pars_fragment" ],
				'void main() {',
				
					'float dist = sqrt( ((pointCoord.x - lightPos.x)*(pointCoord.x - lightPos.x)) + ((pointCoord.z - lightPos.z)*(pointCoord.z - lightPos.z)) );',
					'dist = 140.0/(dist);',
					'vec4 light = vec4(dist*dist, dist, dist, 1.0);',
					'light = normalize(light);',
					'light = vec4( pow(light.x, 4.0), pow(light.x, 4.0), pow(light.x, 4.0), 1.0);',
					'gl_FragColor = vec4(light.rgb, pow(light.x, 1.1)) * texture2D( texture, gl_PointCoord ).rgba;',
					THREE.ShaderChunk[ "fog_fragment" ],
					'if (gl_FragColor.a < 0.01)//transparency cutout, no blending',
					'{',
						'discard;',
					'}',
				'}'
			
			].join("\n"),
			blending:       THREE.AdditiveBlending,
			depthTest:      false,
			transparent:    true
			
		});
}