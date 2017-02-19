from mass import Mass
from photon import Photon
import math
import random
from datetime import datetime

class Space:
	
    def __init__(self):
		
        self.masses = list()
        random.seed(datetime.now())		
	
    def createMass(self, mass, charge, parent_mass, x, y, z):
        """
        inserts new Masses into the masses list
        """
        self.masses.insert(0, Mass(mass, charge, parent_mass, x, y, z))
		

    def destroy_mass(self, index):
        #removes desired index from the list of masses
        self.masses.remove(index)

    def distance(self, loc1, loc2):
        x = (loc1[0] - loc2[0])**2
        y = (loc1[1] - loc2[1])**2
        z = (loc1[2] - loc2[2])**2
        total = math.sqrt(x + y + z) 
        return total

    def split_mess(self, idx1, idx2):
        #somehow split the masses at each index together
        pass

    def check_collissions(self):
        """
        Loops through the masses after we update to check if any of the masses are located in the same space.
        If there are objects in the same space then we will either merge or destroy the objects.
        """		
        max_len = len(self.masses)
        for i in range(len(self.masses)):
            if i >= max_len:
                break
            print("i = ", i)
            mass1 = self.masses[i]
            counter2 = 0
            for j in range(i+1, len(self.masses)):
                print("j = ", j)
                j = j-counter2
                mass2 = self.masses[j]
                if(self.distance(mass1.location, mass2.location) < mass1.radius() + mass2.radius()):
                #either split the two masses, or destroy the two masses
                    destroy = True
                    if(destroy):
                        max_len -= 2
                        if(j-i>2):
                            counter2 += 2
                        else:
                            counter2 = counter2 + 1
                        self.destroy_mass(j)
                        self.destroy_mass(i)
                    else:
                        self.split_mass(i, j)
                else:
                    pass

    def update(self):
        """
        loops through all of the masses and updates their states.
        If update returns -1 we remove that mass from the masses array.
        """
        self.createMass(1, 1, self.masses[0], 0., 0., 1.)        
        V = [0.,0.,0.]

        for i in range(len(self.masses)):

            for j in range(3):
                V[j] = random.random()*3. - 1.5
            self.masses[i].location += V

#            mass = self.masses[i]
            axis = math.ceil(3.*random.random())
            if random.random() < 0.5:
                axis = -1*axis
            self.masses[i].update(axis, V)
#                if(state == -1):
#                    self.destroy_mass(i)
#            self.check_collissions()
"""		
    def update2(self):

        for i in range(len(self.masses)):
            
"""            
