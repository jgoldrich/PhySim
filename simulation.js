// Physics Simulation - Main File | JHacks 2017, Team UIUC

/* =================================SETUP AND INITIALIZATION CODE================================= */

var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

// sphere base geom
var sphereVertexPositionBuffer; // Create a place to store sphere geometry
var sphereVertexNormalBuffer; // Create a place to store normals for shading

///////// try with obj
var vSphere = [];
var nSphere = [];
var fSphere = [];

var sphereIndexTriBuffer;
////////

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
var spheres = [[]]; // array OF sphere arrays - for each time step. dimension is txnx4

var raw_sphere_data = [];


/* =================================BUFFERS AND DRAW SETUP================================= */

// sphere buffer
function setupSphereBuffers() {
    
//    var sphereSoup=[];
//    var sphereNormals=[];
//    var numT=sphereFromSubdivision(6,sphereSoup,sphereNormals);
//    console.log(numT);
//    sphereVertexPositionBuffer = gl.createBuffer(); // initialize buffer to hold the vertices of the sphere
//    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer); // set the sphere vertices as a buffer
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereSoup), gl.STATIC_DRAW); // load the sphere vertices buffer with the data
//    sphereVertexPositionBuffer.itemSize = 3; // 3 vertices per triangle
//    sphereVertexPositionBuffer.numItems = numT*3; // number of vertices
//    
//    // Specify normals to be able to do lighting calculations
//    sphereVertexNormalBuffer = gl.createBuffer(); // initialize vertex normal buffer - for shading
//    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer); // set as a buffer
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW); // load up the buffer
//    sphereVertexNormalBuffer.itemSize = 3;
//    sphereVertexNormalBuffer.numItems = numT*3;
    
    // specify veritces
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);   
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vSphere), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = vSphere.length/3;
    
    // Specify normals to be able to do lighting calculations - uncomment after calculating normals
    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nSphere), gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = nSphere.length/3; // ?
    
    // Specify faces of the teapot 
    sphereIndexTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fSphere), gl.STATIC_DRAW);
    sphereIndexTriBuffer.itemSize = 1;
    sphereIndexTriBuffer.numItems = fSphere.length; // ?
    
}

// plane buffer
function setupTerrainBuffers() {
    
    var vTerrain=[]; // vertices
    var fTerrain=[]; // faces
    var nTerrain=[]; // normals
    var eTerrain=[]; // edges
    
    var n = 5; // change size of the plane
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
    
    //Setup Edges
     generateLinesFromIndexedTriangles(fTerrain,eTerrain);  
     tIndexEdgeBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexEdgeBuffer);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(eTerrain), gl.STATIC_DRAW);
     tIndexEdgeBuffer.itemSize = 1;
     tIndexEdgeBuffer.numItems = eTerrain.length;
     
}

// draw a sphere
function drawSphere() {
    
//    // bind vertex pos buffer
//    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer); // set the vertex position buffer as a buffer - need? already bound in setup
//    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); // setup the aVertexPosition attribute in the shader to point to the buffer containing the vertex position data
//
//    // Bind normal buffer
//    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
//    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
//    
//    gl.drawArrays(gl.TRIANGLES, 0, sphereVertexPositionBuffer.numItems);   
    
    gl.polygonOffset(0,0);
    
 // bind vertex buffer
 gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

 // Bind normal buffer - uncomment soon
 gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);   
    
 // Draw 
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexTriBuffer);
 gl.drawElements(gl.TRIANGLES, sphereIndexTriBuffer.numItems, gl.UNSIGNED_SHORT,0);   // issue with unsigned short? // check the buffer
    
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
    
}

// draw square edges of the grid
function drawTerrainEdges(){
 gl.polygonOffset(1,1);
 gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

 // Bind normal buffer
 gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
 gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, tVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);   
    
 //Draw 
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexEdgeBuffer);
 gl.drawElements(gl.LINES, tIndexEdgeBuffer.numItems, gl.UNSIGNED_SHORT,0);      
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


function loadData() {
    
    // load spheres at all time steps from csv
    $.ajax({
        type : "GET",
        url : "MOCK_DATA2.csv", // data
        dataType : "text"
    }).done(processData)//.done(processObj).done(startup());
    
    // load sphere geom from obj
    $.get("sphere.obj", function(data) {
            processObj(data);
    }).done(function(){startup()});
    
}

