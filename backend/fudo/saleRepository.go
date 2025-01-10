package fudo

import (
	"dashboard/database"
	"dashboard/helpers"
	r "dashboard/responses"
	"fmt"
	"strconv"
	"strings"
)

// import (
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// )

type SaleRepository struct{}

func (s *SaleRepository) FetchAllSales(limit int, offset int) ([]r.Sale, error) {
	db := database.GetDB()
	query := `SELECT f.id, f.locale_id, f.total_amount, f.date, f.sales_count, l.name
		FROM fudo_day_sales_summary f
		INNER JOIN locale l ON l.id = f.locale_id
		ORDER BY DATETIME(f.date) DESC
		LIMIT ? OFFSET ?;`
	rows, err := db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	var sales []r.Sale
	for rows.Next() {
		var sale r.Sale
		errScan := rows.Scan(&sale.ID, &sale.LocaleId, &sale.TotalAmount, &sale.Date, &sale.SalesCount, &sale.LocaleName)
		if errScan != nil {
			return nil, errScan
		}
		sales = append(sales, sale)
	}

	return sales, nil
}

func (s *SaleRepository) SaveSales(p SalesParam) error {
	db := database.GetDB()

	var placeholders []string // ["()","()"]
	var parameters []interface{}

	for _, sale := range p.Sales {
		placeholder := "(?, ?, ?, ?)"
		placeholders = append(placeholders, placeholder)
		parameters = append(parameters, sale.LocaleId, sale.TotalAmount, sale.Date, sale.SalesCount)
	}

	//mandar la fecha por dia
	query := fmt.Sprintf(`INSERT INTO fudo_day_sales_summary(locale_id, total_amount, date, sales_count) VALUES %s;`,
		strings.Join(placeholders, ", ")) // "(), (), ()"

	if _, err := db.Exec(query, parameters...); err != nil {
		return err
	}

	return nil
}

func (e *SaleRepository) GetSummary(t1 string, t2 string, localeId int) (r.SalesSummary, error) {
	db := database.GetDB()
	query := `SELECT COALESCE(COUNT(*), 0) AS total_sales, coalesce(SUM(f.total_amount), 0) AS total_amount
		FROM fudo_day_sales_summary f
		WHERE f.date BETWEEN ? AND ?`
	var summary r.SalesSummary
	var parameters []interface{}
	parameters = append(parameters, t1, t2)
	if localeId != -1 {
		query += " AND locale_id = ?"
		parameters = append(parameters, localeId)
	}
	query += ";"
	fmt.Println(query)
	err := db.QueryRow(query, parameters...).Scan(&summary.TotalSales, &summary.TotalAmount)
	if err != nil {
		return r.SalesSummary{}, err
	}

	return summary, nil
}

func (e *SaleRepository) GetDaySummariesByMonthAndYear(month int, year int) ([]r.DaySummary, error) {
	db := database.GetDB()
	// Obtener todos los días del mes
	days := helpers.GetDaysInMonth(year, month)

	query := `
        SELECT
            strftime('%d', f.date) as day,
            SUM(f.total_amount) as total_amount
        FROM fudo_day_sales_summary f
        WHERE strftime('%Y', f.date) = ? AND strftime('%m', f.date) = ?
        GROUP BY day
        ORDER BY day;
    `

	rows, err := db.Query(query, fmt.Sprintf("%d", year), fmt.Sprintf("%02d", month))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Mapa para almacenar los totales por día
	resultMap := make(map[int]int) // Cambiado a int para 'day' y 'total_amount'
	for rows.Next() {
		var day int
		var totalAmount int
		err = rows.Scan(&day, &totalAmount)
		if err != nil {
			return nil, err
		}
		resultMap[day] = totalAmount
	}

	// Crear los resultados finales con los días completos del mes
	var daySummaries []r.DaySummary
	for _, day := range days {
		totalAmount := 0
		if amount, found := resultMap[day]; found {
			totalAmount = amount
		}

		// Agregar un resumen de día con el total acumulado
		daySummaries = append(daySummaries, r.DaySummary{
			Day:         day,
			TotalAmount: totalAmount,
		})
	}

	return daySummaries, nil
}

func (e *SaleRepository) GetDaySummariesByMonthAndYearRange(startMonth int, startYear int, endMonth int, endYear int) ([]r.PeriodSummary, error) {
	db := database.GetDB()

	// Consulta SQL para calcular totales por año-mes
	query := `
        SELECT
            strftime('%Y', f.date) AS year,
            strftime('%m', f.date) AS month,
            SUM(total_amount) AS total_amount
        FROM fudo_day_sales_summary f
        WHERE (strftime('%Y', f.date) || strftime('%m', f.date)) BETWEEN ? AND ?
        GROUP BY year, month
        ORDER BY year, month;
    `

	// Formatear las fechas de inicio y fin como cadenas
	startPeriod := fmt.Sprintf("%04d%02d", startYear, startMonth)
	endPeriod := fmt.Sprintf("%04d%02d", endYear, endMonth)

	// Ejecutar la consulta
	rows, err := db.Query(query, startPeriod, endPeriod)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Construir el resultado
	var periodSummaries []r.PeriodSummary
	for rows.Next() {
		var yearStr, monthStr string
		var totalAmount int

		err = rows.Scan(&yearStr, &monthStr, &totalAmount)
		if err != nil {
			return nil, err
		}

		// Convertir año y mes a enteros
		year, _ := strconv.Atoi(yearStr)
		month, _ := strconv.Atoi(monthStr)

		// Agregar el resumen al resultado
		periodSummaries = append(periodSummaries, r.PeriodSummary{
			Month:       month,
			Year:        year,
			TotalAmount: totalAmount,
		})
	}

	return periodSummaries, nil
}
