import numpy as np
from math import floor
import random
from datetime import datetime

if __name__ == "__main__":

    random.seed(datetime.now())

    n_sphere = 1000
    const = 10

    data = np.zeros((n_sphere, 4))
    for i in range(n_sphere):
        data[i,0] = random.random()
        for j in range(1,4):
            data[i,j] = floor(random.random()*const)

    np.savetxt("dummy_data.csv", data, delimiter=",")
