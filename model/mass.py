import numpy as np
from sets import Set
from photon import Photon



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
	    pas
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

    def roll(self):


        pass

    def transform(self, axis):
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

        if abs(axis) == 3:

            inv = [1, 3]
            T[2,0] = 1
            T[1,1] = 1
            T[5,2] = 1
            T[3,3] = 1
            T[0,4] = 1
            T[4,5] = 1

        if axis > 0:
            self.a = np.dot(np.a, T)
        else:
            self.a = np.dot(np.a, np.transpose(T))

        for pt in inv:
            

    def interact(self):

        pass

    def update(self):

        state = self.interact()
        if state == -1:
            return -1
        self.transform()
	
        return state


