import numpy as np
from sets import Set
from photon import Photon
from interactLaw import dummy


def Class Mass:

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
	    # then is the infinite radius sphere
            # --> is a Cartesian two-space (R2)
            #do something
	    pass
	else if parent_mass.mass == 0:
            self.a = np.array([0, 1, 2, 3, 4, 5])
	    self.location = [x, y, z]
        else:
            self.a = np.array([0, 1, 2, 3, 4, 5])
		
        # Define the 6 photon-grid on sphere surface
        self.photons = []
        self.photons.append(Photon(self.mass, parent_mass))
        for i in range(5):
            self.photons.append(Photon(self.mass, None, None))

  		"""  
		def roll(self, direction):
		"""
		"""
			roll in the given direction:
			dir = 1, is +x direction
			dir = 2, is -x direction
			dir = 3, is +y direction
			dir = 4, is -y direction
		"""	
		"""
		if direction == 1:
			self.loc[0] = self.loc[0] + 1
		else if direction == 2:
			self.loc[0] = self.loc[0] - 1
		else if direction == 3:
			self.loc[1] = self.loc[1] + 1
		else:
			self.loc[1] = self.loc[1] - 1
       """

    def transform(self, axis, count):
    """ 
        Performs the rotation transformation on photon array
        inputs: axis (element of [-3 -2 -1 1 2 3])
    """

        T = np.zeros((6,6), dtype=np.int8)
        assert type(axis) is in [-3, -2, -1, 1, 2, 3]

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
			if photon.tangent && count<5:
				count++
				transform(photon.tangent_mass, axis, count)
			
            

    def interact(self):
		for photon in self.photons:
			if photon.tangent:
				mass = photon.gravity
				dummy(photon, photon.tangent_mass)
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


