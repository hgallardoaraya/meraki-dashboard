package repositories

import (
	"dashboard/database"
	"dashboard/helpers"
	m "dashboard/models"
	r "dashboard/responses"
	"database/sql"
	"fmt"
	"strconv"
	"strings"
)

type BillRepository struct{}

var tableBill string = "bill"

func (e *BillRepository) GetBills() ([]r.Bill, error) {
	db := database.GetDB()
	query := fmt.Sprintf(`SELECT b.id, p.name, 
	    u.name, u.last_name, 
	    l.name, 
	    bc.name, 
	    bt.name, 
	    creation_date, contable_date, total_neto, total_iva, total_amount, notes, image 
		FROM %s b
		INNER JOIN %s p ON p.id = b.provider_id
		INNER JOIN %s u ON u.id = b.user_id
		INNER JOIN %s l ON l.id = b.locale_id
		INNER JOIN %s bc ON bc.id = b.category_id
		INNER JOIN %s bt ON bt.id = b.bill_type_id		
		;`,
		tableBill, tableProvider, tableUser, tableLocale, tableBillCategory, tableBillType)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}

	var bills []r.Bill
	for rows.Next() {
		var bill r.Bill
		err := rows.Scan(&bill.ID, &bill.ProviderName, &bill.UserName, &bill.UserLastName, &bill.LocaleName, &bill.CategoryName,
			&bill.TypeName, &bill.CreationDate, &bill.ContableDate, &bill.TotalNeto, &bill.TotalIva, &bill.TotalAmount,
			&bill.Notes, &bill.Image)
		if err != nil {
			return nil, err
		}
		bills = append(bills, bill)
	}

	return bills, nil
}

func (e *BillRepository) GetBillByID(id int) (m.Bill, error) {
	db := database.GetDB()
	var bill m.Bill

	err := db.QueryRow("SELECT * FROM "+tableBill+" WHERE id = ?;", id).Scan(&bill.ID, &bill.UserID, &bill.TypeID, &bill.CategoryID, &bill.ContableDate, &bill.DteID,
		&bill.Image, &bill.Notes, &bill.ProviderID, &bill.LocaleID, &bill.TotalAmount, &bill.TotalIva, &bill.TotalNeto,
		&bill.CreationDate)
	if err != nil {
		return m.Bill{}, err
	}

	return bill, nil
}

func (e *BillRepository) CreateBill(bill m.Bill, documents []m.BillDocument) (int64, error) {
	db := database.GetDB()
	tx, err := db.Begin()
	if err != nil {
		return -1, err
	}

	var res sql.Result
	res, err = tx.Exec("INSERT INTO "+tableBill+" (user_id, bill_type_id, category_id, contable_date, dte_id, image, notes, provider_id, locale_id, total_amount, total_iva, total_neto, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		5, bill.TypeID, bill.CategoryID, bill.ContableDate, bill.DteID,
		bill.Image, bill.Notes, bill.ProviderID, bill.LocaleID, bill.TotalAmount, bill.TotalIva, bill.TotalNeto,
		bill.CreationDate)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return -1, rbErr
		}
		return -1, err
	}

	var lastInsertedRowId int64
	lastInsertedRowId, err = res.LastInsertId()
	var plh []string
	var parameters []interface{}
	if len(documents) > 0 {
		for _, doc := range documents {
			plh = append(plh, fmt.Sprintf("(?, ?, ?)"))
			parameters = append(parameters, lastInsertedRowId, doc.Name, doc.Format)
		}
		_, err = tx.Exec(fmt.Sprintf(`
		INSERT INTO %s (bill_id, name, format) 
		VALUES %s;`, tableBillDocument, strings.Join(plh, ",")),
			parameters...,
		)
		if err != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				return -1, rbErr
			}
			return -1, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return -1, err
	}
	return lastInsertedRowId, nil
}

