from photon import Photon
from mass import Mass
from space import Space
import numpy as np

# par_dict is the dictionary of fundamental particles
# 'name':[mass (eV/c^2), charge, spin]
par_dict = {'up':[float("2.3e6"), 2./3, 1./2],
            'down':[float("4.8e6"), -1./3, 1./2],
            'charm':[float("1.275e9"), 2./3, 1./2],
            'strange':[float("95e6"), -1./3, 1./2],
            'top':[float("173.07e9"), 2./3, 1./2],
            'bottom':[float("4.18e9"), -1./3, 1./2],
            'electron':[float("0.511e6"), -1., 1./2],
            'nu_e':[float("2.2"), 0., 1./2],
            'muon':[float("105.7e6"), -1., 1./2],
            'nu_mu':[float("0.17e6"), 0., 1./2],
            'tau':[float("1.777e9"), -1., 1./2],
            'nu_tau':[float("15.5e6"), 0., 1./2],
            'Z':[float("91.2e9"), 0., 1.],
            'W':[float("80.4e9"), 1., 1.],
            'Higgs':[float(126e9), 0., 0.]}

if __name__ == '__main__':

    df = 20
    space = Space() 
    space.createMass(0, 0, None, 0, 0, 0)
    f = open('data.csv', 'w')
    f.close()

    for d in range(0,df):
        print(d)
        print(len(space.masses))
        #space.update2()
        space.update()

        with open('data.csv', 'a') as f_out:
            for i in range(len(space.masses)):
                out = [d, space.masses[i].radius(),
                        space.masses[i].location[0],
                        space.masses[i].location[1],
                        space.masses[i].location[2]]
                #np.savetxt(f_out, out, delimiter=",")
                for item in out:
                    f_out.write(str(item))
                    f_out.write(',')
                f_out.write('\n')
            

        if len(space.masses) > 1000:
            break
    
