function Sphere(radius, position) {
    this.radius = radius;
    this.position = position;
    this.velocity = vec3.fromValues(0,0,0);
    this.color = vec3.fromValues(0,1,1); // kd - will be calcualated from radius/energy/mass?!?!!!?
    
    this.print = function() {
        ('\nradius: ' + this.radius + '\nposition: ' + this.position + '\nvelocity: ' + this.velocity);
    }
}