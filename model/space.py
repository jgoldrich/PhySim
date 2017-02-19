from mass import Mass
from photon import Photon

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


		
