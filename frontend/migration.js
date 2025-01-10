import axios from "axios";

const FUDO_API_URL = "https://api.fu.do"


const getSalesSummary = async (startDate, endDate, localeId = -1) => {
  try {        
    const response = await axios.get(`${FUDO_API_URL}/sales_summary?dc=0&ss=3&t1=${startDate}&t2=${endDate}${localeId !== -1 && "&cr=" + localeId}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1aSI6MSwidWEiOnRydWUsInVyIjoxLCJ1bCI6ImFkbWluQG1lcmFraWJvd2wiLCJhaSI6Mzc3MTIsInNpYyI6MTM4MywiY2kiOiI3IiwiZXhwIjoxNzM2NTM5OTE0fQ.HPhJ6veUbD4fb40ecjzjtcezKy9-5HZA44hlV1MJhUE",        
      }
    })
    return response.data;
  } catch (error) {
    throw error;
  }
}

const saveSalesToLocal = async (sales) => {
  try {        
    const response = await axios.post(`http://localhost:8080/api/fudo/sales`, {
      sales: sales
    })
    return response.data;
  } catch (error) {
    throw error;
  }
}


const DoMigration = async (year, localeId) => {  
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const sales = [];
  let counter = 0;

  try {
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const isoDateStart = date.toISOString(); // Inicio del día
      const isoDateEnd = new Date(date); // Clonamos la fecha
      isoDateEnd.setUTCHours(23, 59, 59, 999); // Ajustamos al final del día
  
      const res = await getSalesSummary(isoDateStart, isoDateEnd.toISOString(), localeId);

      const newSale = {
        locale_id: localeId,
        total_amount: res.totals.reduce((sum, item) => sum + parseFloat(item.amount), 0),
        date: isoDateStart,
        sales_count: res.salesCount
      }

      sales.push(newSale);

      // if (counter > 30) {
      //   await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Esperar 1 minuto
      //   console.log("esperando 1 min")
      //   counter = 0;
      // }

      if (counter > 7) {
        break;
      }

      console.log(newSale)
      counter++;
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.log(error.response.data.message);
    } else {
      console.log('Error no manejado:', error);
    }
  }

  try {
    const res = await saveSalesToLocal(sales);
    console.log("ok ", res)
  } catch (error) {

  }
};

const local = 3;
// for(let year = 2021; year < = 2024; year++ ) {
//   await DoMigration(year, local);
// }

await DoMigration(2025, local);

