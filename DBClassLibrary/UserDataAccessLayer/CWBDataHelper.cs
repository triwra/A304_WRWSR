using DBClassLibrary.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBClassLibrary.UserDomainLayer.CWBModel;
using Dapper;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class CWBDataHelper : BaseRepository
    {
        #region 灌溉區域(雨量)

        /// <summary>
        /// 自動氣象站-氣象觀測資料, 已有資料最新的日期
        /// </summary>
        /// <returns></returns>
        public DateTime GetAutomaticStationWeatherLastDateTime()
        {
            string sqlStatement =
                @"SELECT Top (1) obsTime
                    FROM tbl_AutomaticStationWeather
                    Order by stationID desc,obsTime desc ";

            var sqlParams = new
            {

            };

            var result = defaultDB.Query<AutomaticStationWeather.DB>(sqlStatement, sqlParams);
            if (result.FirstOrDefault() != null)
                return result.FirstOrDefault().obsTime;
            else
                return DateTime.MinValue;
        }

        /// <summary>
        /// 自動雨量站-雨量觀測資料, 已有資料最新的日期
        /// </summary>
        /// <returns></returns>
        public DateTime GetAutomaticStationRainfallLastDateTime()
        {
            string sqlStatement =
                @"SELECT TOP (1) obsTime
                    FROM tbl_AutomaticStationRainfall
                    Order by stationID desc,obsTime desc ";

            var sqlParams = new
            {

            };

            var result = defaultDB.Query<AutomaticStationRainfall.DB>(sqlStatement, sqlParams);
            if (result.FirstOrDefault() != null)
                return result.FirstOrDefault().obsTime;
            else
                return DateTime.MinValue;
        }

        #endregion 灌溉區域(雨量)

        #region 其他(預報資料)

        /// <summary>
        /// 新增長期天氣預報-月長期天氣展望        
        /// </summary>
        /// <param name="weatherForecasMonthData"></param>
        /// <returns></returns>
        public int InsertWeatherForecastMonthData(List<WeatherForecastMonthClass> weatherForecasMonthData)
        {
            string sql = @"INSERT INTO tbl_WeatherMonthForecast
					     (publicDate,publicDataCategory, publicDataType, publicDataArea,startDate, 
                        endDate,lowerProbability,normalProbability,higherProbability,measureUnit)
					        SELECT       
					            @publicDate, @publicDataCategory, @publicDataType,@publicDataArea,
                               @startDate, @endDate, @lowerProbability, @normalProbability, 
                             @higherProbability, @measureUnit
                            WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_WeatherMonthForecast 
                                    WHERE publicDate = @publicDate AND publicDataCategory = @publicDataCategory
                                     AND publicDataType = @publicDataType AND publicDataArea = @publicDataArea) ";
            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, weatherForecasMonthData);
                else
                    executeResult = defaultDB.Execute(sql, weatherForecasMonthData, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 長期天氣預報-季長期天氣展望
        /// </summary>
        /// <param name="weatherForecasSeasonData"></param>
        /// <returns></returns>
        public int InsertWeatherForecastSeasonData(List<WeatherForecastSeasonClass> weatherForecasSeasonData)
        {
            string sql = @"INSERT INTO tbl_WeatherSeasonForecast
					     (publicDate,publicDataCategory, publicDataType, publicDataArea,
                          dateTime,lowerProbability,normalProbability,higherProbability,measureUnit)
					        SELECT       
					           @publicDate, @publicDataCategory, @publicDataType,@publicDataArea,
                               @dateTime,  @lowerProbability, @normalProbability, 
                               @higherProbability, @measureUnit
                            WHERE NOT EXISTS 
                                (SELECT 1 FROM tbl_WeatherSeasonForecast 
                                 WHERE 
                                    publicDate = @publicDate 
                                    AND publicDataCategory = @publicDataCategory
                                    AND publicDataType = @publicDataType 
                                    AND publicDataArea = @publicDataArea) ";
            int executeResult = 0;
            try
            {
                if (UsingTransaction == null)
                    executeResult = defaultDB.Execute(sql, weatherForecasSeasonData);
                else
                    executeResult = defaultDB.Execute(sql, weatherForecasSeasonData, UsingTransaction);
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
            return executeResult;
        }

        /// <summary>
        /// 計算 7日累積雨量預報格點資料 01-20種系集預報平均
        /// 計算完成的平均值, 依網格點對照表, 從1~42158(資料網格數), 對映到陸地網格點
        /// </summary>
        /// <returns></returns>
        public List<WeeklyRainfallForecast> GetAverageGridCumulativeWeeklyRainfallForecast()
        {
            //Info 為陸地網格點名單
            //AvgData 為計算完成的平均值 (FType 為1~20 的系集)
            string sqlStatement =
                @"
	                With Info as (
		                SELECT ROW_NUMBER() OVER (ORDER BY GridNumber ASC) as ROW_ID, GridNumber
		                FROM           tbl_GridInfo
		                WHERE        (GridType <> 0) AND (GridSize = 1)
	                ),
	                AvgData as (
	                    SELECT   GridNumber, DataTime, AVG(RainValue) AS RainValue
		                FROM           tbl_GridCumulativeWeeklyRainfallForecast
		                WHERE        (FType > 0)
		                GROUP BY  GridNumber, DataTime
	                )
	                Select Info.GridNumber, AvgData.DataTime, AvgData.RainValue 
	                  FROM AvgData
		                   Inner JOIN Info ON Info.ROW_ID = AvgData.GridNumber
                ";

            var result = defaultDB.Query<WeeklyRainfallForecast>(sqlStatement);

            foreach (var item in result)
            {
                item.FType = 0; //代表平圴
            }
            return result.ToList();
        }

        #endregion 其他(預報資料)

    }
}
