


def Class Photon:

    def __init__(self, mass, mass_obj):
		"""
			inputs:
			mass (particle, at initialization)
			mass_obj (Mass object that the photon is associated with)
		"""

        self.strong = true
        self.em = 0
        self.weak = false
        self.gravity = mass
		self.mass_obj = mass_obj
        
        self.tangent = false 

    def interact(self):
        

