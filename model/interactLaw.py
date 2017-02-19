import numpy as np

def dummy(photon1, photon2):

    if photon1.strong == True and photon2.strong == True:
        diff = photon1.mass.mass - photon2.mass.mass
        if diff > 0:
            photon1.mass.mass += np.log(diff)
            photon2.mass.mass -= np.log(diff)

    if photon1.em and photon2.em:
        f = photon1.em * photon2.em
        if f > 0:
            photon1.mass.mass += np.log(f)
            photon2.mass.mass += np.log(f)
        if f < 0:
            photon1.mass.mass -= np.log(f)
            photon2.mass.mass -= np.log(f)
    
    

