import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React, { useEffect, useState } from "react";
import { getMonths, getYearsByStartYear } from "@/helpers/lists";
import { PeriodsRange } from "@/types/general";

type SelectStatsDatesProps = {
  keyPrefix: string,
  handleChange: Function,
}

const SelectStatsDates: React.FC<SelectStatsDatesProps> = ({keyPrefix, handleChange}) => {
  const months = getMonths();
  //desde el 2019 se registran ventas
  const years = getYearsByStartYear(2019);
  const [selectDatesRange, setSelectDatesRange] = useState<string>("1")
  const [selectedPeriods, setSelectedPeriods] = useState<PeriodsRange>({startPeriod: {year: years[0], month: months[0].id}, endPeriod: {year: -1, month: -1}});  

  const handlePeriodChange = (key:string, value:string, period:string) => {
    setSelectedPeriods({...selectedPeriods, [period]: {...selectedPeriods.startPeriod, [key]: parseInt(value)}})
  }

  useEffect(() => {
    handleChange(selectedPeriods);
  }, [selectedPeriods])

  return (
    <div className="flex flex-col justify-end items-start">      
      <RadioGroup defaultValue="1" value={selectDatesRange} onValueChange={(value) => setSelectDatesRange(value)} className="flex mb-2">
        <div className="flex items-center">
          <RadioGroupItem value="1" id={`${keyPrefix}StatsDatesNoRange`} className="text-blue-700 border-blue-700 mr-1"/>
          <Label htmlFor={`${keyPrefix}StatsDatesNoRange`} className="text-gray-800 font-semibold">Elegir mes/año</Label>
        </div>
        <div className="flex items-center">
          <RadioGroupItem value="2" id={`${keyPrefix}StatsDatesRange`} className="text-blue-700 border-blue-700 mr-1"/>
          <Label htmlFor={`${keyPrefix}StatsDatesRange`} className="text-gray-800 font-semibold">Elegir rango mes/año</Label>
        </div>
      </RadioGroup>
      {
        selectDatesRange === "1"
        &&
        <div className="flex gap-2 w-full">
        <Select value={selectedPeriods?.startPeriod.month.toString()} onValueChange={(value) => handlePeriodChange("month", value, "startPeriod")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {
              months.map(m => (
                <SelectItem value={m.id.toString()} key={`${keyPrefix}StatsDatesNoRangeMonth${m.id}`}>{m.name}</SelectItem>
              ))
            }            
          </SelectContent>
        </Select>
        <Select value={selectedPeriods?.startPeriod.year.toString()} onValueChange={(value) => handlePeriodChange("year", value, "startPeriod")}>          
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {
              years.map(y => (
                <SelectItem value={y.toString()} key={`${keyPrefix}StatsDatesNoRangeYear${y}`}>{y}</SelectItem>
              ))
            }            
          </SelectContent>
        </Select>
      </div>
      }  
      {
        selectDatesRange === "2"
        &&
        <div className="flex gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-gray-800">Desde:</span>
            <Select value={selectedPeriods?.startPeriod.month.toString()} onValueChange={(value) => handlePeriodChange("month", value, "startPeriod")}>          
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {
                  months.map(m => (
                    <SelectItem value={m.id.toString()} key={`${keyPrefix}StatsDatesStartRangeMonth${m.id}`}>{m.name}</SelectItem>
                  ))
                }      
              </SelectContent>
            </Select>
            <Select value={selectedPeriods?.startPeriod.year.toString()} onValueChange={(value) => handlePeriodChange("year", value, "startPeriod")}>          
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {
                  years.map(y => (
                    <SelectItem value={y.toString()} key={`${keyPrefix}StatsDatesStartRangeYear${y}`}>{y}</SelectItem>
                  ))
                }            
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-800">Hasta:</span>
            <Select value={selectedPeriods?.endPeriod.month.toString()} onValueChange={(value) => handlePeriodChange("month", value, "endPeriod")}>          
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {
                  months.map(m => (
                    <SelectItem value={m.id.toString()} key={`${keyPrefix}StatsDatesEndRangeMonth${m.id}`}>{m.name}</SelectItem>
                  ))
                }      
              </SelectContent>
            </Select>
            <Select value={selectedPeriods?.endPeriod.year.toString()} onValueChange={(value) => handlePeriodChange("year", value, "endPeriod")}>          
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {
                  years.map(y => (
                    <SelectItem value={y.toString()} key={`${keyPrefix}StatsDatesEndRangeYear${y}`}>{y}</SelectItem>
                  ))
                }           
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    </div>
  )
}

export default SelectStatsDates;