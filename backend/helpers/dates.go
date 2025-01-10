package helpers

import (
	"dashboard/responses"
	"time"
)

func GetDaysInMonth(year, month int) []int {
	// Obtener el primer y último día del mes
	location := time.UTC
	firstDay := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, location)
	lastDay := firstDay.AddDate(0, 1, -1)

	// Crear un slice con los días del mes
	var days []int
	for d := firstDay; d.Before(lastDay.AddDate(0, 0, 1)); d = d.AddDate(0, 0, 1) {
		days = append(days, d.Day()) // Solo agregamos el día como int
	}
	return days
}

func GeneratePeriods(startMonth, startYear, endMonth, endYear int) []responses.Period {
	var result []responses.Period

	// Calcula la cantidad total de meses entre las fechas
	for y := startYear; y <= endYear; y++ {
		start := 1
		end := 12

		// Ajusta los límites del mes para el primer y último año
		if y == startYear {
			start = startMonth
		}
		if y == endYear {
			end = endMonth
		}

		// Agrega cada mes del año actual
		for m := start; m <= end; m++ {
			result = append(result, responses.Period{Month: m, Year: y})
		}
	}

	return result
}
