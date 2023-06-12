using Dapper;
using DBClassLibrary.Data;
using DBClassLibrary.UserDomainLayer;
using DBClassLibrary.UserDomainLayer.CommonDataModel;
using DBClassLibrary.UserDomainLayer.RainModel;
using DBClassLibrary.UserDomainLayer.ReservoirModel;
using System;
using System.Collections.Generic;
using System.Linq;
using static DBClassLibrary.UserDomainLayer.IrrigationPlanModel;
using PiField = DBClassLibrary.UserDomainLayer.ReservoirModel.PiField;
using PiType = DBClassLibrary.UserDomainLayer.ReservoirModel.PiType;
using SummaryType = DBClassLibrary.UserDomainLayer.SummaryType;

namespace DBClassLibrary.UserDataAccessLayer
{
    public class RainDataHelper : BaseRepository
    {
        #region 即時雨量相關
        /// <summary>
        /// 最新一筆資料時間
        /// </summary>
        /// <param name="TableName"></param>
        /// <param name="FieldName"></param>
        /// <returns></returns>
        public DateTime GetMAXTime(string TableName, string FieldName)
        {
            try
            {
                string sqlStatement =
                    string.Format(
                        @"SELECT Top 1 {1} AS MAXTime FROM {0}
                            Order By {1} desc", TableName, FieldName);
                var result = defaultDB.Query<DateTime>(sqlStatement).FirstOrDefault();

                return result == DateTime.MinValue ? DateTime.Now.AddHours(-1) : result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 計算嘉南會的雨量累積值(用來補充即時資料的其他欄位) (嘉南雨量站)        
        /// </summary>
        /// <param name="DataTime">開始時間</param>
        /// <param name="StationNo"></param>
        /// <param name="hour">往前推算小時</param>
        /// <returns></returns>
        public decimal? GetSumHourRainfallRealTimeInfo_CN(DateTime StartDate, DateTime EndDate, string StationNo)
        {
            try
            {
                //DateTime StartDate = DataTime.AddHours(-hour);
                //DateTime EndDate = DataTime;
                //小時雨量累積值
                string sqlStatement =
                    @"
                        SELECT        SUM(H1) AS SumValue
                        FROM           tbl_RainfallRealTimeInfo_CN
                        WHERE       
                                (DataTime BETWEEN @StartDate AND @EndDate)
                            AND DATEPART(minute, DataTime) = @Minute
                        GROUP BY  StationNo
                        HAVING        (StationNo = @StationNo)
                        ";

                var result = defaultDB.Query<decimal?>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo,
                        StartDate = StartDate,
                        EndDate = EndDate,
                        Minute = EndDate.Minute
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 灌區各站的權重
        /// </summary>
        /// <param name="DataTime"></param>
        /// <returns></returns>
        public List<RainStationRealTimeWeight> GetAverageRainValueRealtimeWithWeight(int AreaID)
        {
            try
            {
                string sqlStatement =
                    @"
                    SELECT        AreaID, StationNo, StationCode, StationName, SourceType, Weight, 
                    Backup1Name, Backup1Code, Backup1SourceType, Backup2Name, Backup2Code, 
                                         Backup2SourceType
                    FROM           tbl_RainStationRealTimeWeightList
                    WHERE        (AreaID = @AreaID)
                     ";

                var result = defaultDB.Query<RainStationRealTimeWeight>(
                    sqlStatement,
                    new
                    {
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得雨量站權重資料(即時)
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public RainStationRealTimeWeight GetRainStationRealTimeWeight(string StationNo)
        {
            try
            {
                string sqlStatement =
                    @"
                        SELECT        *
                        FROM           tbl_RainStationRealTimeWeightList
                        WHERE       (StationNo = @StationNo)                 
                     ";

                var result = defaultDB.Query<RainStationRealTimeWeight>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得指定時間, 雨量站的雨量
        /// </summary>
        /// <param name="DataTime"></param>
        /// <param name="StationNo"></param>
        /// <param name="SourceType"></param>
        /// <returns></returns>
        public RainFallData2 GetRainfallRealTimeInfo(DateTime DataTime, string StationNo, string SourceType)
        {
            try
            {
                string sqlStatement = string.Empty;

                switch (SourceType)
                {
                    case "CN":
                        sqlStatement = @"
                            SELECT        StationNo, DataTime, M10, H1, D1, 'CN' AS SourceType
                            FROM           tbl_RainfallRealTimeInfo_CN
                            WHERE        StationNo = @StationNo AND DataTime = @DataTime
                            ";
                        break;
                    case "CWB":
                        sqlStatement = @"
                            SELECT        StationNo, DataTime, M10, H1, Day1 as D1, 'CWB' AS SourceType
                            FROM           tbl_RainfallRealTimeInfo_CWB
                            WHERE   StationNo = @StationNo AND DataTime = @DataTime
                            ";
                        break;
                    case "WRASB":   //南水局的雨量站
                        sqlStatement = @"
                            SELECT        StationNo, DataTime, M10, H1, D1, 'WRASB' AS SourceType
                            FROM           tbl_RainfallRealTimeInfo_WRASB
                            WHERE   StationNo = @StationNo AND DataTime = @DataTime
                            ";
                        break;
                    default:
                        sqlStatement = string.Empty;
                        break;
                }

                if (sqlStatement == string.Empty)
                    return null;

                var result = defaultDB.Query<RainFallData2>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo,
                        DataTime = DataTime
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得指定時間, 灌區的平均雨量
        /// </summary>
        /// <param name="DataTime"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public RainValueAverage CalcAverageRainValueRealTime(DateTime DataTime, int AreaID)
        {
            try
            {
                DataTime = Convert.ToDateTime(DataTime.ToString("yyyy/MM/dd") + " 23:50");

                string sqlStatement =
                    @"
                        SELECT        AreaID, DataTime, D1 AS RainValue
                        FROM           tbl_GridBoundaryRainfallRealTime
                        WHERE        DataTime = @DataTime AND AreaID = @AreaID         
                     ";

                var result = defaultDB.Query<RainValueAverage>(
                    sqlStatement,
                    new
                    {
                        DataTime = DataTime,
                        AreaID = AreaID
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得最新一筆 每日即時平均雨量計算的記錄
        /// </summary>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public RainValueAverage GetLastRainfallAverageRealTime(int AreaID)
        {
            try
            {
                string sqlStatement =
                    @"
                        SELECT        TOP (1) 
                                AreaID, DataTime, RainValue, RainValueEffective, 
                                RainValueSigma, RainValueEffectiveLimit, Duration
                        FROM           tbl_RainfallAverageRealTime
                        WHERE        (AreaID = @AreaID)
                        ORDER BY  DataTime DESC
                    ";

                var result = defaultDB.Query<RainValueAverage>(
                    sqlStatement,
                    new
                    {
                        AreaID = AreaID
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        #endregion 即時雨量相關

        #region 歷史雨量相關

        /// <summary>
        /// 取得雨量站權重資料
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public RainStationWeight GetRainStationWeight(string StationNo)
        {
            try
            {
                string sqlStatement =
                    @"
                        SELECT        StationNo, StationCode, SourceType, AreaID, StationName, Weight
                        FROM           tbl_RainStationWeightList
                        WHERE       (StationNo = @StationNo)                 
                     ";

                var result = defaultDB.Query<RainStationWeight>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得指定時間, 灌區的平均雨量
        /// </summary>
        /// <param name="DataTime"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public RainValueAverage CalcAverageRainValueHistroy(DateTime DataTime, int AreaID)
        {
            try
            {
                /* 將每日各站雨量*各站權重後，加總即每日之平均雨量
                 * EX.新營區10站該日雨量*各站權重，加總得到新營區該日平均雨量值 */
                string sqlStatement =
                    @"
                    SELECT      W.AreaID, H.DataTime, 
                                SUM(CAST(H.RainValue * W.Weight AS decimal(10, 1))) AS RainValue
                    FROM           tbl_RainStationWeightList AS W INNER JOIN
                                            tbl_RainfallDataHistory AS H ON W.StationNo = H.StationNo
                    WHERE        (H.DataTime = @DataTime)
                             AND (W.AreaID = @AreaID)
                             AND (H.RainValue >= 0)
                    GROUP BY  W.AreaID, H.DataTime
                    ORDER BY  H.DataTime                  
                     ";

                var result = defaultDB.Query<RainValueAverage>(
                    sqlStatement,
                    new
                    {
                        DataTime = DataTime,
                        AreaID = AreaID
                    }).FirstOrDefault();

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        /// <summary>
        /// 取得歷史平均雨量累積值大於 平均雨量門檻 的記錄
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="AreaID"></param>
        /// <param name="RainLimit">平均雨量門檻</param>
        /// <returns></returns>
        public List<RainValueAverage> GetAverageRainValueWithRainHistroy(
            DateTime startDate, DateTime endDate, int AreaID, int RainLimit)
        {
            try
            {
                string sqlStatement =
                    @"
                        SELECT        AreaID, DataTime, RainValue, RainValueEffective, RainValueSigma, 
                                      RainValueEffectiveLimit, Duration
                        FROM           tbl_RainfallAverageHistroy
                        WHERE        (DataTime Between @startDate And @endDate)
                                 AND (RainValueSigma > @RainLimit)
                                 AND (AreaID = @AreaID)
                        ORDER BY AreaID, DataTime
                     ";

                var result = defaultDB.Query<RainValueAverage>(
                    sqlStatement,
                    new
                    {
                        startDate = startDate,
                        endDate = endDate,
                        AreaID = AreaID,
                        RainLimit = RainLimit
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        #endregion 歷史雨量相關

        #region 查詢相關

        /// <summary>
        /// 查詢各灌區即時平均雨量值
        /// </summary>
        /// <returns></returns>

        public List<QueryRainValueAverageDuration> QueryAreaAverageRainValueRealTime(
           DateTime dataTime = default(DateTime))
        {
            dataTime = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd"));
            try
            {
                string strSqlCondition = string.Empty;

                //處理預設的期間
                if (dataTime == DateTime.MinValue)
                {
                    strSqlCondition = @" D.DataTime = 
	                        (SELECT        Max(DataTime) AS DataTime
	                        FROM           tbl_GridBoundaryRainfallRealTime) ";
                }
                else
                {
                    strSqlCondition = " D.DataTime = @DataTime ";
                }

                /*
                string sqlStatement =
                    string.Format(@"
                        SELECT        D.AreaID, A.AreaName, D.DataTime, D.M10, D.H1, D.D1
                        FROM           tbl_GridBoundaryRainfallRealTime AS D INNER JOIN
                                        tbl_IrrigationAreaInfo AS A ON D.AreaID = A.AreaID
                        WHERE        {0}
						ORDER BY AreaID ASC
                        ", strSqlCondition);
                */
                string sqlStatement =
                    string.Format(@"
                                    SELECT BoundaryID as AreaID, a.Name as AreaName, 0 as M10, 0 as H1,t.Rain as D1,t.DataTime
                                    FROM [A304_WRWSR].[dbo].[tbl_GridBoundaryRainfallRealTime]  t
                                    join [tbl_IrrigationAssn] a on a.IANo=t.BoundaryID
                                     where BoundaryType=3  and t.DataTime=(SELECT MAX(DataTime) from [A304_WRWSR].[dbo].[tbl_GridBoundaryRainfallRealTime]) 
order by BoundaryID asc 
                       
            ");

                var result = defaultDB.Query<QueryRainValueAverageDuration>(
                  sqlStatement,
                  new
                  {
                      DataTime = dataTime
                  });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public List<QueryRainValueAverageDuration> QueryAreaAverageRainValueRealTime_20220729(
            DateTime dataTime = default(DateTime))
        {
            dataTime = Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd"));
            try
            {
                string strSqlCondition = string.Empty;

                //處理預設的期間
                if (dataTime == DateTime.MinValue)
                {
                    strSqlCondition = @" D.DataTime = 
	                        (SELECT        Max(DataTime) AS DataTime
	                        FROM           tbl_GridBoundaryRainfallRealTime) ";
                }
                else
                {
                    strSqlCondition = " D.DataTime = @DataTime ";
                }

                /*
                string sqlStatement =
                    string.Format(@"
                        SELECT        D.AreaID, A.AreaName, D.DataTime, D.M10, D.H1, D.D1
                        FROM           tbl_GridBoundaryRainfallRealTime AS D INNER JOIN
                                        tbl_IrrigationAreaInfo AS A ON D.AreaID = A.AreaID
                        WHERE        {0}
						ORDER BY AreaID ASC
                        ", strSqlCondition);
                */
                string sqlStatement =
                    string.Format(@"
              SELECT        D.BoundaryID, A.WorkStationName as AreaName, D.DataTime, 0 as M10, D.Rain as H1,D.Rain  as D1
                        FROM           tbl_GridBoundaryRainfallRealTime AS D INNER JOIN
                                        (SELECT  [Id]
                                          ,[BoundaryID]
                                          ,[BoundaryType]
                                          ,[DataTime]
                                          ,[Rain],i.WorkStationName, i.iaName

                                      FROM (select * from  [A304_WRWSR].[dbo].[tbl_GridBoundaryRainfallRealTime] where DataTime = @DataTime) t
                                      join [tbl_IAStation] i on t.BoundaryID=i.WorkStationId
                                      where  BoundaryType=3)   A 
                                     ON D.BoundaryID = A.BoundaryID 
                                             WHERE        {0}
						ORDER BY D.BoundaryID ASC
            ", strSqlCondition);

                var result = defaultDB.Query<QueryRainValueAverageDuration>(
                  sqlStatement,
                  new
                  {
                      DataTime = dataTime
                  });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<RealTimeRainMaxMinDataTime> GetMaxMinAvgRainValueRealTimeDataTime(int AreaID = 0)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = "AND (AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                        string.Format(@"
                                SELECT MAX(DataTime) MaxDataTime, MIN(DataTime)MinDataTime
                                FROM tbl_GridBoundaryRainfallRealTime
                                WHERE 1=1 {0}
                            ", strSqlCondition);

                var result = defaultDB.Query<RealTimeRainMaxMinDataTime>(
                    sqlStatement,
                    new
                    {
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 查詢灌區各站的即時雨量(來源嘉南會, 氣象局, 南水局)
        /// </summary>
        /// <param name="DataTime"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallRealTimeInfo> QueryRainfallRealTimeInfo(DateTime DataTime, string AreaID)
        {

            //AreaID = "12";
            string strSqlCondition = string.Empty;

            if (DataTime == DateTime.Today)
            {
                strSqlCondition = "  AND DataTime = (SELECT MAX(DataTime) FROM tbl_GridBoundaryRainfallRealTime) ";
            }
            else
            {
                strSqlCondition = "  AND DataTime = (SELECT MAX(DataTime) FROM tbl_GridBoundaryRainfallRealTime  WHERE DataTime<=DATEADD(hour,24,@DataTime1) AND  DataTime>@DateTime2) ";
            }

            try
            {

                string sqlStatement =
                    string.Format(@"

					SELECT BoundaryID as AreaID, a.IAName as AreaName,a.WorkStationName as  StationName, '3' as SourceType,  t.Id as StationNo,
                    DataTime, 0 as M10, 0 as  M10, 0 as  M30, 0 as  H1, 0 as  H2, 0 as  H6, 0 as  H12, 0 as  H24, 0 as  H48, t.Rain  as D1, 0 as  D2, 0 as  D3
                      FROM [A304_WRWSR].[dbo].[tbl_GridBoundaryRainfallRealTime]  t
                      join [tbl_IAStation] a on a.WorkStationId=t.BoundaryID
                      where BoundaryType=5  and a.IANo=@AreaID {0} order by DataTime desc
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallRealTimeInfo>(
                    sqlStatement,
                    new
                    {
                        DataTime1 = DataTime,
                        DateTime2 = DataTime,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<QueryRainfallRealTimeInfo> QueryRainfallRealTimeInfo_20220729(DateTime DataTime, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND (A.AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                    SELECT      A.AreaID, A.AreaName, W.StationName, W.SourceType, R.StationNo, 
                                R.DataTime, R.M10, R.M30, R.H1, R.H2, R.H6, R.H12, R.H24, R.H48, R.D1, R.D2, R.D3
                    FROM           tbl_RainfallRealTimeInfo_CN AS R INNER JOIN
                                         tbl_RainStationRealTimeWeightList AS W ON R.StationNo = W.StationNo INNER JOIN
                                         tbl_IrrigationAreaInfo AS A ON W.AreaID = A.AreaID
                    WHERE      (W.SourceType = N'CN') AND (R.DataTime = @DataTime) {0} 

					UNION

                    SELECT      A.AreaID, A.AreaName, W.StationName, W.SourceType, R.StationNo, 
                                R.DataTime, R.M10, NULL as M30, R.H1, NULL as H2, R.H6, R.H12, R.H24, 
                                NULL as H48, R.Day1 as D1, R.Day2 asD2, R.Day3 as D3
                    FROM           tbl_RainfallRealTimeInfo_CWB AS R INNER JOIN
                                         tbl_RainStationRealTimeWeightList AS W ON R.StationNo = W.StationNo INNER JOIN
                                         tbl_IrrigationAreaInfo AS A ON W.AreaID = A.AreaID
                    WHERE      (W.SourceType = N'CWB') AND (R.DataTime = @DataTime) {0}  

                    UNION

                    SELECT      A.AreaID, A.AreaName, W.StationName, W.SourceType, R.StationNo, 
                                R.DataTime, R.M10, R.M30, R.H1, R.H2, R.H6, R.H12, R.H24, R.H48, R.D1, R.D2, R.D3
                    FROM           tbl_RainfallRealTimeInfo_WRASB AS R INNER JOIN
                                         tbl_RainStationRealTimeWeightList AS W ON R.StationNo = W.StationNo INNER JOIN
                                         tbl_IrrigationAreaInfo AS A ON W.AreaID = A.AreaID
                    WHERE      (W.SourceType = N'WRASB') AND (R.DataTime = @DataTime) {0}
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallRealTimeInfo>(
                    sqlStatement,
                    new
                    {
                        DataTime = DataTime,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        /// <summary>
        /// 查詢各灌區即時平均雨量值
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallHistoryInfo> QueryAreaAverageRainValueReal(string year, string month, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND ( AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                        SELECT * FROM
                        (
	                        SELECT	t1.[AreaID], t2.AreaName ,[RainValue]
			                        ,t3.RainVal_Max_M,t3.RainVal_SUM_M,t3.RainVal_Count_M
			                        ,t4.RainVal_SUM_Y,
			                        YEAR(DataTime) AS Year,
			                        Month(DataTime) AS Month,
			                        'D'+CONVERT(varchar(2), Day(DataTime)) AS Day
	                        FROM tbl_RainfallAverageRealTime AS t1
	                        Left join tbl_IrrigationAreaInfo AS t2 ON t1.AreaID = t2.AreaID
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,MONTH(DataTime) AS Month
				                        ,MAX([RainValue]) AS RainVal_Max_M
				                        ,SUM([RainValue]) AS RainVal_SUM_M
                                        ,Count(NULLIF([RainValue],0)) AS RainVal_Count_M
		                        FROM tbl_RainfallAverageRealTime AS t1
		                        GROUP BY YEAR(DataTime), MONTH(DataTime) ,t1.[AreaID]
	                        ) AS t3 ON t1.AreaID = t3.AreaID AND YEAR(t1.DataTime) = t3.Year AND MONTH(t1.DataTime) = t3.Month
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,SUM([RainValue]) AS RainVal_SUM_Y
		                        FROM tbl_RainfallAverageRealTime AS t1
		                        GROUP BY YEAR(DataTime) ,t1.[AreaID]
                        ) AS t4 ON t1.AreaID = t4.AreaID AND YEAR(t1.DataTime) = t4.Year
                        ) AS T1
                        PIVOT(
	                        MAX(RainValue)
	                        FOR Day in([D1],[D2],[D3],[D4],[D5],[D6],[D7],[D8],[D9],[D10],
	                        [D11],[D12],[D13],[D14],[D15],[D16],[D17],[D18],[D19],[D20],
	                        [D21],[D22],[D23],[D24],[D25],[D26],[D27],[D28],[D29],[D30],[D31])
                        ) AS t2
                        WHERE  (Year >= 2000) AND (Year = @year) AND (Month = @month){0}
                        ORDER BY AreaID, Year, Month
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallHistoryInfo>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        Month = month,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 查詢各灌區即時有效雨量值
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallHistoryInfo> QueryAreaEffectiveRainValueReal(string year, string month, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND ( AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                        SELECT * FROM
                        (
	                        SELECT	t1.[AreaID], t2.AreaName ,[RainValueEffectiveLimit]
			                        ,t3.RainVal_Max_M,t3.RainVal_SUM_M,t3.RainVal_Count_M
			                        ,t4.RainVal_SUM_Y,
			                        YEAR(DataTime) AS Year,
			                        Month(DataTime) AS Month,
			                        'D'+CONVERT(varchar(2), Day(DataTime)) AS Day
	                        FROM tbl_RainfallAverageRealTime AS t1
	                        Left join tbl_IrrigationAreaInfo AS t2 ON t1.AreaID = t2.AreaID
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,MONTH(DataTime) AS Month
				                        ,MAX([RainValueEffectiveLimit]) AS RainVal_Max_M
				                        ,SUM([RainValueEffectiveLimit]) AS RainVal_SUM_M
                                        ,Count(NULLIF([RainValueEffectiveLimit],0)) AS RainVal_Count_M
		                        FROM tbl_RainfallAverageRealTime AS t1
		                        GROUP BY YEAR(DataTime), MONTH(DataTime) ,t1.[AreaID]
	                        ) AS t3 ON t1.AreaID = t3.AreaID AND YEAR(t1.DataTime) = t3.Year AND MONTH(t1.DataTime) = t3.Month
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,SUM([RainValueEffectiveLimit]) AS RainVal_SUM_Y
		                        FROM tbl_RainfallAverageRealTime AS t1
		                        GROUP BY YEAR(DataTime) ,t1.[AreaID]
                        ) AS t4 ON t1.AreaID = t4.AreaID AND YEAR(t1.DataTime) = t4.Year
                        ) AS T1
                        PIVOT(
	                        MAX(RainValueEffectiveLimit)
	                        FOR Day in([D1],[D2],[D3],[D4],[D5],[D6],[D7],[D8],[D9],[D10],
	                        [D11],[D12],[D13],[D14],[D15],[D16],[D17],[D18],[D19],[D20],
	                        [D21],[D22],[D23],[D24],[D25],[D26],[D27],[D28],[D29],[D30],[D31])
                        ) AS t2
                        WHERE  (Year >= 2000) AND (Year = @year) AND (Month = @month){0}
                        ORDER BY AreaID, Year, Month
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallHistoryInfo>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        Month = month,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 查詢各灌區歷史平均雨量值
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallHistoryInfo> QueryAreaAverageRainValueHistory(string year, string month, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND ( AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                        SELECT * FROM
                        (
	                        SELECT	t1.[AreaID], t2.AreaName ,[RainValue]
			                        ,t3.RainVal_Max_M,t3.RainVal_SUM_M,t3.RainVal_Count_M
			                        ,t4.RainVal_SUM_Y,
			                        YEAR(DataTime) AS Year,
			                        Month(DataTime) AS Month,
			                        'D'+CONVERT(varchar(2), Day(DataTime)) AS Day
	                        FROM [tbl_RainfallAverageHistroy] AS t1
	                        Left join tbl_IrrigationAreaInfo AS t2 ON t1.AreaID = t2.AreaID
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,MONTH(DataTime) AS Month
				                        ,MAX([RainValue]) AS RainVal_Max_M
				                        ,SUM([RainValue]) AS RainVal_SUM_M
                                        ,Count(NULLIF([RainValue],0)) AS RainVal_Count_M
		                        FROM [tbl_RainfallAverageHistroy] AS t1
		                        GROUP BY YEAR(DataTime), MONTH(DataTime) ,t1.[AreaID]
	                        ) AS t3 ON t1.AreaID = t3.AreaID AND YEAR(t1.DataTime) = t3.Year AND MONTH(t1.DataTime) = t3.Month
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,SUM([RainValue]) AS RainVal_SUM_Y
		                        FROM [tbl_RainfallAverageHistroy] AS t1
		                        GROUP BY YEAR(DataTime) ,t1.[AreaID]
                        ) AS t4 ON t1.AreaID = t4.AreaID AND YEAR(t1.DataTime) = t4.Year
                        ) AS T1
                        PIVOT(
	                        MAX(RainValue)
	                        FOR Day in([D1],[D2],[D3],[D4],[D5],[D6],[D7],[D8],[D9],[D10],
	                        [D11],[D12],[D13],[D14],[D15],[D16],[D17],[D18],[D19],[D20],
	                        [D21],[D22],[D23],[D24],[D25],[D26],[D27],[D28],[D29],[D30],[D31])
                        ) AS t2
                        WHERE  (Year >= 2000) AND (Year = @year) AND (Month = @month){0}
                        ORDER BY AreaID, Year, Month
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallHistoryInfo>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        Month = month,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 查詢灌區各站的歷史雨量
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallHistoryInfo> QueryRainfallHistoryInfo(string year, string month, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND (AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                        With tbl_basic AS(
                            SELECT  t3.AreaID, t4.AreaName, t1.StationNo,t2.StationName,
			                        t1.DataTime,
			                        YEAR(t1.DataTime) AS Year,
			                        Month(t1.DataTime) AS Month,
			                        'D'+CONVERT(varchar(2), Day(t1.DataTime)) AS Day,t1.RainValue
	                        FROM [tbl_RainfallDataHistory] AS t1
	                        Left join tbl_RainStationList AS t2 ON t1.StationNo = t2.StationNo
	                        Left join tbl_RainStationRealTimeWeightList AS t3 ON t1.StationNo = t3.StationNo
	                        Left join tbl_IrrigationAreaInfo AS t4 ON t3.AreaID = t4.AreaID
                        )

                        SELECT * FROM(
	                        SELECT  t1.AreaID, t1.AreaName, t1.StationNo, t1.StationName, 
			                        t1.Year, t1.Month, t1.Day, t1.RainValue,
			                        t5.RainVal_Max_M, t5.RainVal_SUM_M, t5.RainVal_Count_M, t6.RainVal_SUM_Y
	                        FROM tbl_basic AS t1
	                        Left join
	                        (
		                        SELECT AreaID, AreaName, StationNo, StationName, Year ,Month
			                        ,MAX([RainValue]) AS RainVal_Max_M
			                        ,SUM([RainValue]) AS RainVal_SUM_M
			                        ,Count([RainValue]) AS RainVal_Count_M
		                        FROM tbl_basic 
                                WHERE RainValue != 0 AND RainValue is not null
		                        GROUP BY Year, Month ,AreaID, AreaName, StationNo, StationName
	                        )AS t5  ON t1.AreaID = t5.AreaID AND t1.StationNo = t5.StationNo AND YEAR(t1.DataTime) = t5.Year AND MONTH(t1.DataTime) = t5.Month
	                        Left join
	                        (
		                        SELECT  AreaID, AreaName, StationNo, StationName, Year
				                        ,SUM(RainValue) AS RainVal_SUM_Y
		                        FROM tbl_basic AS t1
		                        GROUP BY Year, AreaID, AreaName, StationNo, StationName
	                        )AS t6  ON t1.AreaID = t6.AreaID AND t1.StationNo = t6.StationNo AND YEAR(t1.DataTime) = t6.Year
                        ) AS T1
                        PIVOT(
	                        MAX(RainValue)
	                        FOR Day in([D1],[D2],[D3],[D4],[D5],[D6],[D7],[D8],[D9],[D10],
	                        [D11],[D12],[D13],[D14],[D15],[D16],[D17],[D18],[D19],[D20],
	                        [D21],[D22],[D23],[D24],[D25],[D26],[D27],[D28],[D29],[D30],[D31])
                        ) AS t2
                        WHERE  (Year = @year) AND (Month = @month){0}
                        ORDER BY AreaID, StationNo, Year, Month
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallHistoryInfo>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        Month = month,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        ///取得個灌區當月份每日即時雨量
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<QueryRainfallHistoryInfo> QueryRainfallHistoryMonthInfo(string year, string month, int AreaID)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND (AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                        WITH tbl_Data AS(
                        
                            SELECT  R.StationNo,W.StationName,A.AreaID,A.AreaName
	                                ,DATEADD(day, -1, [DataTime]) AS DataTime
                                    ,[D1] AS [RainValue]
                            FROM     tbl_RainfallRealTimeInfo_CN AS R INNER JOIN
                                    tbl_RainStationRealTimeWeightList AS W ON R.StationNo = W.StationNo INNER JOIN
                                    tbl_IrrigationAreaInfo AS A ON W.AreaID = A.AreaID
                            WHERE datepart(hh,DataTime) = 0 AND datepart(mi,DataTime) = 0
                        )

                        SELECT * FROM
                        (
	                        SELECT	t1.[AreaID], t2.AreaName ,[RainValue]
			                        ,t3.RainVal_Max_M,t3.RainVal_SUM_M,t3.RainVal_Count_M
			                        ,t4.RainVal_SUM_Y,
			                        YEAR(DataTime) AS Year,
			                        Month(DataTime) AS Month,
			                        'D'+CONVERT(varchar(2), Day(DataTime)) AS Day
	                        FROM tbl_Data AS t1
	                        Left join tbl_IrrigationAreaInfo AS t2 ON t1.AreaID = t2.AreaID
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,MONTH(DataTime) AS Month
				                        ,MAX([RainValue]) AS RainVal_Max_M
				                        ,SUM([RainValue]) AS RainVal_SUM_M
				                       
										,Count(NULLIF([RainValue],0)) AS RainVal_Count_M
		                        FROM tbl_Data AS t1
		                        GROUP BY YEAR(DataTime), MONTH(DataTime) ,t1.[AreaID]
	                        ) AS t3 ON t1.AreaID = t3.AreaID AND YEAR(t1.DataTime) = t3.Year AND MONTH(t1.DataTime) = t3.Month
	                        Left join
	                        (
		                        SELECT	t1.[AreaID]
				                        ,YEAR(DataTime) AS Year
				                        ,SUM([RainValue]) AS RainVal_SUM_Y
		                        FROM tbl_Data AS t1
		         
		                        GROUP BY YEAR(DataTime) ,t1.[AreaID]
                        ) AS t4 ON t1.AreaID = t4.AreaID AND YEAR(t1.DataTime) = t4.Year
                        ) AS T1
                        PIVOT(
	                        MAX(RainValue)
	                        FOR Day in([D1],[D2],[D3],[D4],[D5],[D6],[D7],[D8],[D9],[D10],
	                        [D11],[D12],[D13],[D14],[D15],[D16],[D17],[D18],[D19],[D20],
	                        [D21],[D22],[D23],[D24],[D25],[D26],[D27],[D28],[D29],[D30],[D31])
                        ) AS t2
                        WHERE  (Year = Year(GetDate())) AND (Month = Month(GetDate())){0}
                        ORDER BY AreaID, Year, Month
                     ", strSqlCondition);

                var result = defaultDB.Query<QueryRainfallHistoryInfo>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        Month = month,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 查詢灌區各站的歷史雨量
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="AreaID"></param>
        /// <returns></returns>
        public List<RainValueAverageTimeSeries> QueryRainfallHistoryTimeSeriesInfo(int AreaID, string year)
        {
            string strSqlCondition = string.Empty;
            if (AreaID != 0)
                strSqlCondition = " AND (AreaID = @AreaID)  ";
            try
            {
                string sqlStatement =
                    string.Format(@"
                       SELECT	AreaID, DataTime, RainValue,
                                RainValueEffective, RainValueSigma, 
                                RainValueEffectiveLimit, Duration, 
                                SUM(RainValue) OVER (PARTITION BY AreaID, Year(DataTime) ORDER BY DataTime) AS 'RainValue_Acc',
                                SUM(RainValueEffectiveLimit) OVER (PARTITION BY AreaID, Year(DataTime) ORDER BY DataTime) AS 'RainValueEffectiveLimit_Acc'
                        FROM tbl_RainfallAverageHistroy 
                        WHERE (Year(DataTime)>=2000) AND (Year(DataTime) = @year){0}
                        ORDER BY AreaID, DataTime
                     ", strSqlCondition);

                var result = defaultDB.Query<RainValueAverageTimeSeries>(
                    sqlStatement,
                    new
                    {
                        Year = year,
                        AreaID = AreaID
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        #endregion 查詢相關

        #region WRWSR 儀錶板

        #region 乾旱監測
        public List<VariableScaleSPI> GetDashBoardvsSPIData( string value)
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                             WITH DataAreaTbl AS(
	                            SELECT *
	                            FROM STRING_SPLIT(
	                            (
		                            SELECT value from tbl_AppParam  WHERE Category = 'DashBoard' AND Type = 'WidgetParam' AND Name = '_DroughtMonitoring'
	                            ),',') AS t1
                             )
 
                             SELECT * FROM(
	                            SELECT * FROM (
	                            SELECT t2.LabelName,t2.DataArea, YearValue, DataTypeValue, Rainfall, SPI1, vsSPI,
		                            CASE
			                            WHEN DataTypeValue >= 13 THEN YearValue
			                            WHEN DataTypeValue < 13 THEN YearValue
		                            END value,
		                            CASE
			                            WHEN DataTypeValue >= 13 THEN DataTypeValue-12
			                            WHEN DataTypeValue < 13 THEN DataTypeValue+24
		                            END No,
		                            CASE
			                            WHEN vsSPI is null THEN '0'
			                            WHEN vsSPI <= -0.5 AND vsSPI >-1 THEN '1'
			                            WHEN vsSPI <= -1 AND vsSPI >-1.5 THEN '2'
			                            WHEN vsSPI <= -1.5 AND vsSPI >-2 THEN '3'
			                            WHEN vsSPI <= -2 THEN '4'
		                            END Level
	                            FROM tbl_VariableScaleSPI AS t1
	                            LEFT JOIN tbl_VariableScaleSPIInfo AS t2 ON t1.DataArea = t2.DataArea			
	                            )AS t1
                            ) AS T1
                            WHERE DataArea in (SELECT *FROM DataAreaTbl)　
		                            --AND value = @value
                                     AND value = (SELECT MAX(YearValue) FROM tbl_VariableScaleSPI)
		                            AND DataTypeValue = (
			                            SELECT MAX(DataTypeValue) FROM tbl_VariableScaleSPI
			                            WHERE DataArea in (SELECT *FROM DataAreaTbl)
			                            AND value = (
					                            CASE
						                            WHEN DataTypeValue >= 13 THEN YearValue
						                            WHEN DataTypeValue < 13 THEN YearValue
					                            END 
					                            )
				                            )
                            ORDER BY  No DESC, LabelName
                        "
                        );

                var result = defaultDB.Query<VariableScaleSPI>(
                    sqlStatement,
                    new
                    {
                        value = value
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion

        #region 乾旱監測
        public List<DashBoardRainfallData> GetDashBoardRainfallData()
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            SELECT  [ReservoirGroup],[ReservoirGroupName],[PassMonthIndex]
                                  ,[Rain],[AVG_Val],[Percentage] ,[MaxTime]
                              FROM [vwDashBoardRainfallWidget]
                        "
                        );

                var result = defaultDB.Query<DashBoardRainfallData>(sqlStatement);

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<DashBoardRainfallData> GetDashBoardIrrigRainfallData()
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            SELECT  [ReservoirGroup],[ReservoirGroupName],[PassMonthIndex]
                                  ,[Rain],[AVG_Val],[Percentage] ,[MaxTime]
                              FROM [vwDashBoardIrrigRainfallWidget]
                        "
                        );

                var result = defaultDB.Query<DashBoardRainfallData>(sqlStatement);

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion

        #endregion

        #region WRWSR 即時雨量查詢
        /// <summary>
        /// 取得個邊界當日累積雨量
        /// </summary>
        /// <param name="BoundaryType"></param>
        /// <returns></returns>
        public List<RealTimeGridCumulativeDailyRainfall> GetRealTimeGridCumulativeDailyRainfall(int BoundaryType = 1, string IANo = "01")
        {
            string jointable = String.Empty;
            string joinfield = String.Empty;
            string joinDispNamefield = String.Empty;
            string QueryField = String.Empty;
            string whereCondi = String.Empty;

            if (BoundaryType == 1)
            {//水庫
                jointable = "tbl_wsReservoirStations_fhy";
                joinfield = "StationNo";
                joinDispNamefield = "StationName";

            }
            else if (BoundaryType == 2)
            {

            }
            else if (BoundaryType == 3)
            {
                jointable = "tbl_IrrigationAssn";
                joinfield = "IANo";
                joinDispNamefield = "Name";
            }
            else if (BoundaryType == 4)
            {

            }
            else if (BoundaryType == 5)
            {
                jointable = "tbl_IAStation";
                joinfield = "WorkStationId";
                joinDispNamefield = "WorkStationName";
                QueryField = "tbl_IAStation.IAName IAName, tbl_IAStation.IANo IANo,";
                whereCondi = "AND IANo = " + IANo;
            }

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            SELECT [BoundaryID], {3}
                                    {0}.{2} BoundaryName, 
		                            [BoundaryType], [DataTime], [Rain]
                            FROM [tbl_GridBoundaryRainfallRealTime]
                            LEFT JOIN {0} ON {0}.{1} = tbl_GridBoundaryRainfallRealTime.BoundaryID
                            WHERE DataTime = (SELECT TOP(1) DataTime FROM tbl_GridBoundaryRainfallRealTime ORDER BY DataTime DESC) AND  (BoundaryType = @BoundaryType)  {4}
                            ORDer by DataTime desc 
                        "
                        , jointable, joinfield, joinDispNamefield, QueryField, whereCondi
                        );

                var result = defaultDB.Query<RealTimeGridCumulativeDailyRainfall>(
                    sqlStatement,
                    new
                    {
                        BoundaryType = BoundaryType
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        /// <summary>
        /// 取得各邊界範圍累積雨量(不含當日)
        /// </summary>
        /// <param name="BoundaryType"></param>
        /// <returns></returns>
        public List<RealTimeGridCumulativeDailyRainfall> GetRealTimeGridCumulativeRangeRainfall(string StartDate, string EndDate, int BoundaryType = 1, string IANo = "01")
        {
            string jointable = String.Empty;
            string joinfield = String.Empty;
            string joinDispNamefield = String.Empty;
            string QueryField = String.Empty;
            string whereCondi = String.Empty;

            if (BoundaryType == 1)
            {//水庫
                jointable = "tbl_wsReservoirStations_fhy";
                joinfield = "StationNo";
                joinDispNamefield = "StationName";
                QueryField = "";
                whereCondi = "";
            }
            else if (BoundaryType == 2)
            {

            }
            else if (BoundaryType == 3)
            {
                jointable = "tbl_IrrigationAssn";
                joinfield = "IANo";
                joinDispNamefield = "Name";
                QueryField = "";
                whereCondi = "";
            }
            else if (BoundaryType == 4)
            {

            }
            else if (BoundaryType == 5)
            {
                jointable = "tbl_IAStation";
                joinfield = "WorkStationId";
                joinDispNamefield = "WorkStationName";
                QueryField = "tbl_IAStation.IAName IAName, tbl_IAStation.IANo IANo,";
                whereCondi = "AND IANo = " + IANo;
            }

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            WITH tbl_union AS(
                                SELECT [BoundaryID], {3}
                                    {0}.{2} BoundaryName, 
		                            [BoundaryType], [DataTime], [Rain]
	                            FROM [tbl_GridBoundaryRainfallRealTime]
	                            LEFT JOIN {0} ON {0}.{1} = tbl_GridBoundaryRainfallRealTime.BoundaryID
	                            WHERE DataTime = (SELECT TOP(1) DataTime FROM tbl_GridBoundaryRainfallRealTime ORDER BY DataTime DESC) AND  (BoundaryType = @BoundaryType)
	                            UNION ALL
                                SELECT [BoundaryID], {3}
                                    {0}.{2} BoundaryName, 
		                            [BoundaryType], [DataTime], [Rain]
	                            FROM [tbl_GridBoundaryRainfallRealTime]
	                            LEFT JOIN {0} ON {0}.{1}  = tbl_GridBoundaryRainfallRealTime.BoundaryID
	                            WHERE  FORMAT(DataTime, 'HH:mm') = '00:00' AND  (BoundaryType = @BoundaryType)  
                            )

                            SELECT BoundaryID,BoundaryName,BoundaryType,SUM(Rain)Rain FROM tbl_union
                            WHERE DataTime between @StartDate+' 00:01' AND @EndDate+' 23:59' {4}
                            GROUP BY BoundaryID,BoundaryName,BoundaryType
                            ORDER BY BoundaryID ASC,BoundaryName,BoundaryType
                        "
                        , jointable, joinfield, joinDispNamefield, QueryField, whereCondi
                        );

                var result = defaultDB.Query<RealTimeGridCumulativeDailyRainfall>(
                    sqlStatement,
                    new
                    {
                        StartDate = StartDate,
                        EndDate = EndDate,
                        BoundaryType = BoundaryType
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得網格當日累積雨量
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public List<GridRainfallValue> GetRealTimeGridDailyRainfall()
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            SELECT  [DataTime],[X1],[Y1],[DataValue]
                            FROM [A304_WRWSR].[dbo].[tbl_GridCumulativeDailyRainfall]
                            WHERE DataTime = (SELECT TOP(1) DataTime FROM [tbl_GridCumulativeDailyRainfall] ORDER BY DataTime DESC)
                            ORDER BY [DataTime] Desc , Y1 ,X1
                        "
                        );

                var result = defaultDB.Query<GridRainfallValue>(
                    sqlStatement);

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /// <summary>
        /// 取得網格範圍累積雨量(不含當日)
        /// </summary>
        /// <param name="StationNo"></param>
        /// <returns></returns>
        public List<GridRainfallValue> GetRealTimeGridRangeRainfall(string StartDate, string EndDate)
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            WITH tbl_union AS(
	                            SELECT  [DataTime],[X1],[Y1],[DataValue]
	                            FROM [A304_WRWSR].[dbo].[tbl_GridCumulativeDailyRainfall]
	                            WHERE DataTime = (SELECT TOP(1) DataTime FROM [tbl_GridCumulativeDailyRainfall] ORDER BY DataTime DESC)
	                            UNION ALL
	                            SELECT [DataTime],[X1],[Y1],[DataValue]
	                            FROM tbl_GridCumulativeDailyRainfall
	                            WHERE FORMAT(DataTime, 'HH:mm') = '00:00'
                            )
                            SELECT Y1,X1,SUM(DataValue)DataValue FROM tbl_union
                            WHERE DataTime between @StartDate+' 00:01' AND @EndDate+' 23:59'
                            GROUP BY Y1,X1
                            ORDER BY Y1 ,X1
                        "
                        );

                var result = defaultDB.Query<GridRainfallValue>(
                    sqlStatement,
                    new
                    {
                        StartDate = StartDate,
                        EndDate = EndDate
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion WRWSR 即時雨量查詢

        #region WRWSR 累積雨量超越機率
        public List<FhyAverageTenDaysRainfall> GetAverageTenDaysRainfallData(string StationNo, int DataStartYear, int DataEndYear)
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
			                SELECT t1.StationNo,t2.TenDayNo, t2.StartDate, t2.EndDate
		                            --,SUM(AccumulatedRainfall_AVG)/COUNT(t2.TenDayNo) AccumulatedRainfall_AVG
		                            --,SUM(t1.InflowTotal_AVG)/COUNT(t2.TenDayNo) InflowTotal_AVG
		                            ,SUM(AccumulatedRainfall_AVG) AccumulatedRainfall_AVG
		                            ,SUM(t1.InflowTotal_AVG) InflowTotal_AVG
		                            ,COUNT(t2.TenDayNo)TenDayNoCount
                            FROM
                            (
	                            SELECT [StationNo]
		                            ,FORMAT(Time,'MM-dd') MDDate
		                            ,SUM(AccumulatedRainfall)/COUNT(YEAR(Time)) AS AccumulatedRainfall_AVG
		                            ,SUM(InflowTotal)/COUNT(YEAR(Time)) AS InflowTotal_AVG
	                            FROM vwReservoirDataApplication
	                            WHERE　Year(Time) != Year(GETDATE())　 AND FORMAT(Time,'MM-dd') != '02-29'  
	                                  AND StationNo = @StationNo　AND Year(Time) >= @DataStartYear AND Year(Time) <= @DataEndYear 
	                            GROUP BY FORMAT(Time,'MM-dd') ,StationNo
                            ) t1
                            LEFT JOIN vwTenDaysList t2 ON  CONCAT('1990-',t1.MDDate) 
                            Between CONCAT('1990-',FORMAT(t2.StartDate,'MM-dd')) AND CONCAT('1990-',FORMAT(t2.EndDate,'MM-dd'))
                            GROUP BY t2.TenDayNo ,t1.StationNo, t2.StartDate, t2.EndDate
                            ORDER BY t2.TenDayNo
                        "
                        );

                var result = defaultDB.Query<FhyAverageTenDaysRainfall>(
                    sqlStatement,
                    new
                    {
                        StationNo = StationNo,
                        DataStartYear = DataStartYear,
                        DataEndYear = DataEndYear
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<GridAverageTenDaysRainfall> GetGridAverageTenDaysRainfallData(
            string BoundaryID, BoundaryType BoundaryType = BoundaryType.Reservoir,
            SummaryField FieldName = SummaryField.AccumulatedRainfall, SummaryType DataType = SummaryType.TenDays,
            int DataStartYear = 1965, int DataEndYear = 2021
            )
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                        SELECT  BoundaryID 
                              ,DataTypeValue
                              ,BoundaryType
                              ,DataType
                              ,FieldName
	                          ,FORMAT(DataTypeValueDate,'MM-dd') MDDate
                              ,SUM(TotalValue)/COUNT(TotalValue) AccumulatedRainfall_AVG
                              ,SUM(AverageValue)/COUNT(TotalValue)AverageValue_AVG
                        FROM tbl_DataSourceSummary
                        WHERE BoundaryType=@BoundaryType AND BoundaryID = @BoundaryID AND DataType = @DataType AND FieldName = @FieldName
                            AND Year(DataTypeValueDate) >=@DataStartYear AND Year(DataTypeValueDate)<=@DataEndYear
                        GROUP BY FORMAT(DataTypeValueDate,'MM-dd'), DataTypeValue, BoundaryID, BoundaryType, DataType, FieldName
                        "
                        );

                var result = defaultDB.Query<GridAverageTenDaysRainfall>(
                    sqlStatement,
                    new
                    {
                        BoundaryID = BoundaryID,
                        BoundaryType = BoundaryType,
                        FieldName = FieldName.ToString(),
                        DataType = DataType.ToString(),
                        DataStartYear = DataStartYear,
                        DataEndYear = DataEndYear
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<TenDaysQData> GetTenDaysQData(
            string BoundaryID, int BoundaryType,
            string PiField, string PiType,
            int DataStartYear = 1965, int DataEndYear = 2021
            )
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
			                SELECT [BoundaryID],[BoundaryType]
                                  ,[StartDate],[EndDate]
	                              ,[PiField],[PiType],[PiTypeValue],[PiCalcType],[PiTypeValueDate]
                                  ,[Q10],[Q20],[Q30],[Q40],[Q50],[Q60],[Q70],[Q75],[Q80],[Q85],[Q90],[Q95],[QAverage]
                              FROM [tbl_GridBoundaryPiValue]
                              WHERE  BoundaryType = @BoundaryType AND BoundaryID = @BoundaryID
		                            AND PiField = @PiField AND PiType = @PiType
		                            AND Year(StartDate) = @DataStartYear AND Year(EndDate) = @DataEndYear
                        "
                        );

                var result = defaultDB.Query<TenDaysQData>(
                    sqlStatement,
                    new
                    {
                        BoundaryID = BoundaryID,
                        BoundaryType = BoundaryType,
                        PiField = PiField,
                        PiType = PiType,
                        DataStartYear = DataStartYear,
                        DataEndYear = DataEndYear
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public List<GBRHTenDaysRainfallData> GetUnfTenDaysRainfallData(
            string BoundaryID, string StartDate, string EndDate
            , BoundaryType BoundaryType = BoundaryType.Reservoir
            )
        {

            try
            {

                string sqlStatement = String.Empty;
                if (BoundaryType == BoundaryType.Reservoir)
                {
                    sqlStatement =
                    string.Format(
                        @"
                            SELECT 0 DataTyp, StationNo BoundaryID, 1 BoundaryType, YearValue, PeriodOfYear TypeValue, DataValue Rain
                            FROM ufn_His_RSH_Rain_Tendays(@StartDate,@EndDate)
                            WHERE StationNo = @BoundaryID
                        "
                        );
                }
                else if(BoundaryType == BoundaryType.IA || BoundaryType == BoundaryType.WorkStation)
                {
                    sqlStatement =
                    string.Format(
                        @"
			                SELECT * FROM ufn_His_GBRH_Tendays(@StartDate,@EndDate,@BoundaryID,@BoundaryType)
                        "
                        );
                }

                var result = defaultDB.Query<GBRHTenDaysRainfallData>(
                    sqlStatement,
                    new
                    {
                        BoundaryID = BoundaryID,
                        StartDate = StartDate,
                        EndDate = EndDate,
                        BoundaryType = BoundaryType
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        #endregion WRWSR 累積雨量超越機率

        #region WRWSR 乾旱監測(SPI)

        public List<VariableScaleSPI> GetVariableScaleSPIData(string DataArea, string[] value)
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
                            SELECT * FROM (
                            SELECT t2.LabelName,t2.DataArea, YearValue, DataTypeValue, Rainfall, SPI1, vsSPI,
	                            CASE
		                            WHEN DataTypeValue >= 13 THEN YearValue
		                            WHEN DataTypeValue < 13 THEN YearValue-1
	                            END value,
	                            CASE
		                            WHEN DataTypeValue >= 13 THEN DataTypeValue-12
		                            WHEN DataTypeValue < 13 THEN DataTypeValue+24
	                            END No
                            FROM tbl_VariableScaleSPI AS t1
                            LEFT JOIN tbl_VariableScaleSPIInfo AS t2 ON t1.DataArea = t2.DataArea			
                            )AS t1
                            WHERE DataArea = @DataArea　AND value in @value
                        "
                        );

                var result = defaultDB.Query<VariableScaleSPI>(
                    sqlStatement,
                    new
                    {
                        DataArea = DataArea,
                        value = value
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        #endregion WRWSR 乾旱監測(SPI)

        #region WRWSR 未來兩週累計雨量估計

        public List<GridRainfallValue> GetFutureWeekGridRainfall(int afterWeekNum = 1)
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
			                SELECT t1.GridNumber, DataTime,Longitude X1, Latitude Y1 , RainValue DataValue
                               FROM tbl_GridInfo AS t1
                               LEFT JOIN tbl_GridCumulativeWeeklyRainfallForecast AS t2 ON t1.GridNumber = t2.GridNumber
                               WHERE GridSize = 1 
									AND t2.DataTime = 
									(
										SELECT TOP(1) DATEADD(day,@dayOffset,DataTime) FROM tbl_GridCumulativeWeeklyRainfallForecast
										ORDER BY DataTime asc
									) 
									AND GridType = 1
                                    ORDER BY t1.GridNumber
                        "
                        );

                var result = defaultDB.Query<GridRainfallValue>(
                    sqlStatement,
                    new
                    {
                        dayOffset = 7 * (afterWeekNum - 1)
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        #endregion WRWSR 乾旱監測(SPI)

        #region WRWSR 實際有效雨量分析
        public List<ActualEffectiveRainfallData> GetWorkStationActualEffectiveRainfallData(string StartDate, string EndDate, string IANo = "01")
        {

            try
            {
                string sqlStatement =
                string.Format(
                        @"
			                SELECT 
				                 DataType 
				                , BoundaryID, t1.WorkStationName, BoundaryType, YearValue, TypeValue, EffectiveRainfall
				                , (((TypeValue-1)/3)+1) AS Month
				                , CAST((((TypeValue-1)/3)+1) AS Varchar )+'.'+
				                CASE 
					                WHEN (TypeValue%3) = 1 THEN '上'
					                WHEN (TypeValue%3) = 2 THEN '中'
					                WHEN (TypeValue%3) = 0 THEN '下'
				                END AS TypeValueText
			                FROM
			                (
				                --各邊界歷史有效雨量資料
				                SELECT  1 as DataType,
						                BoundaryID, BoundaryType, YEAR(DataTime) AS YearValue, 
						                dbo.ufn_PeriodOfYear(DataTime) AS TypeValue, 
						                SUM(EffectiveRainfall) AS EffectiveRainfall
				                FROM    tbl_GridBoundaryEffectiveRainfallHistory
				                WHERE   DataTime Between @StartDate And @EndDate
						                And BoundaryID in (SELECT WorkStationId FROM tbl_IAStation WHERE IANo = @IANo) 
						                And BoundaryType = 5
				                GROUP BY  BoundaryID, BoundaryType, YEAR(DataTime), dbo.ufn_PeriodOfYear(DataTime)		

				                UNION ALL

				                --各邊界即時有效雨量資料
				                SELECT 2 as DataType,
						                BoundaryID, BoundaryType, YEAR(DataTime) AS YearValue, 
						                dbo.ufn_PeriodOfYear(DataTime) AS TypeValue, 
						                SUM(EffectiveRainfall) AS EffectiveRainfall
				                FROM    tbl_GridBoundaryEffectiveRainfallRealTime
				                WHERE  DataTime Between @StartDate And @EndDate
						                And BoundaryID in (SELECT WorkStationId FROM tbl_IAStation WHERE IANo = @IANo) 
						                And BoundaryType = 5
				                GROUP BY  BoundaryID, BoundaryType, YEAR(DataTime), dbo.ufn_PeriodOfYear(DataTime)
			                ) AS allData
			                LEFT JOIN tbl_IAStation AS t1 ON t1.WorkStationId = allData.BoundaryID
                        "
                        );

                var result = defaultDB.Query<ActualEffectiveRainfallData>(
                    sqlStatement,
                    new
                    {
                        StartDate = StartDate,
                        EndDate = EndDate,
                        IANo = IANo
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        #endregion 實際有效雨量分析

        #region WRWSR 歷史同期雨量枯旱排名

        public List<RainRankData> GetDateRangeIAGridRainRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {
            try
            {
                string sqlStatement =
                string.Format(
                        @"
                        WITH tbl_raw AS 
                        (
	                        SELECT [BoundaryID], Name, [BoundaryType], DATEADD(DAY,-1,[DataTime])[DataTime], SUM([Rain])value
	                        FROM tbl_GridBoundaryRainfallRealTime t1
	                        LEFT JOIN tbl_IrrigationAssn AS t2 ON t1.BoundaryID = t2.IANo
	                        WHERE BoundaryType = 3 AND datepart(HH,[DataTime]) = 0 AND BoundaryID = @BoundaryID
	                        GROUP BY BoundaryID, Name, BoundaryType, DataTime
	                        UNION ALL
	                        SELECT [BoundaryID], Name, [BoundaryType], [DataTime], SUM([Rain])value
	                        FROM tbl_GridBoundaryRainfallHistory t1
	                        LEFT JOIN tbl_IrrigationAssn AS t2 ON t1.BoundaryID = t2.IANo 
	                        WHERE BoundaryType = 3 AND datepart(HH,[DataTime]) = 0 AND BoundaryID = @BoundaryID
	                        GROUP BY BoundaryID, Name, BoundaryType, DataTime
                        )

                        SELECT *, ROW_NUMBER() OVER (ORDER BY value ASC) as Rank FROM
                        (
	                        SELECT BoundaryID, Name, BoundaryType, MIN(DataTime) StartDate, 
                                   MAX(DataTime) EndDate, SUM(value)value, 
                                   Count(rn) DayCount,
                                   DATEDIFF(day, @startDate,@endDate)+1 - Count(rn) as MissDayCount 
		                        FROM tbl_raw AS t1
	                        INNER JOIN (
		                        SELECT * FROM GetDateTable(@startDate,@endDate)
	                        ) AS t2 ON FORMAT(t1.DataTime, 'MM-dd')  = FORMAT(t2.DateTime, 'MM-dd')
	                        WHERE Year(t1.DataTime) between @dataStartYear AND @dataEndYear
	                        GROUP BY  YEAR(t1.DataTime)-YEAR(t2.DateTime), BoundaryID ,Name, BoundaryType
                        ) AS t3
                        --WHERE DayCount = DATEDIFF(day, @startDate,@endDate)+1
                        ORDER BY value ASC
                        "
                        );

                var result = defaultDB.Query<RainRankData>(
                    sqlStatement,
                    new
                    {
                        BoundaryID = BoundaryID,
                        startDate = startDate,
                        endDate = endDate,
                        dataStartYear= dataStartYear,
                        dataEndYear= dataEndYear
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public List<RainRankData> GetDateRangeReservoirRainRankData(
            string BoundaryID, string startDate, string endDate, int dataStartYear = 1000, int dataEndYear = 5000)
        {
            try
            {
                string sqlStatement =
                string.Format(
                        @"
                        WITH tbl_raw AS 
                        (
	                        SELECT R.StationNo AS BoundaryID, S.StationName AS Name, 999 AS BoundaryType
			                        ,Time AS DataTime
			                        ,AccumulatedRainfall AS value
			                        --,InflowTotal AS value
			                        --,EffectiveStorage AS value
	                        FROM [vwReservoirDataApplication] AS R 
	                        INNER JOIN tbl_wsReservoirStations_fhy AS S ON R.StationNo = S.StationNo
	                        WHERE R.StationNo = @BoundaryID
                        )

                        SELECT *, ROW_NUMBER() OVER (ORDER BY value ASC) as Rank FROM
                        (
	                        SELECT BoundaryID, Name, BoundaryType, MIN(DataTime) StartDate, 
                                   MAX(DataTime) EndDate, SUM(value)value, 
                                   Count(rn) DayCount,
								   DATEDIFF(day, @startDate,@endDate)+1 - Count(rn) as MissDayCount 
		                        FROM tbl_raw AS t1
	                        INNER JOIN (
		                        SELECT * FROM GetDateTable(@startDate,@endDate)
	                        ) AS t2 ON FORMAT(t1.DataTime, 'MM-dd')  = FORMAT(t2.DateTime, 'MM-dd')
	                        WHERE Year(t1.DataTime) between @dataStartYear AND @dataEndYear
	                        GROUP BY  YEAR(t1.DataTime)-YEAR(t2.DateTime), BoundaryID ,Name, BoundaryType
                        ) AS t3
                        --WHERE DayCount = DATEDIFF(day, @startDate,@endDate)+1
                        ORDER BY value ASC
                        "
                        );

                var result = defaultDB.Query<RainRankData>(
                    sqlStatement,
                    new
                    {
                        BoundaryID = BoundaryID,
                        startDate = startDate,
                        endDate = endDate,
                        dataStartYear = dataStartYear,
                        dataEndYear = dataEndYear
                    });

                return result.ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        #endregion WRWSR 歷史同期雨量枯旱排名

        #region 有效雨量分析

        /// <summary>
        /// 取得各邊界歷史有效雨量 年度列表
        /// </summary>
        /// <returns></returns>
        public List<int> GetGBERHistoryYearList()
        {
            string sqlStatement =
                @"
                    SELECT distinct(YEAR(DataTime)) as Year
                    FROM tbl_GridBoundaryEffectiveRainfallHistory
                    ORDER BY Year Desc
                ";

            var result = defaultDB.Query<int>(sqlStatement);
            return result.ToList();
        }

        /// <summary>
        /// 取得各邊界歷史有效雨量 年度列表(民國年)
        /// </summary>
        /// <returns></returns>
        public List<YearList> GetGBERHistoryROCYearList()
        {
            string sqlStatement =
                @"
                    SELECT distinct(YEAR(DataTime)) as Year
                    FROM tbl_GridBoundaryEffectiveRainfallHistory
                    ORDER BY Year Desc
                ";

            var result = defaultDB.Query<YearList>(sqlStatement);

            //轉為民國年
            foreach (var item in result)
                item.Year = item.Year - 1911;

            return result.ToList();
        }

        /// <summary>
        /// 實際有效雨量資料更新時間
        /// </summary>
        /// <returns></returns>
        public DateTime GetGBERRealTime()
        {
            string sqlStatement =
                @"
                    SELECT        TOP (1) DataTime
                    FROM           tbl_GridBoundaryEffectiveRainfallRealTime
                    ORDER BY  DataTime DESC
                ";

            var result = defaultDB.Query<DateTime>(sqlStatement).FirstOrDefault();
            return result;
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界灌溉計畫有效雨量(月)
        /// </summary>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public List<GBER_PIVOT_Month> QueryWorkstation_GBPER_Month(string IANo)
        {
            string sqlStatement = string.Empty;
            //各邊界歷史有效雨量有資料的最新的年度
            RainDataHelper rainDataHelper = new RainDataHelper();
            int DataYear = rainDataHelper.GetGBERHistoryYearList().FirstOrDefault();

            //依管理處名單取回 
            CommonDataHelper commonDataHelper = new CommonDataHelper();
            List<IAStation> WorkStationList = commonDataHelper.GetIAStationList(IANo);

            List<GBER_PIVOT_Month> DataList = new List<GBER_PIVOT_Month>();
            foreach (var item in WorkStationList)
            {
                sqlStatement = 
                    string.Format(@"

                        SELECT * FROM 
                        (
					        SELECT        tbl_IAStation.WorkStationName as SystemName, V.*
					        FROM           tbl_IAStation INNER JOIN
								(SELECT BoundaryID, BoundaryType, 
								        'T' + CAST(TypeValue AS varchar(2)) AS TypeValue,
                                        EffectiveRainfall
								FROM    dbo.ufn_His_GBPER_Month(@DataYear, @BoundaryID, @BoundaryType) AS ufn_His_GBPER_Month_1) AS V 
								ON tbl_IAStation.WorkStationId = V.BoundaryID

                        ) AS X
                        PIVOT
                        (
                            SUM(EffectiveRainfall)
                            FOR TypeValue IN 
                            ([T1],[T2],[T3],[T4],[T5],[T6],[T7],[T8],[T9],[T10],[T11],[T12])
                        ) AS PVT

                        ");

                var result = defaultDB.Query<GBER_PIVOT_Month>(
                    sqlStatement,
                    new
                    {
                        DataYear = DataYear,
                        BoundaryID = item.WorkStationId,
                        BoundaryType = 5
                    }).FirstOrDefault();
                                
                if (result != null) DataList.Add(result);
            }

            return DataList;
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界有效雨量(月)
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public List<GBER_PIVOT_Month> QueryWorkstation_GBER_Month(int DataYear, string IANo)
        {
            string sqlStatement = string.Empty;
            //依管理處名單取回 
            CommonDataHelper commonDataHelper = new CommonDataHelper();
            List<IAStation> WorkStationList = commonDataHelper.GetIAStationList(IANo);

            List<GBER_PIVOT_Month> DataList = new List<GBER_PIVOT_Month>();
            foreach (var item in WorkStationList)
            {
                sqlStatement =
                    string.Format(@"

                        SELECT * FROM 
                        (
					        SELECT        tbl_IAStation.WorkStationName as SystemName, V.*
					        FROM           tbl_IAStation INNER JOIN
								(SELECT BoundaryID, BoundaryType, 
								        'T' + CAST(TypeValue AS varchar(2)) AS TypeValue,
                                        EffectiveRainfall								
								FROM    dbo.ufn_His_GBER_Month(@StartDate, @EndDate, @BoundaryID, @BoundaryType) AS ufn_His_GBER_Month_1) AS V 
								ON tbl_IAStation.WorkStationId = V.BoundaryID

                        ) AS X
                        PIVOT
                        (
                            SUM(EffectiveRainfall)
                            FOR TypeValue IN 
                            ([T1],[T2],[T3],[T4],[T5],[T6],[T7],[T8],[T9],[T10],[T11],[T12])
                        ) AS PVT

                        ");

                var result = defaultDB.Query<GBER_PIVOT_Month>(
                    sqlStatement,
                    new
                    {
                        StartDate = string.Format("{0}/{1}/{2}", DataYear + 1911, "01", "01"),
                        EndDate = string.Format("{0}/{1}/{2}", DataYear + 1911, "12", "31"),
                        BoundaryID = item.WorkStationId,
                        BoundaryType = 5
                    }).FirstOrDefault();

                if (result != null) DataList.Add(result);
            }

            return DataList;
        }

        /// <summary>
        /// 依管理處取回 工作站各邊界有效雨量(旬)
        /// </summary>
        /// <param name="DataYear"></param>
        /// <param name="IANo"></param>
        /// <returns></returns>
        public List<GBER_PIVOT_Tendays> QueryWorkstation_GBER_Tendays(int DataYear, string IANo)
        {
            string sqlStatement = string.Empty;
            //依管理處名單取回 
            CommonDataHelper commonDataHelper = new CommonDataHelper();
            List<IAStation> WorkStationList = commonDataHelper.GetIAStationList(IANo);

            List<GBER_PIVOT_Tendays> DataList = new List<GBER_PIVOT_Tendays>();
            foreach (var item in WorkStationList)
            {
                sqlStatement =
                    string.Format(@"
                        SELECT * FROM 
                        (
					        SELECT      tbl_IAStation.WorkStationName as SystemName, V.*
					        FROM        tbl_IAStation INNER JOIN
								    (SELECT 
                                        BoundaryID, BoundaryType, 
								        'T' + CAST(TypeValue AS varchar(2)) AS TypeValue, 
                                        EffectiveRainfall
								    FROM  dbo.ufn_His_GBER_Tendays(@StartDate, @EndDate, @BoundaryID, @BoundaryType) AS ufn_His_GBER_Tendays_1) AS V 
								    ON tbl_IAStation.WorkStationId = V.BoundaryID

                        ) AS X
                        PIVOT
                        (
                            SUM(EffectiveRainfall)
                            FOR TypeValue IN 
                            ([T1],[T2],[T3],[T4],[T5],[T6],[T7],[T8],[T9],[T10],[T11],
                            [T12],[T13],[T14],[T15],[T16],[T17],[T18],[T19],[T20],[T21],
                            [T22],[T23],[T24],[T25],
                            [T26],[T27],[T28],[T29],[T30],[T31],[T32],[T33],[T34],[T35],[T36])
                        ) AS PVT
                        ");

                var result = defaultDB.Query<GBER_PIVOT_Tendays>(
                    sqlStatement,
                    new
                    {
                        StartDate = string.Format("{0}/{1}/{2}", DataYear + 1911, "01", "01"),
                        EndDate = string.Format("{0}/{1}/{2}", DataYear + 1911, "12", "31"),
                        BoundaryID = item.WorkStationId,
                        BoundaryType = 5
                    }).FirstOrDefault();
                
                if (result != null) DataList.Add(result);
            }

            return DataList;
        }

        #endregion 有效雨量分析
    }


}