function processData(data) {
    
    // start with big bang
//    var bigBang = new Sphere(1, vec3.fromValues(0,0,5));
//    bigBang.color = vec3.fromValues(1,1,0); // set its color
//    spheres.push(bigBang);
//    console.log(data);
    
    var allRows = data.split(/\r?\n|\r/); // regex from stack overflow
//    console.log(allRows);
    
    var currTimeStep = 0;
      
    var currStepColor = vec3.fromValues(Math.random, Math.random, Math.random());
    
    // parse all the rows
    for (var i = 0; i < allRows.length; i++) {
        
        var currState = allRows[i].split(",");
        var thisRad = parseFloat(currState[1]);
        var thisPos = vec3.fromValues(parseFloat(currState[2]), parseFloat(currState[3]), parseFloat(currState[4]));
        var thisSphere = new Sphere(thisRad, thisPos);
        
        var thisStep = currState[0];
        
        if (thisStep == currTimeStep) {
            
            spheres[currTimeStep].push(thisSphere);
            

        } else {
            
            currTimeStep++;
            spheres.push([])
            spheres[currTimeStep].push(thisSphere);
            currStepColor = vec3.fromValues(Math.random, Math.random, Math.random());
        }
        
        // reset color
        var currIndexInStep = spheres[currTimeStep].length-1;
        spheres[currTimeStep][currIndexInStep].color = currStepColor;
        
    }
    
    return;
//    console.log('processed data');
    
//    console.log(spheres);
//    startup();

}

function processObj(data) {

    var lines = data.split("\n");
    
    for (var i = 0; i < lines.length; i++) {
        var currLine = lines[i];
        var currLineSplit = currLine.split(" ");
        
        var type = currLineSplit[0];
        
        if (type == "v") {
            vSphere.push(currLineSplit[2]);
            vSphere.push(currLineSplit[3]);
            vSphere.push(currLineSplit[4]);
            
            // calculate normals as just the normalized coordinate
            var normal = vec3.fromValues(currLineSplit[2], currLineSplit[3], currLineSplit[4]);
            vec3.normalize(normal, normal);
            
            nSphere.push(normal[0]);
            nSphere.push(normal[1]);
            nSphere.push(normal[2]);
            
        } else if (type == "f") {
            // remember to subtract by 1 to account for being 1-indexed instead of 0 for the verts
            var face1s = currLineSplit[1].split("/");
            fSphere.push(face1s[0]-1);
            
            var face2s = currLineSplit[3].split("/");
            fSphere.push(face2s[0]-1);
            
            var face3s = currLineSplit[5].split("/");
            fSphere.push(face3s[0]-1);
            
        }
    }
    
//    // start with big bang
//    var bigBang = new Sphere(1, vec3.fromValues(0,0,5));
//    bigBang.color = vec3.fromValues(1,1,0); // set its color
//    spheres.push(bigBang);
    
}

// function called from the body onload
function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    setupShaders();
    setupBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // background color
    gl.enable(gl.DEPTH_TEST);
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    // parse csv here
    // jquery to force it to wait til done?
    
    tick(); // kick off the rendering and animation loop
}

// run on every frame refresh
function tick() {
    requestAnimFrame(tick); // update stuff
    handleKeys();
    draw();
    
    animate();
}

/* =================================EVENT HANDLING================================= */

// from simple user interaction class example
var currentlyPressedKeys = {};

function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
}

var Zangle = 0.0;
var Yangle = 0.0;
var Xangle = 0.0;
depth = 70.0;
function handleKeys() {
    inc = 0.50
    if (currentlyPressedKeys[65]) {
        // A
        Zangle += inc;
    } else if (currentlyPressedKeys[68]) {
        // D
        Zangle -= inc;
    }
    
    if (currentlyPressedKeys[87]) {
        // W
        Xangle -= inc;
    } else if (currentlyPressedKeys[83]) {
        // S
        Xangle += inc;
    }
    
    if (currentlyPressedKeys[81]) {
        Yangle += inc;
    } else if (currentlyPressedKeys[69]) {
        Yangle -= inc;
    }
    
    if (currentlyPressedKeys[88]) {
        // X
        depth -= inc;
    } else if (currentlyPressedKeys[90]) {
        // Z
        depth += inc;
    }
    
}

/* =================================RENDERING================================= */

// main draw loop
function draw() { 
  
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective projection
    mat4.perspective(pMatrix,degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

    var eyePt = vec3.fromValues(0.0,0.0,depth);
    
    // We want to look down -z, so create a lookat point in that direction    
    vec3.add(viewPt, eyePt, viewDir);
    
    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix,eyePt,viewPt,up); 
    
    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(Zangle))
    mat4.rotateY(mvMatrix, mvMatrix, degToRad(Yangle))
    mat4.rotateX(mvMatrix, mvMatrix, degToRad(Xangle))
    
    // light position
    var lightPosEye4 = vec4.fromValues(0.0, 0.0, 100.0, 1.0);
    lightPosEye4 = vec4.transformMat4(lightPosEye4,lightPosEye4,mvMatrix);
    lightPosEye = vec3.fromValues(lightPosEye4[0],lightPosEye4[1],lightPosEye4[2]);
    
    setupTerrainDraw();
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
    var ka = vec3.fromValues(0.0,0.0,0.0); // ambient - black background
    var kd = vec3.fromValues(0.0,0.0,0.0); // diffuse
    var ks = vec3.fromValues(0.0,0.0,0.0); // specular

    mvPushMatrix(); // for matrix transformation
    vec3.set(transformVec, 0, 0, 0) // use this to set the position
    mat4.translate(mvMatrix, mvMatrix, transformVec);

    scaleFactor = 30.0
    vec3.set(scaleVec, scaleFactor, scaleFactor, scaleFactor); // use this to set the scale
    mat4.scale(mvMatrix, mvMatrix, scaleVec);
    
    mat4.rotateX(mvMatrix, mvMatrix, degToRad(-65))
