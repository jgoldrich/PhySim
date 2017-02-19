// Physics Simulation - Main File | JHacks 2017, Team UIUC

/* =================================SETUP AND INITIALIZATION CODE================================= */

var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

// sphere base geom
var sphereVertexPositionBuffer; // Create a place to store sphere geometry
var sphereVertexNormalBuffer; // Create a place to store normals for shading

// plane base geom
var tVertexPositionBuffer; // Create a place to store terrain geometry
var tVertexNormalBuffer; // Create a place to store normals for shading
var tIndexTriBuffer; // Create a place to store the terrain triangles
var tIndexEdgeBuffer; // Create a place to store the traingle edges - squares!

// View parameters
var eyePt = vec3.fromValues(0.0,0.0,70.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);

var lightPosEye; // variable for the 3-vec for the light position - global to pass around, created from the transformed 4-vec

var nMatrix = mat3.create(); // Create the normal matrix
var mvMatrix = mat4.create(); // Create ModelView matrix
var pMatrix = mat4.create(); //Create Projection matrix
var mvMatrixStack = []; // setup matrix stack for transformations

// Preliminary array of spheres to just hold them - eventually move to a (KD?) tree for collision checking efficiently, etc.
spheres = [];


/* =================================BUFFERS AND DRAW SETUP================================= */

// sphere buffer
function setupSphereBuffers() {
    
    var sphereSoup=[];
    var sphereNormals=[];
    var numT=sphereFromSubdivision(6,sphereSoup,sphereNormals);
    sphereVertexPositionBuffer = gl.createBuffer(); // initialize buffer to hold the vertices of the sphere
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer); // set the sphere vertices as a buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW); // load the sphere vertices buffer with the data
    sphereVertexPositionBuffer.itemSize = 3; // 3 vertices per triangle
    sphereVertexPositionBuffer.numItems = numT*3; // number of vertices
    
    // Specify normals to be able to do lighting calculations
    sphereVertexNormalBuffer = gl.createBuffer(); // initialize vertex normal buffer - for shading
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer); // set as a buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW); // load up the buffer
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = numT*3;
    
}

// plane buffer
function setupTerrainBuffers() {
    
    var vTerrain=[]; // vertices
    var fTerrain=[]; // faces
    var nTerrain=[]; // normals
    var eTerrain=[]; // edges
    
    var n = 7; // change size of the plane
    var dim = Math.pow(2, n) + 1; // terrain is even 2^n + 1 by 2^n + 1 grid
    
    var numT = terrainFromIteration(n, dim, -1,1,-1,1, vTerrain, fTerrain, nTerrain); // TODO: change this function to change the fTerrain coords
    tVertexPositionBuffer = gl.createBuffer(); // initialize vertex position buffer for the plane
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer); // set the sphere vertices as a buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTerrain), gl.STATIC_DRAW); // load up the buffer
    tVertexPositionBuffer.itemSize = 3;
    tVertexPositionBuffer.numItems = dim*dim; // number of triangles
    
    // Specify normals to be able to do lighting calculations
    tVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nTerrain), gl.STATIC_DRAW);
    tVertexNormalBuffer.itemSize = 3;
    tVertexNormalBuffer.numItems = dim*dim;
    
    // Specify faces of the terrain 
    tIndexTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fTerrain), gl.STATIC_DRAW);
    tIndexTriBuffer.itemSize = 1;
    tIndexTriBuffer.numItems = numT*3; // TODO: this will change when render as square edges instead of triangles
     
}

// draw a sphere
function drawSphere() {
    
    // bind vertex pos buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer); // set the vertex position buffer as a buffer - need? already bound in setup
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); // setup the aVertexPosition attribute in the shader to point to the buffer containing the vertex position data

    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, sphereVertexPositionBuffer.numItems);      
}

// draw the plane
function drawTerrain(){
    gl.polygonOffset(0,0)
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, tVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);   
    
    // bind face indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
 
    // draw with the indexed face mesh and vertices
    gl.drawElements(gl.TRIANGLES, tIndexTriBuffer.numItems, gl.UNSIGNED_SHORT,0);      
    
    // TODO: add draw for the faces/edges of the plane
    
}

/* =================================UPLOAD MATS TO SHADER================================= */

// ModelView
function uploadModelViewMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

// Projection
function uploadProjectionMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

// Normal
function uploadNormalMatrixToShader() {
    mat3.fromMat4(nMatrix,mvMatrix);
    mat3.transpose(nMatrix,nMatrix);
    mat3.invert(nMatrix,nMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

// call all the upload functions
function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}

// Lights
function uploadLightsToShader(loc,a,d,s) {
    gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
    gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
    gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
    gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s);
}

// Material properties
function uploadMaterialToShader(a,d,s) {
    gl.uniform3fv(shaderProgram.uniformAmbientMatColorLoc, a);
    gl.uniform3fv(shaderProgram.uniformDiffuseMatColorLoc, d);
    gl.uniform3fv(shaderProgram.uniformSpecularMatColorLoc, s);
}

