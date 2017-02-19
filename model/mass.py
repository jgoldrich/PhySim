import numpy as np
from sets import Set




def Class Mass:

    def __init__(self, par_dict, mass, charge):
    """ 
        inputs: 
        mass (particle, at initialization)
        charge (particle, at initialization)

    """
        self.mass = mass
        self.charge = charge
        self.a = np.array([0, 1, 2, 3, 4, 5])

    def transform(self, axis):
    """ 
        Performs the rotation transformation on photon array
        inputs: axis (element of [-3 -2 -1 1 2 3])
    """

        T = np.zeros((6,6), dtype=np.int8)
        assert type(axis) is in [-3, -2, -1, 1, 2, 3]

        if abs(axis) == 1:
            
            T[0,0] = 1
            T[4,1] = 1
            T[1,2] = 1
            T[2,3] = 1
            T[3,4] = 1
            T[5,5] = 1

        if abs(axis) == 2:

            T[1,0] = 1
            T[5,1] = 1
            T[2,2] = 1
            T[0,3] = 1
            T[4,4] = 1
            T[3,5] = 1

        if abs(axis) == 3:

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