//    mat4.rotateY(mvMatrix, mvMatrix, degToRad(0))
    mat4.rotateZ(mvMatrix, mvMatrix, degToRad(35))

    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawTerrain();
    
    ka = vec3.fromValues(1.0, 1.0, 1.0) // white edges
    uploadLightsToShader(lightPosEye,Ia,Id,Is);
    uploadMaterialToShader(ka,kd,ks);
    setMatrixUniforms();
    drawTerrainEdges();
    mvPopMatrix();
}

function setupSpheresDraw() {
    
    // this 2D for loop will draw all, but want to draw the appropriate time step depending on the actual time
//    for (var step = 0; step < spheres.length && step < 4; step++) { //spheres.length
        
        for (var i = 0; i < spheres[ind].length; i++) {

            var transformVec = vec3.create(); // vector to move objects around
            var scaleVec = vec3.create(); // scaling vector

            // TODO: make for loop to render all the spheres each refresh frame

            // Set up light parameters
            var Ia = vec3.fromValues(1.0,1.0,1.0); // ambient
            var Id = vec3.fromValues(1.0,1.0,1.0); // diffuse
            var Is = vec3.fromValues(1.0,1.0,1.0); // specular

            // Set up material parameters    
            var ka = vec3.fromValues(0.0,0.0,0.0); // ambient
    //        var kd = vec3.fromValues(0.6,0.6,0.0); // diffuse
            
            kd = spheres[ind][i].color;
            
            var ks = vec3.fromValues(1.0,1.0,1.0); // specular

            mvPushMatrix(); // for matrix transformation
    //        vec3.set(transformVec, 0, 0, 0); // use this to set the position // +5 z?
            
            // scale down pos
//            spheres[step][i].position[2] *= (20.0/2045.0);
            
            mat4.translate(mvMatrix, mvMatrix, spheres[ind][i].position);

    //        scaleFactor = 1.0;
            scaleFactor = 10*spheres[ind][i].radius;
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
//    }
}

// update positions of the spheres here?
var ind = 0;
var counter = 0;
function animate() {

    counter++;
    ind = Math.floor(counter / 10); // handles time stepping
    ind = Math.min(spheres.length-1, ind);
    
//    var rad_scale = 1.0;
//    
//    var currNumSpheres = spheres.length;
//    
//    for (var i = 0; i < currNumSpheres && currNumSpheres < 50; i++) {
//        thisPos = spheres[i].position;
//        thisRad = spheres[i].radius;
//        
//        // plus-x
//        var newRad = Math.random()*rad_scale;
//        var new_x_pos = vec3.create();
//        vec3.add(new_x_pos, thisPos, vec3.fromValues(thisRad+newRad, 0, 0));
//        pos_x = new Sphere(newRad, new_x_pos);
//        spheres.push(pos_x);
//        spheres[spheres.length-1].color = vec3.fromValues(Math.random(), Math.random(), Math.random());
//        
//        // neg-x
////        newRad = Math.random()*rad_scale;
//        var new_x_neg = vec3.create();
//        vec3.add(new_x_neg, thisPos, vec3.fromValues(-(thisRad+newRad), 0, 0));
//        neg_x = new Sphere(newRad, new_x_neg);
//        spheres.push(neg_x);
//        spheres[spheres.length-1].color = vec3.fromValues(Math.random(), Math.random(), Math.random());
//        
//        // pos-y
////        newRad = Math.random()*rad_scale;
//        var new_y_pos = vec3.create();
//        vec3.add(new_y_pos, thisPos, vec3.fromValues(0, thisRad+newRad, 0));
//        pos_y = new Sphere(newRad, new_y_pos);
//        spheres.push(pos_y);
//        spheres[spheres.length-1].color = vec3.fromValues(Math.random(), Math.random(), Math.random());
//        
//        // neg-y
////        newRad = Math.random()*rad_scale;
//        var new_y_neg = vec3.create();
//        vec3.add(new_y_neg, thisPos, vec3.fromValues(0, -(thisRad+newRad), 0));
//        neg_y = new Sphere(newRad, new_y_neg);
//        spheres.push(neg_y);
//        spheres[spheres.length-1].color = vec3.fromValues(Math.random(), Math.random(), Math.random());
//
//        
//    }
    
    
    
//    spheres[0].position = vec3.fromValues(ind+=.1, 0, 0)
       
}

