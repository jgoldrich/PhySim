import numpy as np
#from sets import Set
from photon import Photon
from interactLaw import dummy
import math

class Mass:

    def __init__(self, mass, charge, parent_mass, x, y, z):
        """ 
        inputs: 
        mass (particle, at initialization)
        charge (particle, at initialization)
		x, y, and z give the location of the mass in space

        """
        self.mass = mass
        self.charge = charge
        self.parent_mass = parent_mass

        if mass == 0:
            self.location = [0, 0, 0]
            pass

            # then is the infinite radius sphere
            # --> is a Cartesian two-space (R2)
            #do something
        elif parent_mass.mass == 0:
            self.a = np.array([0, 1, 2, 3, 4, 5])
            self.location = [x, y, z]
        else:
            self.a = np.array([0, 1, 2, 3, 4, 5])
            self.location = self.parent_mass.location
            self.location[2] += self.radius() + self.parent_mass.radius()
		
        # Define the 6 photon-grid on sphere surface
        self.photons = []
        self.photons.append(Photon(self, self.parent_mass, 0))
        for i in range(1,6):
            self.photons.append(Photon(self, None, i))

    def radius(self):
        """
        determines the value of the radius given the mass of the object
        """
        radius = math.pow( self.mass, 1/3)

        return radius

    def transform(self, axis, count):
        """ 
        Performs the rotation transformation on photon array
        inputs: axis (element of [-3 -2 -1 1 2 3])
        """

        T = np.zeros((6,6), dtype=np.int8)
        #assert type(axis) is in [-3, -2, -1, 1, 2, 3]

        if abs(axis) == 1:
            
            
            inv = [0, 5]
            T[0,0] = 1
            T[4,1] = 1
            T[1,2] = 1
            T[2,3] = 1
            T[3,4] = 1
            T[5,5] = 1


        if abs(axis) == 2:
    
            inv = [2, 4]
            T[1,0] = 1
            T[5,1] = 1
            T[2,2] = 1
            T[0,3] = 1
            T[4,4] = 1
            T[3,5] = 1
						
            dx = 1
            dy = 0

        if abs(axis) == 3:

            inv = [1, 3]
            T[2,0] = 1
            T[1,1] = 1
            T[5,2] = 1
            T[3,3] = 1
            T[0,4] = 1
            T[4,5] = 1

            dx = 0
            dy = 1

        if axis > 0:
            self.a = np.dot(np.a, T)
            self.location[0] += dx
            self.location[1] += dy
        else:
            self.a = np.dot(np.a, np.transpose(T))
            self.location[0] -= dx
            self.location[1] -= dy

        for photon in self.photons:
            if photon.tangent and count<5:
                count += 1
                transform(photon.tangent_mass, axis, count)
			
            

    def interact(self):
        for photon in self.photons:
            if photon.tangent:
                mass = photon.gravity
                dummy(photon, photon.tangent_mass.photons[photon.photon_num])
                if mass < photon.gravity:
                    state = 0
                else:
                    state = -1	
        return state

    def update(self):

        state = self.interact()
        if state == -1:
            return -1
        self.transform()
	
        return state


