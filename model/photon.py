import interactLaw as iL


def Class Photon:

    def __init__(self, mass, tangent_mass, photon_num):

        self.strong = true
        self.em = 0
        self.weak = false
        self.gravity = mass
        
        if tangent_mass == None:
            self.tangent = false 
        else:
            self.tangent = true
            self.tangent_mass = tangent_mass
            self.tangent_photon = tangent_mass.photons[photon_num]


    def interact(self):
        
        if self.tangent == true:

        