func (e *BillRepository) UpdateBill(bill m.Bill) error {
	db := database.GetDB()

	_, err := db.Exec("UPDATE "+tableBill+" SET user_id = ?, bill_type_id = ?, category_id = ?, contable_date = ?, dte_id = ?, image = ?, notes = ?, provider_id = ?, locale_id = ?, total_amount = ?, total_iva = ?, total_neto = ?, creation_date = ? WHERE id = ?;",
		bill.UserID, bill.TypeID, bill.CategoryID, bill.ContableDate, bill.DteID,
		bill.Image, bill.Notes, bill.ProviderID, bill.LocaleID, bill.TotalAmount, bill.TotalIva, bill.TotalNeto,
		bill.CreationDate, bill.ID)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillRepository) DeleteBill(id int) error {
	db := database.GetDB()

	_, err := db.Exec("DELETE FROM "+tableBill+" WHERE id = ?;", id)
	if err != nil {
		return err
	}

	return nil
}

func (e *BillRepository) GetSummary(t1 string, t2 string, localeId int) (r.BillsSummary, error) {
	db := database.GetDB()
	query := fmt.Sprintf(`SELECT COALESCE(COUNT(*), 0) AS total_bills, coalesce(SUM(total_amount), 0) AS total_amount
		FROM %s
		WHERE creation_date BETWEEN ? AND ?`, tableBill)
	var summary r.BillsSummary
	var parameters []interface{}
	parameters = append(parameters, t1, t2)
	if localeId != -1 {
		query += " AND locale_id = ?"
		parameters = append(parameters, localeId)
	}
	query += ";"
	fmt.Println(query)
	err := db.QueryRow(query, parameters...).Scan(&summary.TotalBills, &summary.TotalAmount)
	if err != nil {
		return r.BillsSummary{}, err
	}

	return summary, nil
}

