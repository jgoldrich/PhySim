import interactLaw as iL


class Photon:

    def __init__(self, mass, tangent_mass, photon_num):


        self.strong = True
        self.em = 0
        self.weak = False
        self.gravity = mass.mass
        self.photon_num = photon_num
        
        self.mass = mass
        
        if tangent_mass == None:
            self.tangent = False 
        else:
            self.tangent = True
            self.tangent_mass = tangent_mass
            self.tangent_photon = tangent_mass.photons[photon_num]

