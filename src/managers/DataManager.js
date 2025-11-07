class DataManagerClass {
  constructor() {
    if (DataManagerClass.instance) {
      return DataManagerClass.instance;
    }

    this.currentChallengeData = null;
    this.challengeFiles = {
      495547: 'Challenge_495547',
      495847: 'Challenge_495847',
      495897: 'Challenge_495897',
      496235: 'Challenge_496235',
      496243: 'Challenge_496243'
    };

    DataManagerClass.instance = this;
  }

  async loadUserData(challengeId) {
    try {
      const fileName = this.challengeFiles[challengeId];
      if (!fileName) {
        console.error(`Challenge ${challengeId} no encontrado`);
        return false;
      }

      const challengeData = await import(`./userData/${fileName}.js`);
      this.currentChallengeData = challengeData.default;
      console.log(`Datos cargados para ${challengeData.default.challengeName}`);
      return true;
    } catch (error) {
      console.error(`Error cargando datos del challenge ${challengeId}:`, error);
      return false;
    }
  }

  getAlgorithm(algoId) {
    if (!this.currentChallengeData) {
      console.error('No hay datos de challenge cargados');
      return null;
    }
    return this.currentChallengeData.algorithms[algoId] || null;
  }

  getAllAlgorithms() {
    if (!this.currentChallengeData) {
      console.error('No hay datos de challenge cargados');
      return {};
    }
    return this.currentChallengeData.algorithms;
  }

  getCurrentUser() {
    return this.currentChallengeData ? {
      userId: this.currentChallengeData.challengeId,
      userName: this.currentChallengeData.challengeName
    } : null;
  }
}

const DataManager = new DataManagerClass();

export default DataManager;