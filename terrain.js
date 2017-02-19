// generate the flat plane geometry

/**
 * function to generate the actual vertices (3 coordinates) for the terrain / triangle mesh
 * the height (3rd coord) is retrieved from the heighMap above
 * this function also calculated the per-vertex normals for the shaders
 */
function terrainFromIteration(n, dim, minX,maxX,minY,maxY, vertexArray, faceArray, normalArray) {
    var size = dim*dim;
    
    var deltaX=(maxX-minX)/dim;
    var deltaY=(maxY-minY)/dim;
    var a = .1;
    for(var i=0;i<=dim;i++)
       for(var j=0;j<=dim;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);

           vertexArray.push(1);
           
           // initialize the normal array here to all zeros
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }

    var numT=0;
    for(var i=0;i<dim;i++)
       for(var j=0;j<dim;j++) {
           var vid = i*(dim+1) + j;
           
           // 1st triangle
           faceArray.push(vid); // indicies of the vertices being used from the vertexArray
           faceArray.push(vid+1);
           faceArray.push(vid+dim+1);
           
           // get the vertices from 1st triangle
           var index0 = vid;
           var v0 = vec3.fromValues(vertexArray[index0], vertexArray[index0+1], vertexArray[index0+2]);
           
           var index1 = vid+1;
           var v1 = vec3.fromValues(vertexArray[index1], vertexArray[index1+1], vertexArray[index1+2]);
           
           var index2 = vid+dim+1;
           var v2 = vec3.fromValues(vertexArray[index2], vertexArray[index2+1], vertexArray[index2+2]);
           
           // find the normal for this face
           var faceNormal = vec3.create();
           var v2_0 = vec3.create();
           var v1_0 = vec3.create();
           vec3.subtract(v2_0, v2, v0);
           vec3.subtract(v1_0, v1, v0);
           
           // normal is the cross product of 2 direction vectors of this triangle
           vec3.cross(faceNormal, v2_0, v1_0);
           vec3.normalize(faceNormal, faceNormal); // make sure to normalize
           
           // for each vertex that's in this triangle, we're going to add the current face normal to it, then at the end
           // go thru and just normalize the normal for each vertex, which in a sense just takes the average as we needed
           normalArray[3*(index0)] += faceNormal[0];
           normalArray[3*(index0+1)] += faceNormal[1];
           normalArray[3*(index0+2)] += faceNormal[2];
        
           normalArray[3*(index1)] += faceNormal[0];
           normalArray[3*(index1+1)] += faceNormal[1];
           normalArray[3*(index1+2)] += faceNormal[2];
           
           normalArray[3*index2] += faceNormal[0];
           normalArray[3*(index2+1)] += faceNormal[1];
           normalArray[3*(index2+2)] += faceNormal[2];
           
           // 2nd triangle - do the same thing as above
           faceArray.push(vid+1);
           faceArray.push(vid+1+dim+1);
           faceArray.push(vid+dim+1);
           
           var index0 = vid+1;
           var v0 = vec3.fromValues(vertexArray[index0], vertexArray[index0+1], vertexArray[index0+2]);
           
           var index1 = vid+1+dim+1;
           var v1 = vec3.fromValues(vertexArray[index1], vertexArray[index1+1], vertexArray[index1+2]);
           
           var index2 = vid+dim+1;
           var v2 = vec3.fromValues(vertexArray[index2], vertexArray[index2+1], vertexArray[index2+2]);
           
           var faceNormal = vec3.create();
           var v2_0 = vec3.create();
           var v1_0 = vec3.create();
           vec3.subtract(v2_0, v2, v0);
           vec3.subtract(v1_0, v1, v0);
           vec3.cross(faceNormal, v2_0, v1_0);
           vec3.normalize(faceNormal, faceNormal);
           
           normalArray[3*(index0)] += faceNormal[0];
           normalArray[3*(index0+1)] += faceNormal[1];
           normalArray[3*(index0+2)] += faceNormal[2];
        
           normalArray[3*(index1)] += faceNormal[0];
           normalArray[3*(index1+1)] += faceNormal[1];
           normalArray[3*(index1+2)] += faceNormal[2];
           
           normalArray[3*index2] += faceNormal[0];
           normalArray[3*(index2+1)] += faceNormal[1];
           normalArray[3*(index2+2)] += faceNormal[2];         
           
           numT+=2;
       }
    
    for (var i = 0; i < normalArray.length; i+=3) {
        // go thru to normalize all the vertex normal
        var thisNormal = vec3.fromValues(normalArray[i], normalArray[i+1], normalArray[i+2]);
        vec3.normalize(thisNormal, thisNormal);
        normalArray[i] = thisNormal[0];
        normalArray[i+1] = thisNormal[1];
        normalArray[i+2] = thisNormal[2];
    }
    
    return numT;
}


