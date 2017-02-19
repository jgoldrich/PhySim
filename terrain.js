// generate the flat plane geometry

// terrain plane subdivision
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

           vertexArray.push(0);
           
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
        
           // 2nd triangle - do the same thing as above
           faceArray.push(vid+1);
           faceArray.push(vid+1+dim+1);
           faceArray.push(vid+dim+1);
           
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

function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}



