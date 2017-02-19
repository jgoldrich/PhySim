import interactLaw as iL


def Class Photon:

<<<<<<< HEAD
    def __init__(self, mass, tangent_mass, photon_num):
=======
    def __init__(self, mass, mass_obj):
		"""
			inputs:
			mass (particle, at initialization)
			mass_obj (Mass object that the photon is associated with)
		"""
>>>>>>> acb825c8ac951f6459489b67a0dd8f63a99c4b47

        self.strong = true
        self.em = 0
        self.weak = false
        self.gravity = mass
		self.mass_obj = mass_obj
        
        if tangent_mass == None:
            self.tangent = false 
        else:
            self.tangent = true
            self.tangent_mass = tangent_mass
            self.tangent_photon = tangent_mass.photons[photon_num]


    def interact(self):
        
        if self.tangent == true:

        
