function Sphere(radius) {
    this.radius = radius;
    this.position = vec3.fromValues(0,0,0);
    this.velocity = vec3.fromValues(0,0,0);
    this.color = vec3.fromValues(1,1,1);
    
    this.print('\nradius: ' + this.radius + '\nposition: ' + this.position + '\nvelocity: ' + this.velocity);
}