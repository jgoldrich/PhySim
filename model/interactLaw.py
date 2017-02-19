import numpy as np

def dummy(photon1, photon2):

    if photon1.strong == True and photon2.strong == True:
        diff = photon1.mass.mass - photon2.mass.mass
        if diff > 0:
            photon1.mass.mass += np.log(diff)
            photon2.mass.mass -= np.log(diff)
        elif diff < 0:
            photon1.mass.mass -= np.log(diff)
            photon2.mass.mass += np.log(diff)

    if photon1.em and photon2.em:
        f = photon1.em * photon2.em
        f = f / (photon1.mass.mass*photon2.mas.mass)
        if photon1.mass.mass > photon2.mass.mass:
            photon1.mass.mass -= np.log(f)
            photon2.mass.mass += np.log(f)
        elif photon1.mass.mass < photon2.mass.mass:
            photon1.mass.mass += np.log(f)
            photon2.mass.mass -= np.log(f)
    
def strong(p1,p2):

    pass
    

def em(p1,p2):


    pass

def all_forces(photon1, photon2):

    if photon1.strong and photon2.strong:
        strong(photon1, photon2)
    if photon1.em and photon2.em:
        em(photon1, photon2)

