from mass import Mass
from photon import Photon

def Class Space:
	
	def __init__(self):
		
		self.masses = list()
	
	def createMass(self, par_dict, mass, charge):
		"""
			inserts new Masses into the masses list
		"""
		masses.insert(0, Mass(par_dict, mass, charge))

	def roll(self, mass):
		"""
			Rolls mass to a new location
		"""
		
