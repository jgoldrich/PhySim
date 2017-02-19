import interactLaw as iL


def Class Photon:

    def __init__(self, mass, tangent_mass, photon_num):


        self.strong = True
        self.em = 0
        self.weak = False
        self.gravity = mass.mass
        
        if tangent_mass == None:
            self.tangent = false 
        else:
            self.tangent = true
            self.tangent_mass = tangent_mass
            self.tangent_photon = tangent_mass.photons[photon_num]


    def interact(self):
        
        if self.tangent == true:

        