func (e *BillRepository) GetDaySummariesByMonthAndYear(month int, year int) ([]r.DaySummary, error) {
	db := database.GetDB()
	// Obtener todos los días del mes
	days := helpers.GetDaysInMonth(year, month)

	query := `
        SELECT
            strftime('%d', creation_date) as day,
            SUM(total_amount) as total_amount
        FROM bill
        WHERE strftime('%Y', creation_date) = ? AND strftime('%m', creation_date) = ?
        GROUP BY day
        ORDER BY day;
    `
	fmt.Println(query)
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

func (e *BillRepository) GetDaySummariesByMonthAndYearRange(startMonth int, startYear int, endMonth int, endYear int) ([]r.PeriodSummary, error) {
	db := database.GetDB()

	// Consulta SQL para calcular totales por año-mes
	query := `
        SELECT
            strftime('%Y', creation_date) AS year,
            strftime('%m', creation_date) AS month,
            SUM(total_amount) AS total_amount
        FROM bill
        WHERE (strftime('%Y', creation_date) || strftime('%m', creation_date)) BETWEEN ? AND ?
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

func (e *BillRepository) GetProviderSummariesByMonthAndYear(month int, year int) ([]r.BillsProvidersDaySummary, error) {
	db := database.GetDB()
	providerRepository := ProviderRepository{}

	dbProviders, err := providerRepository.GetProviders()
	if err != nil {
		return nil, err
	}

	providerNames := make(map[int]string)
	for _, prov := range dbProviders {
		providerNames[prov.ID] = prov.Name
	}

	// Obtener todos los días del mes
	days := helpers.GetDaysInMonth(year, month)

	query := `
        SELECT
            p.id,
            p.name,
            strftime('%d', b.creation_date) as day,
            SUM(b.total_amount) as total_amount
        FROM bill b
        INNER JOIN provider p ON p.id = b.provider_id
        WHERE strftime('%Y', creation_date) = ? AND strftime('%m', creation_date) = ?
        GROUP BY provider_id, day
        ORDER BY day;
    `
	fmt.Println(query)
	rows, err := db.Query(query, fmt.Sprintf("%d", year), fmt.Sprintf("%02d", month))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Mapa para almacenar los totales por día
	resultMap := make(map[int][]r.BillProviderResponse) // Cambiado a int para 'day' y 'total_amount'

	for rows.Next() {
		var day int
		var totalAmount int
		var providerId int
		var providerName string
		err = rows.Scan(&providerId, &providerName, &day, &totalAmount)
		if err != nil {
			return nil, err
		}
		fmt.Println("row ", day, totalAmount, providerId, providerName)
		billProvider := r.BillProviderResponse{
			ProviderId:   providerId,
			ProviderName: providerName,
			TotalAmount:  totalAmount,
		}
		resultMap[day] = append(resultMap[day], billProvider)
	}

	// Crear los resultados finales con los días completos del mes
	var response []r.BillsProvidersDaySummary
	for _, day := range days {
		var providers []r.BillProviderResponse
		if provs, found := resultMap[day]; found {
			providers = provs
		}

		for pid, pname := range providerNames {
			exists := false
			for _, p := range providers {
				if pname == p.ProviderName {
					exists = true
					break
				}
			}
			if !exists {
				prov := r.BillProviderResponse{
					ProviderId:   pid,
					ProviderName: pname,
					TotalAmount:  0,
				}
				providers = append(providers, prov)
			}
		}

		response = append(response, r.BillsProvidersDaySummary{
			Day:       day,
			Providers: providers,
		})
	}

	return response, nil
}

func (e *BillRepository) GetProviderSummariesByMonthAndYearRange(startMonth int, startYear int, endMonth int, endYear int) ([]r.BillsProvidersMonthSummary, error) {
	db := database.GetDB()
	providerRepository := ProviderRepository{}

	dbProviders, err := providerRepository.GetProviders()
	if err != nil {
		return nil, err
	}

	providerNames := make(map[int]string)
	for _, prov := range dbProviders {
		providerNames[prov.ID] = prov.Name
	}

	// Consulta SQL para calcular totales por año-mes
	query := `
        SELECT
            p.id,
            p.name,
            strftime('%Y', creation_date) AS year,
            strftime('%m', creation_date) AS month,
            SUM(total_amount) AS total_amount
        FROM bill b
		INNER JOIN provider p ON p.id = b.provider_id
        WHERE (strftime('%Y', creation_date) || strftime('%m', creation_date)) BETWEEN ? AND ?
        GROUP BY provider_id, year, month
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

	resultMap := make(map[r.Period][]r.BillProviderResponse)
	for rows.Next() {
		var year int
		var month int
		var totalAmount int
		var providerId int
		var providerName string
		err = rows.Scan(&providerId, &providerName, &year, &month, &totalAmount)
		if err != nil {
			return nil, err
		}
		billProvider := r.BillProviderResponse{
			ProviderId:   providerId,
			ProviderName: providerName,
			TotalAmount:  totalAmount,
		}
		period := r.Period{
			Year:  year,
			Month: month,
		}
		resultMap[period] = append(resultMap[period], billProvider)
	}

	var response []r.BillsProvidersMonthSummary
	periods := helpers.GeneratePeriods(startMonth, startYear, endMonth, endYear)
	for _, period := range periods {
		var providers []r.BillProviderResponse
		if provs, found := resultMap[period]; found {
			providers = provs
		}

		for pid, pname := range providerNames {
			exists := false
			for _, p := range providers {
				if pname == p.ProviderName {
					exists = true
					break
				}
			}
			if !exists {
				prov := r.BillProviderResponse{
					ProviderId:   pid,
					ProviderName: pname,
					TotalAmount:  0,
				}
				providers = append(providers, prov)
			}
		}

		response = append(response, r.BillsProvidersMonthSummary{
			Year:      period.Year,
			Month:     period.Month,
			Providers: providers,
		})
	}

	return response, nil
}

func (e *BillRepository) GetCategorySummariesByMonthAndYear(month int, year int) ([]r.BillsCategoriesDaySummary, error) {
	db := database.GetDB()
	categoryRepository := BillCategoryRepository{}

	dbCategories, err := categoryRepository.GetBillCategories()
	if err != nil {
		return nil, err
	}

	categoryNames := make(map[int]string)
	for _, cat := range dbCategories {
		categoryNames[cat.ID] = cat.Name
	}

	// Obtener todos los días del mes
	days := helpers.GetDaysInMonth(year, month)

	query := `
        SELECT
            c.id,
            c.name,
            strftime('%d', b.creation_date) as day,
            SUM(b.total_amount) as total_amount
        FROM bill b
        INNER JOIN bill_category c ON c.id = b.category_id
        WHERE strftime('%Y', creation_date) = ? AND strftime('%m', creation_date) = ?
        GROUP BY provider_id, day
        ORDER BY day;
    `
	fmt.Println(query)
	rows, err := db.Query(query, fmt.Sprintf("%d", year), fmt.Sprintf("%02d", month))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Mapa para almacenar los totales por día
	resultMap := make(map[int][]r.BillCategoryResponse) // Cambiado a int para 'day' y 'total_amount'

	for rows.Next() {
		var day int
		var totalAmount int
		var categoryId int
		var categoryName string
		err = rows.Scan(&categoryId, &categoryName, &day, &totalAmount)
		if err != nil {
			return nil, err
		}
		fmt.Println("row ", day, totalAmount, categoryId, categoryName)
		billCategory := r.BillCategoryResponse{
			CategoryId:   categoryId,
			CategoryName: categoryName,
			TotalAmount:  totalAmount,
		}
		resultMap[day] = append(resultMap[day], billCategory)
	}

	// Crear los resultados finales con los días completos del mes
	var response []r.BillsCategoriesDaySummary
	for _, day := range days {
		var categories []r.BillCategoryResponse
		if provs, found := resultMap[day]; found {
			categories = provs
		}

		for pid, pname := range categoryNames {
			exists := false
			for _, p := range categories {
				if pname == p.CategoryName {
					exists = true
					break
				}
			}
			if !exists {
				prov := r.BillCategoryResponse{
					CategoryId:   pid,
					CategoryName: pname,
					TotalAmount:  0,
				}
				categories = append(categories, prov)
			}
		}

		response = append(response, r.BillsCategoriesDaySummary{
			Day:        day,
			Categories: categories,
		})
	}

	return response, nil
}

func (e *BillRepository) GetCategorySummariesByMonthAndYearRange(startMonth int, startYear int, endMonth int, endYear int) ([]r.BillsCategoriesMonthSummary, error) {
	db := database.GetDB()
	categoryRepository := BillCategoryRepository{}

	dbCategories, err := categoryRepository.GetBillCategories()
	if err != nil {
		return nil, err
	}

	categoryNames := make(map[int]string)
	for _, cat := range dbCategories {
		categoryNames[cat.ID] = cat.Name
	}

	// Consulta SQL para calcular totales por año-mes
	query := `
        SELECT
            c.id,
            c.name,
            strftime('%Y', creation_date) AS year,
            strftime('%m', creation_date) AS month,
            SUM(total_amount) AS total_amount
        FROM bill b
		INNER JOIN bill_category c ON c.id = b.provider_id
        WHERE (strftime('%Y', creation_date) || strftime('%m', creation_date)) BETWEEN ? AND ?
        GROUP BY provider_id, year, month
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

	resultMap := make(map[r.Period][]r.BillCategoryResponse)
	for rows.Next() {
		var year int
		var month int
		var totalAmount int
		var categoryId int
		var categoryName string
		err = rows.Scan(&categoryId, &categoryName, &year, &month, &totalAmount)
		if err != nil {
			return nil, err
		}
		billCategory := r.BillCategoryResponse{
			CategoryId:   categoryId,
			CategoryName: categoryName,
			TotalAmount:  totalAmount,
		}
		period := r.Period{
			Year:  year,
			Month: month,
		}
		resultMap[period] = append(resultMap[period], billCategory)
	}

	var response []r.BillsCategoriesMonthSummary
	periods := helpers.GeneratePeriods(startMonth, startYear, endMonth, endYear)
	for _, period := range periods {
		var categories []r.BillCategoryResponse
		if cats, found := resultMap[period]; found {
			categories = cats
		}

		for cid, cname := range categoryNames {
			exists := false
			for _, p := range categories {
				if cname == p.CategoryName {
					exists = true
					break
				}
			}
			if !exists {
				cat := r.BillCategoryResponse{
					CategoryId:   cid,
					CategoryName: cname,
					TotalAmount:  0,
				}
				categories = append(categories, cat)
			}
		}

		response = append(response, r.BillsCategoriesMonthSummary{
			Year:       period.Year,
			Month:      period.Month,
			Categories: categories,
		})
	}

	return response, nil
}
