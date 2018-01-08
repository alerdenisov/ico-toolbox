class SaleService {
  async getProgress (req, reply) {
    const sold = Math.random() * 10 * 1e6
    const raised = sold / 50000
    return {
      sold,
      raised
    }
  }

  async getInfo (req, reply) {
    return {
      endTime: new Date(Date.UTC(2018, 1, 8, 0, 0, 0, 0)),
      startTime: new Date(Date.UTC(2018, 0, 8, 0, 0, 0, 0)),
      hardCap: 50 * 1e6,
      softCap: 10 * 1e6,
      priceBTC: 1 / 50000
    }
  }
}

module.exports = SaleService