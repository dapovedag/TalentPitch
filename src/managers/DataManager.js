class DataManagerClass {
  constructor() {
    if (DataManagerClass.instance) {
      return DataManagerClass.instance;
    }
    
    this.currentUserData = null;
    this.userFiles = {
      1990839: 'Christian_1990839',
      87904: 'Marco_87904',
      140298: 'Josue_140298',
      2021607: 'Maria_2021607',
      1995657: 'Vero_1995657',
      1995431: 'Juanjo_1995431',
      2021502: 'Lu_2021502',
      12: 'Santiago_12',
      1979789: 'Dani',
      1990069: 'Ruth',
      2021394: 'Paul',
      1994339: 'Luis',
      101916: 'SantiR',
      1966937: 'Majo'
    };
    
    DataManagerClass.instance = this;
  }

  async loadUserData(userId) {
    try {
      const fileName = this.userFiles[userId];
      if (!fileName) {
        console.error(`Usuario ${userId} no encontrado`);
        return false;
      }
      
      const userData = await import(`./userData/${fileName}.js`);
      this.currentUserData = userData.default;
      console.log(`Datos cargados para ${userData.default.userName}`);
      return true;
    } catch (error) {
      console.error(`Error cargando datos del usuario ${userId}:`, error);
      return false;
    }
  }

  getAlgorithm(algoId) {
    if (!this.currentUserData) {
      console.error('No hay datos de usuario cargados');
      return null;
    }
    return this.currentUserData.algorithms[algoId] || null;
  }

  getAllAlgorithms() {
    if (!this.currentUserData) {
      console.error('No hay datos de usuario cargados');
      return {};
    }
    return this.currentUserData.algorithms;
  }

  getCurrentUser() {
    return this.currentUserData ? {
      userId: this.currentUserData.userId,
      userName: this.currentUserData.userName
    } : null;
  }
}

const DataManager = new DataManagerClass();

export default DataManager;