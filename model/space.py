from mass import Mass
from photon import Photon
import math

def Class Space:
	
	def __init__(self):
		
		self.masses = list()
		
	
	def createMass(self, mass, charge, parent_mass, x, y, z):
		"""
			inserts new Masses into the masses list
		"""
		masses.insert(0, Mass(mass, charge, parent_mass, x, y, z))
		

	def destroy_mass(self, index):
		#removes desired index from the list of masses
		masses.remove(index)

	def distance(self, loc1, loc2):
		x = (loc1[0] - loc2[0])**2
		y = (loc1[1] - loc2[1])**2
		z = (loc1[2] - loc2[2])**2
		total = math.sqrt(x + y + z) 
		return total

	def check_collissions(self):
		"""
			Loops through the masses after we update to check if any of the masses are located in the same space.
			If there are objects in the same space then we will either merge or destroy the objects.
		"""		
		for i in len(self.masses):
			mass1 = self.masses[i]
			for j in range(i, len(self.masses)):
				mass2 = self.masses[j]
				if(distance(mass1.location, mass2.location) < mass1.radius() + mass2.radius()):
					#either merge the two masses, or destroy the two masses
					pass
				else:
					pass

	def update(self):
		"""
			loops through all of the masses and updates their states.
			If update returns -1 we remove that mass from the masses array.
		"""
		for i in len(self.masses):
			mass = self.masses[i]
			if(mass.parent_mass.mass == 0):
				state = mass.update()
			if(state == -1):
				destroy_mass(i)
		check_collissions()
		

	

		
