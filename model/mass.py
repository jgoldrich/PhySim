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
        self.roll_mat = np.array([[0,-1,0], [1,0,0], [0,0,0]])
		self.transformed = False

        if mass == 0:
            self.a = [0, 0, 0, 0, 0, 0]
            self.location = np.array([0., 0., 0.])
            pass

            # then is the infinite radius sphere
            # --> is a Cartesian two-space (R2)
            #do something
        elif parent_mass.mass == 0:
            self.a = np.array([0, 1, 2, 3, 4, 5])
            self.location = np.array([x, y, z])
        else:
            self.a = np.array([0, 1, 2, 3, 4, 5])
            self.location = np.array(self.parent_mass.location)
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

        return float(radius)

    def transform(self, axis, count):
        """ 
        Performs the rotation transformation on photon array
        inputs: axis (element of [-3 -2 -1 1 2 3])
        """
		if self.transformed:
			return
		
		tan = []
		for i in range(len(self.photons)):
			photon = self.photons[i]
			if(photon.tangent):
				tan.insert[0, i]
				photon.tangent = False	
				temp = photon.tangent_photon	
				photon.tangent_photon = None


        T = np.zeros((6,6), dtype=np.int8)

        if abs(axis) == 1:
            
            inv = [0, 5]
            T[0,0] = 1
            T[4,1] = 1
            T[1,2] = 1
            T[2,3] = 1
            T[3,4] = 1
            T[5,5] = 1

            tt = np.array([1, 0, 0])
            T_rm = np.array([[0,0,1], [1,0,0], [0,1,0]])

        if abs(axis) == 2:
    
            inv = [2, 4]
            T[1,0] = 1
            T[5,1] = 1
            T[2,2] = 1
            T[0,3] = 1
            T[4,4] = 1
            T[3,5] = 1
			
            tt = np.array([0, 1, 0])
            T_rm = np.array([[0,0,-1], [0,1,0], [-1,0,0]])

        if abs(axis) == 3:

            inv = [1, 3]
            T[2,0] = 1
            T[1,1] = 1
            T[5,2] = 1
            T[3,3] = 1
            T[0,4] = 1
            T[4,5] = 1

            tt = np.array([0, 0, 1])
            T_rm = np.array([[0,1,0], [1,0,0], [0,0,1]])


        if axis > 0:
            self.a = np.dot(self.a, T)
            V = np.dot(np.transpose(self.roll_mat), np.transpose(tt))
            self.location += V
            self.roll_mat = np.dot(self.roll_mat, T_rm)
			for i in insert:
				photon = self.photons[i]
				photon.tangent = True
				photon.tangent_photon = temp
				temp.tangent_photon = photon
				count++;
				photon.tangent_mass.transform(axis*-1, count)
        else:
            self.a = np.dot(self.a, np.transpose(T))
            V = np.dot(np.transpose(self.roll_mat), -1*np.transpose(tt))
            self.location += V
            self.roll_mat = np.dot(self.roll_mat, -1*T_rm)
			for i in insert:
				photon = self.photons[i]
				photon.tangent = True
				photon.tangent_photon = temp
				temp.tangent_photon = photon
				count++;
				photon.tangent_mass.transform(axis*-1, count)

        """
        for photon in self.photons:
            if photon.tangent and count<5:
                count += 1
                self.transform(axis, count)
	"""		
            

    def interact(self):
        for photon in self.photons:
            if photon.tangent:
                mass = photon.gravity
                dummy(photon, photon.tangent_mass.photons[photon.photon_num])
                if mass < photon.gravity:
                    state = 0
                else:
                    state = -1	

    def move(self, V):
        
        self.location += V
        for photon in self.photons:
            pass
#            if photon.tangent:
                

    def update(self, axis, V):

        #print("In 
        self.interact()
        #if state == -1:
        #    return -1

        #self.transform(axis, 0)
        self.move(V)	
        #return state


