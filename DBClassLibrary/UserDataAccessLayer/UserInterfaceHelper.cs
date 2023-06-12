using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.UserInterfaceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using static DBClassLibrary.UserDomainLayer.CWBModel.AutomaticStationList;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class UserInterfaceHelper : BaseRepository
    {
        public List<SelectOption> GetAppParamReservoirList(string Name)
        {
            string sqlStatement =
                @"
                    SELECT COALESCE(t3.Value,t1.value) Value,COALESCE(StationName,t3.Label) Name
                    FROM STRING_SPLIT(
	                    (
		                    SELECT value from tbl_AppParam  WHERE Category = 'Reservoir' AND Type = 'Group' AND Name = @Name
	                    ),',') AS t1
                    LEFT JOIN  [tbl_wsReservoirStations_fhy] AS t2  ON t1.value = t2.StationNo
					LEFT JOIN  tbl_AppParam AS t3 ON t1.value = '('+ t3.Value+')'
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement,
                new
                {
                    Name = Name,
                });

            return result.ToList();
        }

        public List<SelectOption> GetHasDataReservoirList()
        {
            string sqlStatement =
                @"
                    SELECT distinct(t1.StationNo) AS Value, t2.StationName AS Name
                    FROM[vwReservoirDataApplication] AS t1
                    Left join tbl_wsReservoirStations_fhy AS t2 ON t1.StationNo = t2.StationNo
                    order by t1.StationNo
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement);

            return result.ToList();
        }

        public List<SelectOption> GetIAList()
        {
            string sqlStatement =
                @"
                SELECT [IANo] AS Value,[Name] AS Name
                  FROM [tbl_IrrigationAssn]
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement);

            return result.ToList();
        }

        public List<SelectOption> GetHasDataReservoirYearList(string StationNo = "10201")
        {
            string sqlStatement =
                @"
                    SELECT distinct(YEAR(Time)) AS Value ,YEAR(Time)-1911  AS Name
                  FROM vwReservoirDataApplication
                  WHERE StationNo = @StationNo
                  ORDER BY YEAR(Time) DESC
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement, new {
                StationNo = StationNo
            });

            return result.ToList();
        }

        public List<SelectOption> GetSPIDataAreaOptionList()
        {
            //string sqlStatement =
            //    @"
            //        SELECT  distinct(DataArea) Name, DataArea Value
            //          FROM tbl_VariableScaleSPI
            //    ";

            string sqlStatement =
             @"
                SELECT  distinct(t2.LabelName) Name, t1.DataArea Value
                FROM tbl_VariableScaleSPI AS t1
                LEFT JOIN tbl_VariableScaleSPIInfo AS t2 ON t1.DataArea = t2.DataArea	
            ";
            var result = defaultDB.Query<SelectOption>(sqlStatement);

            return result.ToList();
        }

        public List<SelectOption> GetSPIDateRangeOptionList()
        {
            string sqlStatement =
                @"
                SELECT 
	                Value,
	                CASE 
		                WHEN MinDataTypeValue > MaxDataTypeValue 
		                THEN CAST(value AS NVARCHAR(3)) + '年' + CAST(Month(t2.StartDate) AS NVARCHAR(2)) + '月 - '+CAST((value+1) AS NVARCHAR(3)) + '年' + CAST(Month(t3.EndDate) AS NVARCHAR(2))+ '月'
		                WHEN MinDataTypeValue <= MaxDataTypeValue
		                THEN CAST(value AS NVARCHAR(3)) + '年' + CAST(Month(t2.StartDate) AS NVARCHAR(2)) + '月 - '+CAST((value) AS NVARCHAR(3)) + '年' + CAST(Month(t3.EndDate) AS NVARCHAR(2))+ '月'
	                END　Name
                FROM (
		                SELECT 
			                value,
			                CASE
				                WHEN MIN(i) >= 25 THEN MIN(i)-24
				                WHEN MIN(i) < 25 THEN MIN(i)+12
			                End MinDataTypeValue,
			                CASE
				                WHEN MAX(i) >= 25 THEN MAX(i)-24
				                WHEN MAX(i) < 25 THEN MAX(i)+12
			                END MaxDataTypeValue
		                FROM
		                (
			                SELECT 
				                YearValue,
				                DataTypeValue,
				                CASE
					                WHEN t1.DataTypeValue >= 13 THEN YearValue
					                WHEN t1.DataTypeValue < 13 THEN YearValue-1
				                END value,
				                CASE
					                WHEN t1.DataTypeValue >= 13 THEN t1.DataTypeValue-12
					                WHEN t1.DataTypeValue < 13 THEN t1.DataTypeValue+24
				                END i
			                FROM tbl_VariableScaleSPI AS t1
		                ) tbl_N1
                GROUP BY value
                )tbl_N2
                LEFT JOIN  vwTenDaysList AS t2 ON tbl_N2.MinDataTypeValue = t2.TenDayNo
                LEFT JOIN  vwTenDaysList AS t3 ON tbl_N2.MaxDataTypeValue = t3.TenDayNo
                ORDER BY value　DESC
  
                ";
            var result = defaultDB.Query<SelectOption>(sqlStatement);

            return result.ToList();
        }


        public List<SelectOption> GetDataSourceSummaryOptionList(BoundaryType boundaryType = BoundaryType.Reservoir)
        {
            string name_field = String.Empty;
            string join_stm  = String.Empty;
            
            switch (boundaryType)
            {
                case BoundaryType.Reservoir:
                    name_field = "t2.StationName Name";
                    join_stm = "LEFT JOIN tbl_wsReservoirStations_fhy t2 ON t2.StationNo =t1.BoundaryID";
                    break;
                case BoundaryType.IA:
                    name_field = "t2.IAName Name";
                    join_stm = "LEFT JOIN tbl_IAStation t2 ON t2.IANo =t1.BoundaryID";
                    break;
                case BoundaryType.WorkStation:
                    name_field = "t2.WorkStationName Name";
                    join_stm = "LEFT JOIN tbl_IAStation t2 ON t2.WorkStationId =t1.BoundaryID";
                    break;
            }
            string sqlStatement = 
                string.Format(
                    @"
                        SELECT * FROM (
	                        SELECT {0},BoundaryID value
	                        FROM (
		                        SELECT [BoundaryID]
		                        FROM [tbl_GridBoundaryEffectiveRainfallHistory]
		                         WHERE BoundaryType = @boundaryType
		                        GROUP BY BoundaryID
		                        UNION 
		                        SELECT [BoundaryID]
		                        FROM tbl_GridBoundaryEffectiveRainfallRealTime
		                         WHERE BoundaryType = @boundaryType
		                        GROUP BY BoundaryID
                                UNION
		                        SELECT [BoundaryID]
		                        FROM (
			                        select 1 BoundaryType, StationNo BoundaryID FROM tbl_wsReservoirSummaryHistory_fhy
		                        )temp
		                        WHERE   BoundaryType = @boundaryType
		                        GROUP BY BoundaryID
	                        )t1
	                        {1}
                        )data
	                    WHERE Name is not null
                         GROUP BY Name,Value
                         ORDER BY value asc
                    "
                , name_field, join_stm);
            var result = defaultDB.Query<SelectOption>(sqlStatement, new
            {
                boundaryType = boundaryType
            });

            return result.ToList();
        }


        public List<GridRainfallForecastDate> GetGridRainfallForecastDate()
        {
            //string sqlStatement =
            //    @"
            //        SELECT  distinct(DataArea) Name, DataArea Value
            //          FROM tbl_VariableScaleSPI
            //    ";

            string sqlStatement =
             @"
                SELECT MIN(DataTime)StartDate,DATEADD(day,6,DataTime)EndDate
                FROM tbl_GridCumulativeWeeklyRainfallForecast
                GROUP BY DataTime
                ORDER BY DataTime asc
            ";
            var result = defaultDB.Query<GridRainfallForecastDate>(sqlStatement);

            return result.ToList();
        }

    }

}