/* =================================UTILITY FUNCTIONS================================= */

// push matrix onto transformation stack
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}

// pop matrix off of the transformation stack
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


// deg/rad conversion
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/* =================================INITIALIZATION================================= */


// make a webgl context to display
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

// load the shaders from the GLSL code
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

// setup the vertex and fragment shaders
function setupShaders() {
    vertexShader = loadShaderFromDOM("shader-vs");
    fragmentShader = loadShaderFromDOM("shader-fs");
  
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
    }

    gl.useProgram(shaderProgram);

    // bind all the attributes and uniforms to the shader program
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    shaderProgram.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");    
    shaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");  
    shaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
    shaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");

    shaderProgram.uniformAmbientMatColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientMatColor");  
    shaderProgram.uniformDiffuseMatColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseMatColor");
    shaderProgram.uniformSpecularMatColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularMatColor");    
    
}

// load up the vertices and face indicies for the geometry
function setupBuffers() {
    setupSphereBuffers();    
    setupTerrainBuffers();
}

// function called from the body onload
function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    setupShaders();
    setupBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // background color
    gl.enable(gl.DEPTH_TEST);

    tick(); // kick off the rendering and animation loop
}

// run on every frame refresh
function tick() {
    requestAnimFrame(tick); // update stuff
    
    draw();
    animate();
}

/* =================================RENDERING================================= */

// main draw loop
function draw() { 
  
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective projection
    mat4.perspective(pMatrix,degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

    // We want to look down -z, so create a lookat point in that direction    
    vec3.add(viewPt, eyePt, viewDir);
    
    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix,eyePt,viewPt,up); 
    
    // light position
    var lightPosEye4 = vec4.fromValues(0.0, 0.0, 100.0, 1.0);
    lightPosEye4 = vec4.transformMat4(lightPosEye4,lightPosEye4,mvMatrix);
    lightPosEye = vec3.fromValues(lightPosEye4[0],lightPosEye4[1],lightPosEye4[2]);
    
//    setupTerrainDraw();
    setupSpheresDraw();
  
}

function setupTerrainDraw() {
    var transformVec = vec3.create(); // vector to move objects around
    var scaleVec = vec3.create(); // scaling vector
    
    // Set up light parameters
    var Ia = vec3.fromValues(1.0,1.0,1.0); // ambient
    var Id = vec3.fromValues(1.0,1.0,1.0); // diffuse
    var Is = vec3.fromValues(1.0,1.0,1.0); // specular

    // Set up material parameters    
    var ka = vec3.fromValues(0.0,0.0,1.0); // ambient
    var kd = vec3.fromValues(0.0,1.0,1.0); // diffuse
    var ks = vec3.fromValues(1.0,0.0,0.0); // specular

    mvPushMatrix(); // for matrix transformation
//    vec3.set(transformVec, 0, 0, 0) // use this to set the position
//    mat4.translate(mvMatrix, mvMatrix, transformVec);

    scaleFactor = 10.0
    vec3.set(scaleVec, scaleFactor, scaleFactor, scaleFactor); // use this to set the scale
    mat4.scale(mvMatrix, mvMatrix, scaleVec);
    
//    mat4.rotateX(mvMatrix, mvMatrix, degToRad(-55))
//    mat4.rotateY(mvMatrix, mvMatrix, degToRad(0))
//    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(35))

    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawTerrain();
    mvPopMatrix();
}

function setupSpheresDraw() {
    var transformVec = vec3.create(); // vector to move objects around
    var scaleVec = vec3.create(); // scaling vector
    
    // TODO: make for loop to render all the spheres each refresh frame
    
    // Set up light parameters
    var Ia = vec3.fromValues(1.0,1.0,1.0); // ambient
    var Id = vec3.fromValues(1.0,1.0,1.0); // diffuse
    var Is = vec3.fromValues(1.0,1.0,1.0); // specular

    // Set up material parameters    
    var ka = vec3.fromValues(0.0,0.0,0.0); // ambient
    var kd = vec3.fromValues(0.6,0.6,0.0); // diffuse
    var ks = vec3.fromValues(1.0,1.0,1.0); // specular

    mvPushMatrix(); // for matrix transformation
    vec3.set(transformVec, 0, 0, 0) // use this to set the position
    mat4.translate(mvMatrix, mvMatrix, transformVec);

    scaleFactor = 10.0
    vec3.set(scaleVec, scaleFactor, scaleFactor, scaleFactor); // use this to set the scale
    mat4.scale(mvMatrix, mvMatrix, scaleVec);
    
//    mat4.rotateX(mvMatrix, mvMatrix, degToRad(-55))
//    mat4.rotateY(mvMatrix, mvMatrix, degToRad(0))
//    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(35))

    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawSphere();
    mvPopMatrix();
}

// update positions of the spheres here?
function animate() {

}
